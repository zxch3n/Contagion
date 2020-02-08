import React from "react";
import { StackPopulation } from "./vis/StackPopulation";
import { DistrictDistribution } from "./vis/DistrictDistribution";
import { PatientInfo } from "./vis/PatientInfo";
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

const { Global } = G2; // 获取 Global 全局对象
// @ts-ignore
Global.registerTheme("new", theme);
// @ts-ignore
Global.setTheme("new");

class App extends React.Component {
    world = new WorldModel(defaultWorldParam);
    looping: boolean;
    state: {
        data: AggregatedInfo[];
    };
    buffIndex: number = 0;
    constructor(prop) {
        super(prop);
        this.looping = false;
        this.state = {
            data: []
        };
        this.world.start();
    }

    componentWillMount() {
        document.body.style.backgroundImage = `url(${img})`;
    }

    playLoop = () => {
        if (this.buffIndex > 100) {
            this.setState({ data: this.world.aggData });
            this.buffIndex = 0;
        } else {
            for (let i = 0; i < 10; i++) {
                this.world.step();
            }
            
            this.buffIndex += 10;
        }

        if (this.looping) {
            setTimeout(this.playLoop, 0);
        }
    };

    step = () => {
        this.looping = false;
        this.world.step();
        console.log(this.world.datetime);
        this.setState({ data: this.world.aggData });
    };

    play = () => {
        this.looping = true;
        this.playLoop();
    };

    reset = () => {
        this.world = new WorldModel(defaultWorldParam);
        this.world.start();
        this.setState({data: []})
        this.looping = false;
    };

    pause = () => {
        this.looping = false;
    };

    render() {
        return (
            <Row className={"main"}>
                <Col xl={14} lg={24}>
                    <World />
                    <Row>
                        <Button
                            onClick={this.play}
                            style={{ margin: "0.2rem 1rem" }}
                            icon="caret-right"
                        >
                            Play
                        </Button>
                        <Button
                            onClick={this.step}
                            style={{ margin: "0.2rem 1rem" }}
                            icon="step-forward"
                        >
                            Step
                        </Button>
                        <Button
                            onClick={this.pause}
                            style={{ margin: "0.2rem 1rem" }}
                            icon="pause"
                        >
                            Pause
                        </Button>
                        <Button
                            onClick={this.reset}
                            style={{ margin: "0.2rem 1rem" }}
                            icon="close"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={()=>{console.log("test")}}
                            style={{ margin: "0.2rem 1rem" }}
                        >
                            Test
                        </Button>
                    </Row>
                </Col>

                <Col xl={10} lg={24}>
                    <div className="charts">
                        <StackPopulation agg={this.state.data} />
                        <DistrictDistribution agg={this.state.data} />
                        <PatientInfo agg={this.state.data} />
                    </div>
                </Col>
            </Row>
        );
    }
}

export default App;
