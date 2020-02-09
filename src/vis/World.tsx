import React from "react";
import styled from "styled-components";
import { DateTime, Districts } from "../model/type";
import { World as WorldModel } from "../model/World";
import TWEEN from "@tweenjs/tween.js";
import { District } from "./main/District";
import { Individuals } from "./main/Individuals";

const Container = styled.div`
    min-width: 700px;
    min-height: 600px;
    position: relative;
`;

interface Props {
    world: WorldModel;
}

export class World extends React.Component<Props> {
    datetime: DateTime;
    canvas: React.RefObject<HTMLCanvasElement>;
    ctx?: CanvasRenderingContext2D;
    districts: { [key in keyof Districts]: District };
    individuals: Individuals;
    endTime?: number;
    animationKey?: number;
    world: WorldModel;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: Props) {
        super(props);
        this.canvas = React.createRef();
        this.world = this.props.world;
    }

    updateWorld() {
        if (this.world !== this.props.world) {
            this.world = this.props.world;
            this.init();
        }
    }

    componentDidMount() {
        if (!this.canvas.current) {
            return;
        }

        this.ctx = this.canvas.current.getContext("2d");
        this.init();
    }

    init() {
        this.districts = {
            facility: new District(
                this.world.districts.facility,
                { x: 200, y: 80, h: 180, w: 180 },
                this.ctx!,
                "Facility",
                "rgba(0, 255, 255, 0.08)"
            ),
            hospital: new District(
                this.world.districts.hospital,
                { x: 200, y: 280, h: 200, w: 180 },
                this.ctx!,
                "Hospital",
                "rgba(0, 255, 255, 0.08)"
            ),
            work: new District(
                this.world.districts.work,
                { x: 400, y: 0, h: 480, w: 300 },
                this.ctx!,
                "Work",
                "rgba(0, 255, 255, 0.08)"
            ),
            publicTransport: new District(
                this.world.districts.publicTransport,
                { x: 200, y: 0, h: 60, w: 180 },
                this.ctx!,
                "Public Transport",
                "rgba(0, 255, 255, 0.08)"
            ),
            living: new District(
                this.world.districts.living,
                { x: 0, y: 0, h: 480, w: 180 },
                this.ctx!,
                "Residential Area",
                "rgba(0, 255, 255, 0.08)"
            ),
            medicalBed: new District(
                this.world.districts.medicalBed,
                { x: 0, y: 500, h: 100, w: 580 },
                this.ctx!,
                "Quarantine Area",
                "rgba(0, 255, 255, 0.08)"
            ),
            cemetery: new District(
                this.world.districts.cemetery,
                { x: 600, y: 500, h: 100, w: 100 },
                this.ctx!,
                "Cemetery",
                "rgba(0, 255, 255, 0.08)"
            ),
        };

        this.individuals = new Individuals(this.ctx!, this.world.individuals, this.districts);
        this.animationKey = 0;
        this.draw(0);
    }

    draw(key: number, group?: any) {
        if (!this.ctx) {
            return;
        }

        this.updateWorld();
        this.ctx.save();
        this.ctx.translate(10, 10);
        this.ctx.scale(0.95 * 3, 0.95 * 3);
        this.ctx.clearRect(0, 0, 800, 800);
        for (const key in this.districts) {
            const dis: District = this.districts[key];
            dis.draw();
        }
        this.individuals.draw();
        this.ctx.restore();
        if (group) {
            group.update();
        }
        if (key === this.animationKey && this.endTime && new Date().getTime() < this.endTime) {
            requestAnimationFrame(()=>this.draw(key, group));
        }
    }

    step() {
        this.updateWorld();
        const group = this.individuals.getTweenGroup();
        this.endTime = new Date().getTime() + 2000;
        this.animationKey = Math.random();
        this.draw(this.animationKey, group);
    }

    test = () => {
        const position = [{ x: 0 }, { x: 100 }];
        const grp = new TWEEN.Group();
        new TWEEN.Tween(position, grp)
            .to([{ x: 100 }, { x: 0 }], 2000)
            .onUpdate((object) => {
                console.log(object, position);
            })
            .start();
        requestAnimationFrame(function anim() {
            requestAnimationFrame(anim);
            grp.update();
        });
    };

    render() {
        return (
            <Container>
                <canvas width={2100} height={1800} ref={this.canvas} style={{width: 700, height: 600}}/>
            </Container>
        );
    }
}
