import {
    IDisease,
    IIndividual,
    IllState,
    Districts,
    TreatmentState,
    QuanrantineState,
    MedicalParam,
    IndividualParam
} from "./type";
import { upgradeIll } from "./Disease";
import { Place, District } from "./District";
import { Hospital } from "./Hospital";
import { IllRelation } from "./IllRelation";

// TODO: 插值动画
export class Individual implements IIndividual {
    currentPlace: Place;
    illRelation: IllRelation = new IllRelation(this);
    illState: import("./type").IllState;
    hasCar: boolean;
    visitingHospitalRate: number;
    wearMask: boolean;
    home: Place;
    workPlace?: Place;
    param: IndividualParam;
    hospitalPlace?: Place;
    targetingFacilityPlaces: Place[];
    treatmentState: TreatmentState;
    isDoctor: boolean;
    estimatedR0: number | undefined = undefined;

    constructor(data: IIndividual) {
        this.isDoctor = data.isDoctor;
        this.illState = data.illState;
        this.hasCar = data.hasCar;
        this.visitingHospitalRate = data.visitingHospitalRate;
        this.wearMask = data.wearMask;
        this.home = data.home;
        this.workPlace = data.workPlace;
        this.hospitalPlace = data.hospitalPlace;
        this.targetingFacilityPlaces = data.targetingFacilityPlaces;
        this.currentPlace = data.currentPlace;
        this.treatmentState = data.treatmentState;
        this.param = data.param;
    }

    get isQuarantined() {
        return (
            this.treatmentState.quanrantine > 0 ||
            this.illState === IllState.dead
        );
    }

    get isDead() {
        return this.illState === IllState.dead;
    }

    get cannotMoveAtAll() {
        return this.treatmentState.quanrantine === QuanrantineState.atHospital || this.illState === IllState.dead;
    }

    postInfect(other: Individual) {
        this.illRelation.infect(other);
    }

    preGoto(publicTransportDistrict: District) {
        // TODO: sometimes people don't move
        if (this.hasCar || this.isQuarantined) {
            // do not need to use public transport
            return;
        }

        this.beInPlace(publicTransportDistrict.nextAvailablePlace());
    }

    beInPlace(place: Place) {
        this.currentPlace.remove(this);
        this.currentPlace = place;
        place.push(this);
    }

    gotoWork(districts: Districts) {
        if (this.cannotMoveAtAll) {
            return;
        }

        if (this.treatmentState.quanrantine === QuanrantineState.atHome) {
            if (!districts.hospital.isFull) {
                this.beInPlace(districts.hospital.nextAvailablePlace());
            }

            return;
        }

        if (this.isDoctor) {
            this.beInPlace(this.workPlace);
            return;
        }


        if (this.workPlace) {
            this.beInPlace(this.workPlace);
        }
    }

    gotoFacility() {
        if (this.cannotMoveAtAll) {
            return;
        }

        if (this.isQuarantined) {
            return;
        }

        if (this.targetingFacilityPlaces.length >= 1) {
            let index = Math.floor(
                Math.random() * this.targetingFacilityPlaces.length
            );
            let count = 0;
            while (
                this.targetingFacilityPlaces[index].isFull &&
                count < this.targetingFacilityPlaces.length
            ) {
                index = (index + 1) % this.targetingFacilityPlaces.length;
                count++;
            }

            // if not full
            if (count !== this.targetingFacilityPlaces.length) {
                this.beInPlace(this.targetingFacilityPlaces[index]);
            }
        }
    }

    goHome() {
        if (this.cannotMoveAtAll) {
            return;
        }

        this.beInPlace(this.home);
    }

    gotoHospital(district: Hospital) {
        if (this.cannotMoveAtAll) {
            return;
        }

        this.beInPlace(district.nextAvailablePlace());
    }

    goRandomPlace(districts: Districts) {
        if (this.cannotMoveAtAll) {
            return;
        }

        if (
            !districts.hospital.isFull &&
            this.treatmentState.quanrantine === QuanrantineState.atHome
        ) {
            this.gotoHospital(districts.hospital);
            return;
        }

        if (
            !districts.hospital.isFull &&
            Math.random() < this.visitingHospitalRate
        ) {
            this.gotoHospital(districts.hospital);
            return;
        }

        if (!this.isQuarantined) {
            this.gotoFacility();
        } else if (
            this.treatmentState.quanrantine === QuanrantineState.atHome
        ) {
            if (Math.random() < this.param.goOutRateWhenQuarantedAtHome) {
                this.gotoFacility();
            }
        }
    }

    upgrade(disease: IDisease, param: MedicalParam) {
        let factor = 1;
        if (this.treatmentState.quanrantine === QuanrantineState.atHospital) {
            factor = param.deteriorateFactorOnMedicalBed;
        }

        this.illState = upgradeIll(this.illState, disease, factor);
        if (this.illState === IllState.serious) {
            if (this.treatmentState.quanrantine <= QuanrantineState.atHome) {
                this.treatmentState.quanrantine = QuanrantineState.atHome;
                this.visitingHospitalRate = 1;
            }
        } else if (this.illState === IllState.exposedInfactious) {
            this.visitingHospitalRate = this.param.visitingHospitalRateWhenExposed;
        }
    }

    get isWorking() {
        return this.illState <= IllState.latentlyInfactious;
    }
}
