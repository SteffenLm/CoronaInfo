export abstract class DataSet<T> {

    constructor(
        public date: Date,
        public dataSet: T[]) { }
}
