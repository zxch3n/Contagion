
import { AggregatedInfo } from "../model/type";
import React from "react";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import {ChartContainer} from './styled';


interface Props {
    agg: AggregatedInfo[];
}

export const PatientInfo = ({ agg }: Props) => {
    const data = agg.map((row) => ({
        ...row.quarantined,
        time: row.datetime.day + Math.floor(row.datetime.scene / 3 * 10) / 10
    }));

    const dv = new DataSet.View().source(data).transform({
        type: "fold",
        fields: [
            "confirmed",
            "suspected",
        ],
        key: 'state',
        value: 'value',
        retains: ['time']
    });
    return (
        <ChartContainer >
            <h3>
                Patients
            </h3>
            <Chart
                height={220}
                padding={[20, 40, 40, 180]}
                data={dv}
                forceFit
            >
                <Axis name="time" />
                <Axis name="value" />
                <Legend position="left-center"/>
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
