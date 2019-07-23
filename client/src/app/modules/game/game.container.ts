import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client, Room } from 'colyseus.js';
import { Subscription } from 'rxjs';

import { switchCase, isPrimitive } from '../../shared/utils';
import { setState } from './handlers';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { PlayersListComponent } from './components/players-list/players-list.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';

export const initialState: any = { // !todo move to const file
    players: {},
    rounds: [],
    status: 'created',
};

@Component({
    selector: 'app-game',
    templateUrl: './game.container.html',
    styleUrls: ['./game.container.sass']
})
export class GameContainer implements OnInit, OnDestroy {
    private subs: Subscription = new Subscription();

    private client: Client;
    public room: Room;

    private wsHost: string = this.getWsHost();
    public state: any;
    public rooms: Room[];
    public playerNick: string;
    public playersListOpened: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private dialogService: DialogService
    ) {
        this.subs.add(this.route.queryParams.subscribe((params) => {
            if (params['room']) {
                this.joinRoom({ room: params['room'] });
            }
        }));
        this.client = new Client(this.wsHost);
        this.playerNick = this.getPlayerNick();

        this.setState(initialState);
        this.attachClientListeners();
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private getPlayerNick() {
        return localStorage.getItem('nickname');
    }

    private getWsHost(): string {
        const localWsHost: string = `ws://${window.location.hostname}:1200`;
        const prodWsHost: string = `wss://${window.location.hostname}`;

        return location.hostname === 'localhost' ? localWsHost : prodWsHost;
    }

    public hidePlayersList() {
        this.playersListOpened = false;
    }

    public showPlayersList() {
        this.dialogService.open(PlayersListComponent, {
            data: { players: this.state.players }
        });
    }

    public showSettings() {
        this.dialogService.open(GameSettingsComponent, {
            data: {  }
        });
    }

    private getCurrentRound() {
        return [...this.state.rounds].pop();
    }

    public onHandCardClick({ card, index }: { card: any, index: number }) {
        /**
         * Depending on [Round.status] we can decide if send card vote, or card select
         */

        const currentRound = this.getCurrentRound();

        console.log('onHandCardClick() - Round.status:', currentRound.status);
        console.log('onHandCardClick() args:', card, index);

        switchCase({
            created: () => this.room.send({
                type: 'SELECT_CARD',
                scope: 'ROUND',
                cardIndex: index,
            }),
            choices_done: () => {}, // in this case round master makes the move
            read_done: () => this.room.send({
                type: 'SET_VOTE',
                scope: 'ROUND',
                cardIndex: index,
                playerId: card.player
            }),
            voting_done: () => {},
        })(currentRound.status)();
    }

    // --- Room state --- //

    private setState(newState: any) { // !todo make it typed
        this.state = { ...this.state, ...newState };
    }

    // --- Room state listeners --- //

    /**
     * There are basically two types of values to listen - primitive and non-primitive
     * Let's give alias [simple] for [primitive] and [complex] for [non-primitive].
     * For example:
     *
     * State: {
     *     status: [primitive] - possible values are {String}
     *     rounds: [non-primitive] - possible values are non-primitive
     * }
     *
     * Simple properties:
     * @property {string} Room.status - current game status
     *
     * Complex properties:
     * @property {players} Room.players - map of players in current room
     * @property {rounds} Room.rounds - array of rounds in current room
     *
     * Mutating this fields on the server side will occur state synchronization between all clients
     * For unsynced fields use Room.onMessage event listener
     */

    private attachSimpleValuesListeners() {
        const simpleValues = { STATUS: 'status' };

        this.room.state.onChange = (changes: any[]) => changes
            .filter(({ value, previousValue }) => previousValue && isPrimitive(value))
            .forEach(({ value, field }) => {
                console.log(' --- room.state primitive change --- ');

                switchCase({
                    [simpleValues.STATUS]: () => console.log('Room.status:', field),
                    default: () => console.log(`Unhandled value change: ${field}`)
                })(field)();
            });
    }

    private attachComplexFieldsListeners() {
        // Room.players listeners:

        this.room.state.players.onAdd = (player: any, sessionId: string) => this.state.players[sessionId] = player;
        this.room.state.players.onChange = (player: any, sessionId: string) => this.state.players[sessionId] = player;
        this.room.state.players.onRemove = (player: any, sessionId: string) => delete this.state.players[sessionId];

        // Room.rounds listeners:

        this.room.state.rounds.onAdd = (round: any, roundIndex: number) => {
            console.log('rounds.onAdd');

            Object.keys(this.state.players).forEach(id => {
                this.state.players[id].isMaster = false;
            });

            this.setState({ mainCard: round.mainCard });
        };
        this.room.state.rounds.onChange = () => {};
        this.room.state.rounds.onRemove = () => console.warn('Room.rounds#onRemove');
    }

    private attachGameStateListeners() {
        // simple fields:
        this.attachSimpleValuesListeners();

        // complex fields:
        this.attachComplexFieldsListeners();
    }

    // --- Room events listeners with handlers --- //

    private onJoinRoom() {
        /**
         * [unsynced] state changes:
        */

        this.room.onMessage.add((action: any) => {
            const eventHandlers = setState(this.state);

            // console.log('New event onMessage:', action);

            switchCase({
                ROOM: () => this.setState(eventHandlers.room(action)),
                ROUND: () => this.setState(eventHandlers.round(action)),
            })(action.scope)();
        });

        /**
         * [synced] state changes:
        */

        this.attachGameStateListeners();
    }

    private attachRoomListeners() {
        const roomEvents = {
            ON_JOIN: 'onJoin',
            ON_STATE_CHANGE: 'onStateChange',
            ON_ERROR: 'onError',
            ON_LEAVE: 'onLeave',
        }; // !todo move to const file

        this.room[roomEvents.ON_JOIN].add(() => this.onJoinRoom()); // successfully joined (possibly new) room
        this.room[roomEvents.ON_LEAVE].add(() => console.log('Client left room.')); // successfully joined (possibly new) room
        this.room[roomEvents.ON_ERROR].add(() => {
            this.room = null;
            console.log('rumerror!');
        });
        this.room[roomEvents.ON_STATE_CHANGE].add((state: any) => {
            // console.log('wu:', state);

            this.setState(state);
        });
    }

    // --- Room methods --- //

    public dispatchAction(action: any) {
        // console.log('dispatchAction()', action);
        this.room.send(action.payload);
    }

    public joinRoom({ room = 'game', create = false }: { room?: string, create?: boolean }) { // lobby created, waiting for start
        this.room = this.client.join(room, { create, nickname: this.playerNick });
        this.attachRoomListeners();
    }

    // --- Client events listeners --- //

    private attachClientListeners() {
        this.client.onOpen.add(() => {
            console.log('Client Event: _onOpen');
            this.refreshRoomsList();
        });
        this.client.onClose.add(() => console.log('Client Event: _onClose'));
        this.client.onError.add((err: any) => {
            this.room = null;
            console.error('Client Error:', err);
        });
    }

    // --- Client methods --- //

    private async getRoomsList(name: string = 'game') {
        const rooms = await new Promise((resolve) => this.client.getAvailableRooms(name, resolve));

        return rooms || [];
    }

    private refreshRoomsList() {
        this.getRoomsList()
            .then((rooms: Room[]) => {
                console.log('Rooms fetched:', rooms);

                // if (rooms.length === 0) {
                //     this.joinRoom({ create: true });
                // }

                this.rooms = rooms;
            })
            .catch(console.error);
    }

}
