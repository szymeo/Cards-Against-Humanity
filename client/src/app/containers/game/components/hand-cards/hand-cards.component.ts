import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';

@Component({
    selector: 'hand-cards',
    templateUrl: './hand-cards.component.html',
    styleUrls: ['./hand-cards.component.sass']
})
export class HandCardsComponent implements OnInit, OnChanges {
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    @Input() cards: any[];
    @Input() loop: boolean = true;

    // public cards: any[] = '1234567890'.split('');
    public sliderShown: boolean = true;
    public config: SwiperConfigInterface = {
        a11y: false,
        direction: 'horizontal',
        slidesPerView: 'auto',
        // loopedSlides: 2,
        keyboard: true,
        mousewheel: true,
        pagination: false,
        followFinger: true,
        allowTouchMove: true,
        preventClicks: true,
        loop: true,
        freeMode: true,
        freeModeMomentum: true,
        freeModeMomentumBounce: false,
        freeModeMomentumRatio: 1,
        freeModeMomentumVelocityRatio: 1,
        watchOverflow: true
    };

    constructor() { }

    ngOnInit() {
        console.log('swipe loop enabled:', this.loop);
        console.log('handCards, cards:', this.cards);

        if (this.loop === false) {
            this.config = {
                ...this.config,
                loop: false
            };
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.cards.currentValue) {
            this.config = { ...this.config, loop: false };
            this.sliderShown = false;
            setTimeout(() => this.sliderShown = true);
        }
    }

    public onIndexChange(index: number): void {
        // console.log('Swiper index: ', index);
    }

    public onSwiperEvent(event: string): void {
        // console.log('Swiper event: ', event);
    }

    public handleCardClick(card: any, index: number) {
        this.onClick.emit({ card, index });
    }

}
