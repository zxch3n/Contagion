import {IDisease, IIndividual, Position, isInfectious, IllState, Districts, TreatmentState, QuanrantineState, MedicalParam, IndividualParam} from './type';
import {upgradeIll} from './Disease';
import { Place, District } from './District';
import { Hospital } from './Hospital';

// TODO: 插值动画
export class Individual implements IIndividual{
    currentPlace: Place;
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
        return this.treatmentState.quanrantine > 0 || this.illState === IllState.dead;
    }

    get isDead() {
        return this.illState === IllState.dead;
    }

    preGoto(publicTransportDistrict: District) {
        // TODO: sometimes people don't move
        if (this.hasCar || this.isQuarantined) {
            // do not need to use public transport
            return;
        }

        this.beInPlace(publicTransportDistrict.randomPlace());
    }

    beInPlace(place: Place) {
        this.currentPlace.remove(this);
        this.currentPlace = place;
        place.push(this);
    }

    gotoWork(districts: Districts) {
        if (this.isDead || this.treatmentState.quanrantine === QuanrantineState.atHospital ) {
            return;
        }

        if (this.isDoctor) {
            this.beInPlace(this.workPlace);
            return;
        }

        if (!districts.hospital.isFull && this.treatmentState.quanrantine === QuanrantineState.atHome) {
            this.beInPlace(districts.hospital.randomPlace());
            return;
        }

        if (this.workPlace) {
            this.beInPlace(this.workPlace);
        }
    }

    gotoFacility() {
        if (this.isQuarantined) {
            return;
        }

        if (this.targetingFacilityPlaces.length >= 1) {
            const index = Math.floor(Math.random() * this.targetingFacilityPlaces.length);
            this.beInPlace(this.targetingFacilityPlaces[index]);
        }
    }

    goHome() {
        if (this.isQuarantined) {
            return;
        }

        this.beInPlace(this.home);
    }

    gotoHospital(district: Hospital) {
        if (this.illState === IllState.dead || this.treatmentState.quanrantine === QuanrantineState.atHospital) {
            return;
        }

        this.beInPlace(district.randomPlace());
    }

    goRandomPlace(districts: Districts) {
        if (this.treatmentState.quanrantine === QuanrantineState.atHospital || this.illState === IllState.dead) {
            return;
        }

        if (!districts.hospital.isFull && this.treatmentState.quanrantine === QuanrantineState.atHome) {
            this.gotoHospital(districts.hospital);
            return;
        }

        if (!districts.hospital.isFull && Math.random() < this.visitingHospitalRate) {
            this.gotoHospital(districts.hospital);
            return;
        }
        
        if (!this.isQuarantined){
            this.gotoFacility();
        } else if (this.treatmentState.quanrantine === QuanrantineState.atHome) {
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
