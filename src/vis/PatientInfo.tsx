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
        setData(newData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agg, agg.length]);

    return (
        <ChartContainer>
            <h3>Patients</h3>
            <Chart
                height={220}
                padding={[20, 40, 40, 180]}
                data={processedData}
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
