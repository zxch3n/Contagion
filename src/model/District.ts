import { Position, IIndividual } from "./type";
import { Individual } from "./Individual";

export class Place{
    public people: Set<IIndividual>;
    constructor(
        public index: number,
        public district: District,
        public position: Position,
        public max: number
    ) {
        this.people = new Set();
    }

    push(id: Individual) {
        this.people.add(id);
        // FIXME: Error
        // if (this.max < this.people.length) {
        //     throw new Error();
        // }
    }

    merge(place: Place) {
        for (let it = place.people.values(), val: Individual = null; (val=it.next().value) != null; ) {
            val!.beInPlace(this);
            this.people.add(val);
        }

        place.people.clear();
    }

    remove(id: Individual) {
        this.people.delete(id);
    }

    clear() {
        this.people.clear();
    }

    mapPeople(func: (person: IIndividual) => any) {
        this.people.forEach(func);
    }

    get length() {
        return this.people.size;
    }

    get isFull() {
        return this.people.size >= this.max;
    }
}

export class District {
    places: Place[];
    maxPopulation: number;
    availableIndex: number = 0;
    constructor(public name: string, public position: Position, num: number, max: number) {
        this.places = [];
        for (let i = 0; i < num; i++) {
            this.places.push(new Place(i, this, { x: 0, y: 0 }, max));
        }

        this.maxPopulation = max * num;
    }

    mapPeople(func: (person: IIndividual) => any) {
        for (const place of this.places) {
            place.mapPeople(func);
        }
    }

    beforeSceneStart() {
        this.availableIndex = 0;
    }

    get isFull(): boolean {
        while (this.places.length > this.availableIndex && this.places[this.availableIndex].isFull) {
            this.availableIndex++;
        } 

        return this.availableIndex >= this.places.length;
    }

    nextAvailablePlace = (): Place => {
        if (this.isFull) {
            throw new Error();
        }

        return this.places[this.availableIndex];
    };

    randomPlace = (): Place => {
        return this.places[Math.floor(Math.random() * this.places.length)];
    }

    get population() {
        let sum = 0;
        for (const place of this.places) {
            sum += place.people.size;
        }

        return sum;
    }
}

export class LivingQuater extends District {
    public name: string = 'living';
    private fillIndex: number = 0;
    constructor(public position: Position, distribution: [number, number][]) {
        super('living', position, 0, 0);
        let index = 0;
        for (const [num, familySize] of distribution) {
            for (let i = 0; i < num; i ++) {
                this.places.push(new Place(index, this, {x: 0, y: 0}, familySize))
                index ++;
            }
        }
    }

    nextFillingPlace() {
        if (this.places[this.fillIndex].isFull) {
            this.fillIndex++;
        }

        return this.places[this.fillIndex];
    }
}
