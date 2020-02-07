import { AggregatedInfo } from "../model/type";
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import { ChartContainer } from "./styled";
import Slider from "react-slick";

interface Props {
    agg: AggregatedInfo[];
}

export const DistrictDistribution = ({ agg }: Props) => {
    const data = React.useMemo(
        () =>
            agg.map((row) => ({
                ...row.districtDistribution,
                ...row.datetime
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [agg, agg.length]
    );

    const dv = new DataSet.View().source(data).transform({
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

    const sceneNum = 3;
    const charts = [];
    for (let i = 0; i < sceneNum; i++) {
        const newDv = new DataSet.View().source(dv).transform({
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
                <Legend position="left"/>
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
