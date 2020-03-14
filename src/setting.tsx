import React from "react";
import { Modal, Button, InputNumber } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { WorldParam } from "./model/type";
import { defaultWorldParam } from "./config";
import styled from 'styled-components';

const SettingContainer = styled.div`
    padding: 0 0.3rem;
    margin: 0.2rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span {
        margin-right: 1rem;
    }
`;

const configEntries = {
    disease: {
        cureRate: "number",
        deadRate: "number",
        immuneRate: "number",
        infectiousRate: "number",
        name: "string",
        selfRecoverRate: "number",
        seriousRate: "number",
        toExposedInfactiousRate: "number",
        toLatentlyInfactiousRate: "number"
    },
    family: {
        partyRate: "number"
    },
    medicine: {
        confirmRate: "number",
        cureRateInHospital: "number",
        cureRateOnMedicalBed: "number",
        deteriorateFactorOnMedicalBed: "number",
        visitingHospitalRate: "number",
        doctorNum: "number",
        infactiousRateBetweenDoctorAndPatient: "number",
        infactiousRateBetweenPatients: "number",
        medicalBedNumber: "number"
    },
    individual: {
        goOutRateWhenQuarantedAtHome: "number",
        visitingHospitalRateWhenExposed: "number"
    },
    numberOfScenePerDay: "number",
    region: {
        densityOfPopulation: "number",
        doPeriodicPhysicalExamination: "number",
        facilityActiveRate: "number",
        privateCarRate: "number",
        unemploymentRate: "number"
    }
};

interface Props {
    setParams: (wordParam: WorldParam) => void;
}

const changeParam = (state: any, path: string[], value: any) => {
    const obj = Object.assign({}, state);
    let target = obj;
    let attr = "";
    for (let i = 0; i < path.length; i++) {
        attr = path[i];
        if (i !== path.length - 1) {
            target[attr] = Object.assign({}, target[attr]);
            target = obj[attr];
        }
    }

    target[attr] = value;
    return obj;
};

export const Setting: React.FunctionComponent<Props> = (props: Props) => {
    const [visible, setVisible] = React.useState(false);
    const [worldParam, setWorldParam] = React.useState(
        (JSON.parse(localStorage.getItem("world-param")) as WorldParam) ||
            defaultWorldParam
    );
    const setVisibleTrue = React.useCallback(() => {
        setVisible(true);
    }, []);
    const setVisibleFalse = React.useCallback(() => {
        setVisible(false);
    }, []);
    function genParamChanger(params: string[]) {
        return (value: any) =>
            setWorldParam(changeParam(worldParam, params, value));
    }
    const setParam = React.useCallback(() => {
        props.setParams(worldParam);
        localStorage.setItem("world-param", JSON.stringify(worldParam));
        setVisibleFalse();
    }, [props, worldParam, setVisibleFalse]);
    const settings = [];
    for (const parentName in configEntries) {
        const subtype = configEntries[parentName];
        settings.push(<h3>{parentName}</h3>);
        for (const settingName in subtype) {
            const settingType = subtype[settingName];
            if (settingType === "number") {
                const v = worldParam[parentName][settingName];
                const step = v !== 0 ? Math.floor(Math.log10(v)) : 0;
                settings.push(
                    <SettingContainer>
                        <span >{settingName}</span>
                        <InputNumber
                            key={parentName + "-" + settingType}
                            min={0}
                            max={1000}
                            step={Math.pow(10, step)}
                            onChange={genParamChanger([
                                parentName,
                                settingName
                            ])}
                            defaultValue={v}
                        />
                    </SettingContainer>
                );
            } else if (settingType === "string") {
                settings.push();
            }
        }
    }
    return (
        <div>
            <Button
                onClick={setVisibleTrue}
                style={{ margin: "0.5rem " }}
                icon={<SettingOutlined />}
            >
                Settings
            </Button>
            <Modal
                title={"Setting"}
                onOk={setParam}
                onCancel={setVisibleFalse}
                visible={visible}
            >
                {settings}
            </Modal>
            )
        </div>
    );
};
