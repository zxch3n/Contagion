import {IDisease, IllState} from './type';

export function upgradeIll(illState: IllState, disease: IDisease) {
    if (illState <= IllState.susceptible){
        return illState;
    }

    if (illState === IllState.incubating) {
        if (Math.random() < disease.toLatentlyInfactiousRate) {
            return IllState.latentlyInfactious;
        }
    } else if (illState === IllState.latentlyInfactious) {
        if (Math.random() < disease.toExposedInfactiousRate) {
            return IllState.exposedInfactious;
        }
    } else if (illState === IllState.exposedInfactious) {
        if (Math.random() < disease.seriousRate) {
            return IllState.serious;
        }
    } else if (illState === IllState.serious) {
        if (Math.random() < disease.deadRate) {
            return IllState.dead;
        }
    } 

    if (Math.random() < disease.selfRecoverRate) {
        return IllState.recovered;
    }

    return illState;
}
