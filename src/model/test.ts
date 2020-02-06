import {World} from './World';
const world = new World({
    disease: {
        cureRate: 1 / 3 / 30 / 50,
        deadRate: 1 / 3 / 30 / 100,
        immuneRate: 0,
        infectiousRate: 1 / 1000,
        name: 'virus',
        selfRecoverRate: 0.0,
        seriousRate: 1 / 3 / 50,
        toExposedInfactiousRate: 1 / 3 / 10,
        toLatentlyInfactiousRate: 1 / 3 / 4,
    },
    family: {
        familyPopulationDistribution: [
            [1000, 2],
            [500, 4],
            [250, 8],
            [125, 16]
        ],
        partyRate: 0.05,
    },
    medicine: {
        confirmRate: 0.05,
        cureRateInHospital: 0.0002,
        cureRateOnMedicalBed: 0.0004,
        deteriorateFactorOnMedicalBed: 0.5,
        visitingHospitalRate: 0.005,
        doctorNum: 200,
        infactiousRateBetweenDoctorAndPatient: 1 / 9000,
        infactiousRateBetweenPatients: 1 / 3000,
        medicalBedNumber: 0
    },
    individual: {
        goOutRateWhenQuarantedAtHome: 0.01,
        visitingHospitalRateWhenExposed: 0.02,
    },
    numberOfScenePerDay: 3,
    init: {
        origin: 'cemetery',
        initialSize: 40
    },
    region: {
        densityOfPopulation: 10,
        doPeriodicPhysicalExamination: true,
        facilityActiveRate: 10,
        privateCarRate: 0.2,
        unemploymentRate: 0.07
    }
})

world.start();
for (let i = 0; i < 30000; i++) {
    world.step();
    if (world.isEnd()) {
        console.log("End")
        break;
    }

    console.log(JSON.stringify(world.aggregateInfo, undefined, 2));
}

export const v = 0;