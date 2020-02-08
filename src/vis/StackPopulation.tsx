import { AggregatedInfo } from "../model/type";
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import { ChartContainer } from "./styled";

interface Props {
    agg: AggregatedInfo[];
}

const dv = new DataSet.View()
    .transform({
        type: "map",
        callback(row) {
            return {
                ...row.population,
                time:
                    row.datetime.day +
                    Math.floor((row.datetime.scene / 3) * 10) / 10
            };
        }
    })
    .transform({
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
        key: "state",
        value: "value",
        retains: ["time"]
    });

export const StackPopulation = ({ agg }: Props) => {
    const [data, setData] = React.useState([]);
    const [processedData, setProcessedData] = React.useState([]);
    React.useEffect(() => {
        let old = processedData;
        let newData;
        if (agg.length > data.length) {
            newData = agg.slice(data.length);
        } else {
            old = [];
            newData = agg;
        }

        dv.source(newData);
        setProcessedData(old.concat(dv.rows));
        setData(agg);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agg, agg.length]);

    return (
        <ChartContainer>
            <h3>Ill State Distribution</h3>
            <Chart
                data={processedData}
                forceFit
                height={220}
                padding={[20, 40, 40, 180]}
            >
                <Axis name="time" />
                <Axis name="value" />
                <Legend position={"left"} />
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
