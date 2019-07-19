import { Room, Client } from 'colyseus';
import logger from 'consola';

import { getAction, roomActions, roundActions } from './actions';
import { Player } from './schemas/Player';
import { Round } from './schemas/Round';
import { State } from './schemas/State';
import { RoomStatus } from './typings/RoomStatus';
import { RoundChoice } from './typings/RoundChoice';
import { RoundStatus } from './typings/RoundStatus';
import { generateCardsArraySchema, randomItem, switchCase } from './utils';

export class GameRoom extends Room<State> {
    maxClients: number = 10;

    onInit(options) {
        this.setState({
            players: {},
            rounds: [],
            status: 'created'
        });
    }

    requestJoin(options, isNewRoom: boolean) {
        return (options.create) ? (options.create && isNewRoom) : this.clients.length > 0;
    }

    private applyOptsToPlayer(player: Player, options: any) {
        Object.entries(options).filter(([key]) => player.hasOwnProperty(key)).forEach(([key, value]) => player[key] = options[key]);
    }

    public setRoomAdmin(client: Client, callback: Function) {
        const action = getAction(client, roomActions.setAdmin);

        logger.info('setRoomAdmin() - action:', action);

        callback(client, action);
    }

    public sendRoomStatusToAdmin(client: Client, status: RoomStatus, callback: Function) {
        const action = getAction(client, roomActions.setStatus, status);

        logger.info('sendRoomStatusToAdmin() - action:', action);

        callback(client, action);
    }

    public addPlayer(client: Client, options: { nickname: string }): void {
        const player = new Player();

        if (Object.keys(this.state.players).length === 0) {
            player.isAdmin = true;
            this.setRoomAdmin(client, this.send.bind(this));
            this.sendRoomStatusToAdmin(client, this.state.status, this.send.bind(this));
        }

        this.applyOptsToPlayer(player, options);
        this.state.players[client.sessionId] = player;
    }

    onJoin(client: Client, options: any) {
        this.addPlayer(client, options);

        console.log(`GameRoom: ${client.sessionId} joined!`);
    }

    onLeave(client: Client) {
        this.removePlayer(client.sessionId);
        
        console.log(`GameRoom: ${client.sessionId} left!`);
    }

    onMessage(client: Client, action: any) {
        console.log('Msg recieved. Action:', action);
        
        switchCase({
            ROOM: switchCase({
                SET_STATUS: () => {
                    this.sendRoomStatusToAdmin(client, action.status, this.send.bind(this));
                    this.setRoomStatus(action.status);
                },
            })(action.type),
            
            ROUND: switchCase({
                SELECT_CARD: () => this.handleCardSelect(client, action.cardIndex),
                SET_STATUS: () => this.setRoundStatus(action.status),
                SET_VOTE: () => this.handleVote(client, action.playerId),
            })(action.type),

            PLAYER: switchCase({
                SET_NICKNAME: () => this.setPlayerNickname(client, action.nickname),
            })(action.type),
        })(action.scope)();
    }

    onDispose() {
        logger.info('Dispose GameRoom');
    }

    public setRoomStatus(status: RoomStatus) {
        this.state.status = status;

        switchCase({
            'created': () => console.log('Status: created'),
            'active': () => {
                console.log('Status: active')
                if (this.state.rounds.length === 0) {
                    this.lock();
                    this.startGame();
                }
            },
            'paused': () => console.log('Status: paused'),
            'finished': () => console.log('Status: finished'),
        })(status)();
    }

    private updatePlayersScore(round: Round) {
        let max = 0;

        Object.values(round.moves).forEach((move) => {
            if (move.votes.length > max) {
                max = move.votes.length;
            }
        })

        Object.entries(round.moves).forEach(([playerId, move]) => {
            if (move.votes.length === max) {
                logger.info('update player score:', playerId);

                this.state.players[playerId].score += 1;
            }
        })
    }

    public setRoundStatus(status: RoundStatus, ...args: any) {
        const currentRound = this.state.rounds[this.state.rounds.length - 1];
        currentRound.status = status;

        switchCase({
            created: () => console.log('Status: created'),
            choices_done: () => {
                logger.success('CHOICES DONE BITCHES!');

                const roundMasterClient: Client = this.getClientBySessionId(currentRound.master);
                const choices = this.extractCardsFromMoves(currentRound.moves);
                const action = getAction(roundMasterClient, roundActions.showChoices, choices);

                return this.send(roundMasterClient, action);
            },
            read_done: () => { // show voting to players when read is done
                logger.success('READ DONE!');

                const roundMasterClient: Client = this.getClientBySessionId(currentRound.master);
                const choices = this.extractCardsFromMoves(currentRound.moves);
                const action = getAction(null, roundActions.showVoting, choices);

                this.broadcast(action, { except: roundMasterClient });
            },
            voting_done: () => {
                logger.success('VOTING DONE!');

                this.updatePlayersScore(currentRound)
                return this.startRound();
            },
        })(status)();

        logger.info('Round status:', status);
    }

