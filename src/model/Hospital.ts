import { District } from "./District";
import { Position, IllState, MedicalParam, QuanrantineState } from "./type";
import { Individual } from "./Individual";

export class Hospital extends District {
    name = "hospital";
    constructor(
        public param: MedicalParam,
        public medicalBed: District,
        position: Position,
        num: number,
        max: number
    ) {
        super("hospital", position, num, max);
    }

    exam() {
        this.mapPeople(this.examPerson);
        this.medicalBed.mapPeople(this.examPerson);
    }

    hospitalize(person: Individual) {
        if (this.medicalBed.isFull) {
            person.treatmentState.quanrantine = QuanrantineState.atHome;
        } else {
            person.treatmentState.quanrantine = QuanrantineState.atHospital;
            person.beInPlace(this.medicalBed.randomPlace());
        }
    }

    examPerson = (person: Individual) => {
        if (Math.random() < this.param.cureRateInHospital) {
            person.illState = IllState.recovered;
        }

        if (
            person.treatmentState.isSuspected &&
            !person.treatmentState.isConfirmed
        ) {
            if (Math.random() < this.param.confirmRate) {
                person.treatmentState.isConfirmed = true;
                this.hospitalize(person);
            }
        }

        if (
            person.illState >= IllState.exposedInfactious &&
            person.currentPlace.district !== this.medicalBed
        ) {
            person.treatmentState.isSuspected = true;
            person.visitingHospitalRate = 1;
            this.hospitalize(person);
        } else if (person.illState === IllState.recovered) {
            person.treatmentState = {
                isConfirmed: false,
                isSuspected: false,
                quanrantine: QuanrantineState.none
            };
            person.visitingHospitalRate = this.param.visitingHospitalRate;
            person.goHome();
        }
    };
}
