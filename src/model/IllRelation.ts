import { Individual } from "./Individual";
// TODO: R0

export class IllRelation {
    from?: Individual;
    to?: Individual[];
    constructor(
        public host: Individual
    ){}

    infect(to: Individual) {
        if (this.to == null) {
            this.to = [to];
        } else {
            this.to.push(to);
        }

        to.illRelation.from = this.host;
    }
}