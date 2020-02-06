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
}

export class District {
    places: Place[];
    maxPopulation: number;
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

    get isFull(): boolean {
        return this.population >= this.maxPopulation;
    }

    randomPlace = (): Place => {
        if (this.places.length === 0) {
            throw new Error();
        }

        const index = Math.floor(Math.random() * this.places.length);
        // TODO: avoid place that's full
        return this.places[index];
    };

    get population() {
        let sum = 0;
        for (const place of this.places) {
            sum += place.people.size;
        }

        return sum;
    }
}