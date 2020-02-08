import { AggregatedInfo } from "../model/type";
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import { useIncrementalProcess } from "./utils";
import { ChartContainer } from "./styled";
import Slider from "react-slick";

interface Props {
    agg: AggregatedInfo[];
}

const dv = new DataSet.View()
    .transform({
        type: "map",
        callback(row) {
            return {
                ...row.districtDistribution,
                ...row.datetime
            };
        }
    })
    .transform({
        type: "fold",
        fields: [
            "medicalBed",
            "living",
            "work",
            "publicTransport",
            "hospital",
            "facility",
            "cemetery"
        ],
        key: "state",
        value: "value",
        retains: ["day", "scene"]
    });

export const DistrictDistribution = ({ agg }: Props) => {
    const data = useIncrementalProcess(agg, dv, 7);
    const sceneNum = 3;
    const charts = React.useMemo(() => {
        const charts = [];
        for (let i = 0; i < sceneNum; i++) {
            const newDv = new DataSet.View().source(data).transform({
                type: "filter",
                callback(row) {
                    return row.scene === i;
                }
            });

            charts.push(
                <Chart
                    height={220}
                    padding={[20, 40, 40, 180]}
                    data={newDv}
                    forceFit
                    key={i}
                >
                    <Axis name="day" />
                    <Axis name="value" />
                    <Legend position="left" />
                    <Tooltip
                        crosshairs={{
                            type: "cross"
                        }}
                    />
                    <Geom type="areaStack" position="day*value" color="state" />
                    <Geom
                        type="lineStack"
                        position="day*value"
                        size={2}
                        color="state"
                    />
                </Chart>
            );
        }
        return charts;
    }, [data]);

    return (
        <ChartContainer style={{ padding: "0 12px 12px 12px" }}>
            <h3>Disctrict Distribution ({sceneNum} Scenes)</h3>
            <Slider
                dots
                infinite
                speed={300}
                slidesToScroll={1}
                slidesToShow={1}
                arrows={true}
            >
                {charts}
            </Slider>
        </ChartContainer>
    );
};
