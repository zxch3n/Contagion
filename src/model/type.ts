// TODO: patients' priorities
import { Hospital } from "./Hospital";
import { Place, District, LivingQuater } from "./District";

export interface IDisease {
    name: string;
    infectiousRate: number; // 健康 -> 患病
    toLatentlyInfactiousRate: number; // 1 / 传染潜伏期
    toExposedInfactiousRate: number; // 1 / 暴露潜伏期
    seriousRate: number; // 病重率
    deadRate: number; // 死亡率 （病重 -> 死亡）
    selfRecoverRate: number;
    cureRate: number;
    immuneRate: number;
}

export enum IllState {
    recovered = 0,
    susceptible = 1,
    incubating = 2,
    latentlyInfactious = 3,
    exposedInfactious = 4,
    serious = 5,
    dead = 6,
}

export function isInfectious(illState: IllState) {
    return illState > 1;
}

export interface BoundingBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

export enum QuanrantineState {
    none = 0,
    atHome = 1,
    atHospital = 2,
}

export interface TreatmentState {
    quanrantine: QuanrantineState;
    isSuspected: boolean;
    isConfirmed: boolean;
}

export interface IIndividual {
    isDoctor: boolean;
    illState: IllState;
    treatmentState: TreatmentState;
    hasCar: boolean;
    visitingHospitalRate: number;
    wearMask: boolean;
    home: Place;
    currentPlace: Place;
    workPlace?: Place; // default working at home
    hospitalPlace?: Place; // default working at home
    targetingFacilityPlaces: Place[];
    param: IndividualParam;
}

export interface RegionalParam {
    unemploymentRate: number;
    densityOfPopulation: number;
    doPeriodicPhysicalExamination: boolean;
    facilityActiveRate: number; // 一个人会在几个 facility places 当中活跃
    privateCarRate: number;
}

export interface MedicalParam {
    doctorNum: number;
    cureRateInHospital: number;
    cureRateOnMedicalBed: number;
    deteriorateFactorOnMedicalBed: number;
    visitingHospitalRate: number;
    confirmRate: number;
    medicalBedNumber: number;
    infactiousRateBetweenDoctorAndPatient: number;
    infactiousRateBetweenPatients: number;
}

export interface FamilyParam {
    familyPopulationDistribution: [number, number][];
    partyRate: number;
}

export interface IndividualParam {
    goOutRateWhenQuarantedAtHome: number;
    visitingHospitalRateWhenExposed: number;
}

export interface Initialization {
    origin: keyof Districts; // TODO: 
    initialSize: number;
}

export interface WorldParam {
    individual: IndividualParam;
    disease: IDisease;
    numberOfScenePerDay: number; // 一天几幕, default 3
    region: RegionalParam;
    medicine: MedicalParam;
    family: FamilyParam;
    init: Initialization;
}

export interface Size {
    width: number;
    height: number;
}
export interface IWorld {
    disease: IDisease;
    individuals: IIndividual[];
    districts: Districts;
    datetime: DateTime;
}

export interface DateTime {
    day: number;
    scene: number;
}

export interface Districts {
    living: LivingQuater,
    work: District,
    publicTransport: District,
    hospital: Hospital,
    medicalBed: District,
    facility: District,
    cemetery: District
}

export interface Position {
    x: number;
    y: number;
}


export interface AggregatedInfo {
    districtDistribution: {
        medicalBed: number,
        living: number,
        work: number,
        publicTransport: number,
        hospital: number,
        facility: number,
        cemetery: number
    },
    population: {
        susceptible: number;
        incubating: number;
        latentlyInfactious: number;
        exposedInfactious: number;
        serious: number;
        dead: number;
        recovered: number;
    },
    quarantined: {
        total: number;
        atHome: number;
        atHospital: number;
        confirmed: number;
        suspected: number;
    },
    doctor: {
        available: number,
        dead: number,
        ill: number,
        total: number
    },
    R0: number;
    datetime: DateTime
}