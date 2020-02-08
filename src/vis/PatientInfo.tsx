import { AggregatedInfo } from "../model/type";
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import { ChartContainer } from "./styled";
import { useIncrementalProcess } from './utils';

interface Props {
    agg: AggregatedInfo[];
}

const dv = new DataSet.View()
    .transform({
        type: "map",
        callback(row) {
            return {
                ...row.quarantined,
                time:
                    row.datetime.day +
                    Math.floor((row.datetime.scene / 3) * 10) / 10
            };
        }
    })
    .transform({
        type: "fold",
        fields: ["confirmed", "suspected"],
        key: "state",
        value: "value",
        retains: ["time"]
    });


export const PatientInfo = ({ agg }: Props) => {
    const data = useIncrementalProcess(agg, dv, 2);
    return (
        <ChartContainer>
            <h3>Patients</h3>
            <Chart
                height={220}
                padding={[20, 40, 40, 180]}
                data={data}
                forceFit
            >
                <Axis name="time" />
                <Axis name="value" />
                <Legend position="left-center" />
                <Tooltip
                    crosshairs={{
                        type: "y"
                    }}
                />
                <Geom
                    type="line"
                    position="time*value"
                    color="state"
                    size={2}
                />
            </Chart>
        </ChartContainer>
    );
};
