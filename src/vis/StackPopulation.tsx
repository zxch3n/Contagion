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

export const StackPopulation = ({ agg }: Props) => {
    const data = agg.map((row) => ({
        ...row.population,
        time: row.datetime.day + Math.floor(row.datetime.scene / 3 * 10) / 10
    }));

    const dv = new DataSet.View().source(data).transform({
        type: "fold",
        fields: [
            "susceptible",
            "incubating",
            "latentlyInfactious",
            "exposedInfactious",
            "serious",
            "dead",
            "recovered"
        ],
        key: 'state',
        value: 'value',
        retains: ['time']
    });
    return (
        <ChartContainer>
            <h3>
                Ill State Distribution
            </h3>
            <Chart
                data={dv}
                forceFit
                height={220}
                padding={
                    [20, 40, 40, 180]
                }
            >
                <Axis name="time" />
                <Axis name="value" />
                <Legend position={'left'}/>
                <Tooltip
                    crosshairs={{
                        type: "cross"
                    }}
                />
                <Geom
                    // TODO: 添加渐变色
                    type="areaStack"
                    position="time*value"
                    color="state"
                    opacity={0.3}
                />
                <Geom
                    type="lineStack"
                    position="time*value"
                    size={2}
                    color="state"
                />
            </Chart>
        </ChartContainer>
    );
};
