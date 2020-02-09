import React from "react";
import { StackPopulation } from "./vis/IllStateDist";
import { DistrictDistribution } from "./vis/DistrictDistribution";
import { PatientInfo } from "./vis/PatientInfo";
import { R0 } from "./vis/R0";
import { World } from "./vis/World";
import { Row, Col, Button } from "antd";
import { G2 } from "bizcharts";
import { theme, defaultWorldParam } from "./config";
import { World as WorldModel } from "./model/World";
import img from "./res/virus.jpg";
import "antd/dist/antd.css";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AggregatedInfo } from "./model/type";
import styled from "styled-components";

const { Global } = G2; // 获取 Global 全局对象
// @ts-ignore
Global.registerTheme("new", theme);
// @ts-ignore
Global.setTheme("new");

const timeSlots = ["00:00", "9:30", "18:00"];
const DatetimeContainer = styled.div`
    position: absolute;
    left: 1em;
    top: 1em;
    padding: 0.5em 1em;
    background-color: rgba(10, 20, 90, 0.6);
    border: 1px solid rgb(15, 30, 150);
    color: #aae;
    border-radius: 4px;
    box-shadow: 0 6px 4px 4px rgba(0, 0, 0, 0.2);
`;

class App extends React.Component {
    world = new WorldModel(defaultWorldParam);
    looping: boolean = false;
    state: {
        data: AggregatedInfo[];
        looping: boolean;
    };
    buffIndex: number = 0;
    worldRef: React.RefObject<World>;
    constructor(prop) {
        super(prop);
        this.state = {
            data: [],
            looping: false
        };
        this.world.start();
        this.worldRef = React.createRef();
    }

    componentWillMount() {
        document.body.style.backgroundImage = `url(${img})`;
    }

    playLoop = () => {
        if (!this.looping) {
            return;
        }

        if (this.buffIndex > 100) {
            this.setState({ data: this.world.aggData });
            this.buffIndex = 0;
        } else {
            for (let i = 0; i < 10; i++) {
                this.world.step();
            }

            this.buffIndex += 10;
        }

        setTimeout(this.playLoop, 0);
    };

    step = () => {
        this.pause();
        this.world.step();
        console.log(this.world.datetime);
        this.worldRef.current.step();
        this.setState({ data: this.world.aggData });
    };

    play = () => {
        this.start();
        this.playLoop();
    };

    reset = () => {
        this.world = new WorldModel(defaultWorldParam);
        this.world.start();
        this.setState({ data: [] });
        this.pause();
    };

    start = () => {
        this.setState({ looping: true });
        this.looping = true;
    };

    pause = () => {
        this.setState({ looping: false });
        this.looping = false;
    };

    render() {
        const style = {
            minHeight: 'calc(100vh - 200px)',
            boxShadow: '3px 0px 2px 0px rgba(0, 0, 0, 0.2)',
            padding: '2em',
        };
        const { datetime } = this.world;
        return (
            <Row className={"main"} type={'flex'} justify={'center'}>
                <Col xl={12} lg={24} style={style}>
                    <World world={this.world} ref={this.worldRef} />
                    <Row>
                        {!this.state.looping ? (
                            <Button
                                onClick={this.play}
                                style={{ margin: "0.5rem 0.5rem 0.5rem 0" }}
                                icon="caret-right"
                            >
                                Play
                            </Button>
                        ) : (
                            <Button
                                onClick={this.pause}
                                style={{ margin: "0.5rem 0.5rem 0.5rem 0" }}
                                icon="pause"
                            >
                                Pause
                            </Button>
                        )}
                        <Button
                            onClick={this.step}
                            style={{ margin: "0.5rem" }}
                            icon="step-forward"
                        >
                            Step
                        </Button>
                        <Button
                            onClick={this.reset}
                            style={{ margin: "0.5rem " }}
                            icon="close"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("test");
                            }}
                            style={{ margin: "0.5rem " }}
                        >
                            Test
                        </Button>
                    </Row>
                </Col>
                <Col xl={4} lg={11} style={style}>
                    <DatetimeContainer>
                        Day: {datetime.day}
                        <br />
                        Time: {timeSlots[datetime.scene]}
                    </DatetimeContainer>
                </Col>

                <Col xl={8} lg={11} style={style}>
                    <div className="charts">
                        <StackPopulation agg={this.state.data} />
                        <DistrictDistribution agg={this.state.data} />
                        <PatientInfo agg={this.state.data} />
                        <R0 agg={this.state.data} />
                    </div>
                </Col>
            </Row>
        );
    }
}

export default App;
