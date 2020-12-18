import { County } from './county';
import { DataSet } from './data-set';

export class CoronaDataSet extends DataSet<County> {

    constructor(public date: Date, public dataSet: County[]) {
        super(date, dataSet);
    }
}
