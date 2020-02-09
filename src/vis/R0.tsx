import { AggregatedInfo } from "../model/type";
import React from "react";
import { Chart, Geom, Axis, Tooltip, } from "bizcharts";
import DataSet from "@antv/data-set";
import { ChartContainer } from "./styled";
import { useIncrementalProcess } from './utils';

interface Props {
    agg: AggregatedInfo[];
}

const dv = new DataSet.View()
    .transform({
        type: "map",
        callback(row: AggregatedInfo) {
            return {
                R0: row.R0,
                time:
                    row.datetime.day +
                    Math.floor((row.datetime.scene / 3) * 10) / 10
            };
        }
    });


export const R0 = ({ agg }: Props) => {
    const data = useIncrementalProcess(agg, dv);
    return (
        <ChartContainer>
            <h3>R0</h3>
            <Chart
                height={220}
                padding={[20, 40, 40, 180]}
                data={data}
                forceFit
            >
                <Axis name="time" />
                <Axis name="value" />
                <Tooltip
                    crosshairs={{
                        type: "y"
                    }}
                />
                <Geom
                    type="line"
                    position="time*R0"
                    size={2}
                />
            </Chart>
        </ChartContainer>
    );
};
