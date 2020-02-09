import { Individual as IndividualModel } from '../../model/Individual';
import { Drawable, Tweenable } from './Draw';
import { Districts, Position, } from '../../model/type';
import { District } from './District';
import TWEEN from '@tweenjs/tween.js';

const IllColors = ['blue', '#ddd', 'yellow', '#fa6', 'faa', '#a22', 'black'];
export class Individuals implements Drawable, Tweenable{
    individuals: IndividualModel[];
    positions: Position[];
    constructor(
        private ctx: CanvasRenderingContext2D,
        individuals: IndividualModel[],
        private districts: {[key in keyof Districts]: District}
    ){
        this.individuals = individuals.concat();
        this.positions = this.getCurrentPosition();
    }

    draw(){
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        for (let i = 0; i < this.individuals.length; i ++) {
            const individual = this.individuals[i];
            this.ctx.fillStyle = IllColors[individual.illState];
            this.ctx.beginPath();
            this.ctx.arc(this.positions[i].x, this.positions[i].y, 2, 0, Math.PI*2);
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    private getCurrentPosition() {
        const positions: Position[] = [];
        for (const individual of this.individuals) {
            const {index, district} = individual.currentPlace;
            const layoutDistrict: District = this.districts[district.name];
            const {x, y, w, h} = layoutDistrict.getPlaceBBox(index);
            positions.push({
                x: x + Math.floor(w * Math.random()),
                y: y + Math.floor(h * Math.random()),
            })
        }

        return positions;
    }

    getTweenGroup() {
        const group = new TWEEN.Group();
        const newPos = this.getCurrentPosition();
        for (let i = 0; i < this.individuals.length; i ++) {
            const tween = new TWEEN.Tween(this.positions[i], group)
                .to(newPos[i], 1000).start();
        }

        return group;
    }
}