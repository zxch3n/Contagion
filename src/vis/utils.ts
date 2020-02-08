
import React from "react";

export const useIncrementalProcess = (agg: any[], dv: any, foldSize: number = 1, MAX_DATA_SIZE = 1000) => {
    const [lastAggLength, setLastAggLength] = React.useState(0);
    const [processedData, setProcessedData] = React.useState([]);
    const [shrinkFactor, setShrinkFactor] = React.useState(1);
    React.useEffect(() => {
        let old = processedData;
        let newData;
        if (agg.length > lastAggLength) {
            if (agg.length < lastAggLength + shrinkFactor * 2) {
                return;
            }

            newData = agg.slice(lastAggLength).filter((_, index) => index % shrinkFactor === 0);
        } else {
            old = [];
            newData = agg;
        }

        if (old.length > MAX_DATA_SIZE) {
            setShrinkFactor(shrinkFactor * 2);
            old = old.filter((_, index) => Math.floor(index / foldSize) % 2 === 0)
        }

        dv.source(newData);
        setProcessedData(old.concat(dv.rows));
        setLastAggLength(agg.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agg, agg.length]);

    return processedData;
}