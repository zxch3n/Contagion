import {
    IWorld,
    IIndividual,
    WorldParam,
    DateTime,
    Districts,
    IDisease,
    IllState,
    isInfectious,
    AggregatedInfo,
    QuanrantineState
} from "./type";
import { Individual } from "./Individual";
import { District } from "./District";
import { Hospital } from "./Hospital";

export class World implements IWorld {
    disease: IDisease;
    districts: Districts;
    datetime: DateTime;
    numberOfScenePerDay: number;
    individuals: Individual[];

    constructor(public param: WorldParam) {
        this.numberOfScenePerDay = param.numberOfScenePerDay;
        this.disease = param.disease;
        this.individuals = [];
        const medicalBed = new District(
            "medicalBed",
            { x: 0, y: 0 },
            param.medicine.medicalBedNumber,
            1
        );
        this.districts = {
            medicalBed,
            living: new District(
                "living",
                { x: 0, y: 0 },
                param.population / 10,
                10
            ),
            publicTransport: new District(
                "publicTransport",
                { x: 0, y: 0 },
                param.population / 30,
                30
            ),
            hospital: new Hospital(
                param.medicine,
                medicalBed,
                { x: 0, y: 0 },
                param.medicine.doctorNum,
                5
            ),
            facility: new District(
                "facility",
                { x: 0, y: 0 },
                param.population / 20,
                20
            ),
            work: new District(
                "work",
                { x: 0, y: 0 },
                param.population / 10,
                10
            ),
            cemetery: new District("cemetery", { x: 0, y: 0 }, 1, 50000)
        };

        for (let i = 0; i < param.population; i++) {
            const home = this.districts.living.randomPlace();
            const hasCar = Math.random() < param.region.privateCarRate;
            const individual = new Individual({
                isDoctor: false,
                workPlace: this.districts.work.randomPlace(),
                currentPlace: home,
                home,
                hasCar,
                illState: IllState.susceptible,
                targetingFacilityPlaces: Array(param.region.facilityActiveRate)
                    .fill(0)
                    .map(this.districts.facility.randomPlace),
                // TODO: set visiting hospital rate
                visitingHospitalRate: this.param.medicine.visitingHospitalRate,
                wearMask: false,
                hospitalPlace: undefined,
                treatmentState: {
                    isConfirmed: false,
                    quanrantine: QuanrantineState.none,
                    isSuspected: false
                }
            });
            home.push(individual);
            this.individuals.push(individual);
        }

        const docNum = param.medicine.doctorNum;
        for (let i = 0; i < docNum; i++) {
            const index = Math.floor(Math.random() * param.population);
            this.individuals[index].isDoctor = true;
            this.individuals[index].workPlace = this.districts.hospital.places[
                i
            ];
        }

        this.datetime = {
            day: 0,
            scene: 0
        };
    }

    start() {
        this.individuals[0].illState = IllState.latentlyInfactious;
    }

    goToWork() {
        for (const id of this.individuals) {
            id.gotoWork(this.districts);
        }
    }

    party() {
        const places = this.districts.living.places;
        for (let i = 0; i < places.length; i++) {
            if (places[i].length === 0) {
                continue;
            }

            if (Math.random() < this.param.family.partyRate) {
                const b = (i + Math.floor(Math.random() * 10) + 1) % 500;
                places[i].merge(places[b]);
            }
        }
    }

    callItADay() {
        for (const id of this.individuals) {
            id.goHome();
        }

        this.party();
    }

    goRandomPlace() {
        for (const id of this.individuals) {
            id.goRandomPlace(this.districts);
        }
    }

    infectOther(
        id: IIndividual,
        others: Set<IIndividual>,
        inHospital: boolean
    ) {
        if (!isInfectious(id.illState)) {
            return;
        }

        for (
            let iter = others.values(), other = null;
            (other = iter.next().value);

        ) {
            if (other.illState !== IllState.susceptible) {
                continue;
            }

            let rate = this.param.disease.infectiousRate;
            if (inHospital) {
                if (id.isDoctor || other.isDoctor) {
                    rate = this.param.medicine
                        .infactiousRateBetweenDoctorAndPatient;
                } else {
                    rate = this.param.medicine
                        .infactiousRateBetweenDoctorAndPatient;
                }
            }
            if (Math.random() < rate) {
                other.illState = IllState.incubating;
            }
        }
    }

    infect() {
        for (const id of this.individuals) {
            if (id.isDead) {
                continue;
            }

            this.infectOther(
                id,
                id.currentPlace.people,
                id.currentPlace.district === this.districts.hospital || id.currentPlace.district === this.districts.medicalBed
            );
        }
    }

    upgradeDisease() {
        for (const id of this.individuals) {
            id.upgrade(this.param.disease);
            // Move body to cemetery
            if (id.illState === IllState.dead) {
                id.beInPlace(this.districts.cemetery.places[0]);
            }
        }
    }

    preMove() {
        for (const id of this.individuals) {
            id.preGoto(this.districts.publicTransport);
        }
    }

    nextScene() {
        this.datetime.scene++;
        if (this.datetime.scene === this.numberOfScenePerDay) {
            this.datetime.day++;
            this.datetime.scene = 0;
        }
    }

    step() {
        this.upgradeDisease();
        this.preMove();
        this.infect();
        if (this.datetime.scene === 0) {
            this.goToWork();
        } else if (this.datetime.scene === this.numberOfScenePerDay - 1) {
            this.callItADay();
        } else {
            this.goRandomPlace();
        }

        this.districts.hospital.exam();
        this.infect();
        this.nextScene();
    }

    isEnd() {
        const info = this.aggregateInfo;
        if (
            info.population.exposedInfactious +
                info.population.latentlyInfactious +
                info.population.serious +
                info.population.incubating ===
            0
        ) {
            return true;
        }

        return false;
    }

    get aggregateInfo(): AggregatedInfo {
        const agg: AggregatedInfo = {
            districtDistribution: {
                medicalBed: 0,
                cemetery: 0,
                facility: 0,
                hospital: 0,
                living: 0,
                publicTransport: 0,
                work: 0
            },
            population: {
                dead: 0,
                incubating: 0,
                exposedInfactious: 0,
                latentlyInfactious: 0,
                recovered: 0,
                serious: 0,
                susceptible: 0
            },
            quarantined: {
                total: 0,
                atHome: 0,
                atHospital: 0,
                confirmed: 0,
                suspected: 0
            },
            datetime: this.datetime
        };

        for (const id of this.individuals) {
            // @ts-ignore
            agg.population[IllState[id.illState]] += 1;
            if (!id.isDead) {
                if (id.treatmentState.quanrantine === QuanrantineState.atHome) {
                    agg.quarantined.total++;
                    agg.quarantined.atHome++;
                }

                if (
                    id.treatmentState.quanrantine ===
                    QuanrantineState.atHospital
                ) {
                    agg.quarantined.total++;
                    agg.quarantined.atHospital++;
                }

                if (id.treatmentState.isConfirmed) {
                    agg.quarantined.confirmed ++;
                }

                if (id.treatmentState.isSuspected) {
                    agg.quarantined.suspected ++;
                }
            }
        }

        for (const key in this.districts) {
            agg.districtDistribution[key] += this.districts[key].population;
        }

        return agg;
    }
}