import { District as DistrictModel } from '../../model/District';
import { BoundingBox, } from '../../model/type';
import { MARGIN, WIDTH, HEIGHT} from './config';


export class District {
    placeBoundingBoxes: BoundingBox[];
    constructor(
        private district: DistrictModel,
        private bbox: BoundingBox,
        private ctx: CanvasRenderingContext2D,
        private name: string,
        private fill: string = 'rgba(100, 200, 230, 0.5)',
        private stroke: string = '',
    ) {
        this.init();
    }

    init() {
        this.placeBoundingBoxes = [];
        let curX = 6, curY = 0;
        for (let i = 0; i < this.district.places.length; i ++) {
            if (curX + WIDTH + 6 > this.bbox.w) {
                curX = 6;
                curY += MARGIN + HEIGHT;
            }

            this.placeBoundingBoxes.push({
                h: HEIGHT,
                w: WIDTH,
                x: curX + this.bbox.x,
                y: curY + this.bbox.y + 40
            })

            curX += WIDTH + MARGIN;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.fill;
        this.ctx.strokeStyle = this.stroke;
        this.ctx.fillRect(this.bbox.x, this.bbox.y, this.bbox.w, this.bbox.h);
        this.ctx.strokeStyle = '';
        this.ctx.fillStyle = '#bbb';
        this.ctx.font = "12px Fira Code";
        this.ctx.fillText(this.name, this.bbox.x + 10, this.bbox.y + 20);
        this.ctx.restore();

        // draw 污渍
    }

    getPlaceBBox(index: number): BoundingBox {
        return this.placeBoundingBoxes[index];
    }
}