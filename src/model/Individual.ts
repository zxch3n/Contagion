import {IDisease, IIndividual, Position, isInfectious, IllState, Districts, TreatmentState, QuanrantineState} from './type';
import {upgradeIll} from './Disease';
import { Place, District } from './District';

// TODO: 插值动画
export class Individual implements IIndividual{
    currentPlace: Place;
    illState: import("./type").IllState;
    hasCar: boolean;
    visitingHospitalRate: number;
    wearMask: boolean;
    home: Place;
    workPlace?: Place;
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
    }

    get isQuarantined() {
        return this.treatmentState.quanrantine > 0 || this.illState === IllState.dead;
    }

    get isDead() {
        return this.illState === IllState.dead;
    }

    preGoto(publicTransportDistrict: District) {
        if (this.hasCar || this.isQuarantined) {
            // do not need to use public transport
            return;
        }

        this.beInPlace(publicTransportDistrict.randomPlace());
    }

    beInPlace(place: Place) {
        // TODO: optimize
        this.currentPlace.remove(this);
        this.currentPlace = place;
        place.push(this);
    }

    gotoWork(districts: Districts) {
        if (this.isDead || this.treatmentState.quanrantine === QuanrantineState.atHospital ) {
            return;
        }

        if (this.treatmentState.quanrantine === QuanrantineState.atHome) {
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

    gotoHospital(district: District) {
        if (this.illState === IllState.dead) {
            return;
        }

        this.beInPlace(district.randomPlace());
    }

    goRandomPlace(districts: Districts) {
        if (this.treatmentState.quanrantine === QuanrantineState.atHome) {
            this.gotoHospital(districts.hospital);
            return;
        }

        if (this.treatmentState.quanrantine === QuanrantineState.atHospital || this.illState === IllState.dead) {
            return;
        }

        if (Math.random() < this.visitingHospitalRate) {
            this.gotoHospital(districts.hospital);
        }
        
        if (!this.isQuarantined){
            this.gotoFacility();
        }
    }

    upgrade(disease: IDisease) {
        this.illState = upgradeIll(this.illState, disease);
        if (this.illState === IllState.serious) {
            if (this.treatmentState.quanrantine === 0) {
                this.treatmentState.quanrantine = QuanrantineState.atHome;
                this.visitingHospitalRate = 1;
            }
        } else if (this.illState === IllState.exposedInfactious) {
            // this.treatmentState.quanrantine = QuanrantineState.atHome;
            this.visitingHospitalRate = 1;
        } 
    }
}