    public startRound() {
        logger.info('-- Start round --');

        const round = new Round();
        const roundMaster = randomItem(this.clients);
        const client = this.getClientBySessionId(roundMaster.sessionId);
        const action = getAction(client, roundActions.setMaster);

        this.send(roundMaster, action);

        round.master = roundMaster.sessionId;
        this.state.rounds.push(round);

        this.clients.forEach((client) => {
            let cards;
            
            if (!this.state.players[client.sessionId].cards || this.state.players[client.sessionId].cards.length === 0) {
                cards = generateCardsArraySchema('hand', 10);
            } else {
                const neededCards = this.state.players[client.sessionId].cards.filter(card => card.selected).length;

                // logger.info('Client ', client.sessionId, 'need', neededCards, 'cards');

                cards = [
                    ...this.state.players[client.sessionId].cards.filter(c => !c.selected),
                    ...generateCardsArraySchema('hand', neededCards)
                ];
            }
            
            this.state.players[client.sessionId].cards = cards;
            this.setHandCards(client, cards);
        });
    }

    public startGame() {
        this.startRound();
        
        console.log('start game!');
    }

    public removePlayer(id: string) {
        console.log('delete!!', id);
        delete this.state.players[id];
    }

    public handleVote(client: Client, playerId: string) {
        const clientId = client.sessionId;
        const currentRound = this.state.rounds[this.state.rounds.length - 1];

        if (currentRound.alreadyVoted.includes(clientId)) {
            return logger.error('GŁOSOWAŁEŚ JUŻ ŚWINTUSZKU!');
        }

        // if (clientId === playerId || currentRound.moves[playerId].votes.includes(playerId)) {
        //     return logger.error('AJ TY ŚWINTUSZKU!');
        // }

        currentRound.moves[playerId].votes.push(clientId);
        currentRound.alreadyVoted.push(clientId);

        if (currentRound.alreadyVoted.length === this.clients.length - 1) { // -1 bcs of round master, who cant vote :D
            this.setRoundStatus('voting_done');
        }
    }

    public handleCardSelect(client: Client, cardIndex: number): void {
        const id = client.sessionId;
        const currentRound = this.state.rounds[this.state.rounds.length - 1];

        if (currentRound.master !== id && currentRound.status === 'created') {
            this.state.players[id].cards = this.markCardSelected(id, cardIndex, currentRound);

            this.setHandCards(client, this.state.players[id].cards);
        }
        
        if (currentRound.choicesDone === this.clients.length - 1) { // length - 1 bcs there is a master player
            const roundChoices = this.getRoundChoices(currentRound);
            currentRound.setRoundChoices(roundChoices);
            this.setRoundStatus('choices_done', currentRound);
        }
    }

    private extractCardsFromMoves(moves: Round['moves']) {
        return Object.entries(moves).map(([id, move]) => ({ player: id, card: move.cards[0] }))
    }

    private markCardSelected(id: string, cardIndex: number, round: Round) {
        round.choicesDone += 1;

        return this.state.players[id].cards.map((card, index) => {
            if (card.selected) { // dont increment if player just changed card
                round.choicesDone -= 1;
            }

            card.selected = index === cardIndex;
            return card;
        });
    }

    public setPlayerNickname(client: Client, nickname: string) {
        this.state.players[client.sessionId].nickname = nickname;
    }

    private setHandCards(client: Client, cards: any) {
        const action = getAction(client, roundActions.setHandCards, cards);

        this.send(client, action);
    }

    private getRoundChoices(round: Round): RoundChoice[] {
        return Object.entries(this.state.players)
            .filter(([id]) => round.master !== id)
            .map(([id, player]) => {
                const selectedCard = player.cards.find(card => card.selected);

                return {
                    cards: [selectedCard],
                    sessionId: id
                }
            })
    }

    private getClientBySessionId(id: string) {
        return this.clients.find(client => client.sessionId === id);
    }

}