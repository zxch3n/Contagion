import {BoundingBox} from '../../model/type';
export interface Drawable {
    draw(): void;
}

export interface Tweenable {
    getTweenGroup(): any;
}