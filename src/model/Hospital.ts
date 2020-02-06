import { District, } from "./District";
import { Position, IllState, MedicalParam, QuanrantineState } from "./type";
import { Individual } from "./Individual";

export class Hospital extends District {
    name = "hospital";
    doctors: Individual[] = [];
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

    get isFull(): boolean {
        while (this.availableIndex < this.places.length) {
            if (!this.doctors[this.availableIndex].isWorking) {
                this.availableIndex++;
            } else if (this.places[this.availableIndex].isFull) {
                this.availableIndex++;
            } else {
                break;
            }
        }

        return this.availableIndex >= this.places.length;
    }

    hospitalize(person: Individual) {
        if (this.medicalBed.isFull) {
            person.treatmentState.quanrantine = QuanrantineState.atHome;
        } else {
            person.treatmentState.quanrantine = QuanrantineState.atHospital;
            person.beInPlace(this.medicalBed.nextAvailablePlace());
        }
    }

    examPerson = (person: Individual) => {
        if (person.treatmentState.isConfirmed) {
            if (
                person.treatmentState.quanrantine ===
                QuanrantineState.atHospital
            ) {
                if (Math.random() < this.param.cureRateOnMedicalBed) {
                    person.illState = IllState.recovered;
                }
            } else if (Math.random() < this.param.cureRateInHospital) {
                person.illState = IllState.recovered;
            }
            if (person.illState === IllState.recovered) {
                person.treatmentState = {
                    isConfirmed: false,
                    isSuspected: false,
                    quanrantine: QuanrantineState.none
                };
                person.visitingHospitalRate = this.param.visitingHospitalRate;
                person.goHome();
            }
        } else if (person.treatmentState.isSuspected) {
            if (Math.random() < this.param.confirmRate) {
                person.treatmentState.isConfirmed = true;
            }
        }

        if (
            person.illState >= IllState.exposedInfactious &&
            person.currentPlace.district !== this.medicalBed
        ) {
            person.treatmentState.isSuspected = true;
            person.visitingHospitalRate = 1;
            this.hospitalize(person);
        }
    };
}
