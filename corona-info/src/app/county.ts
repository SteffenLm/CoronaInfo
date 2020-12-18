export class County {

    constructor(
        public type: string,
        public name: string,
        public id: number,
        public cases: number,
        public deaths: number,
        public incidence: number,
        public incidenceOfState: number,
        public state: string) {
    }
}
