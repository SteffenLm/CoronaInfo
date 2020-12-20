import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { LocalStorage } from './local-storage';
import { CoronaDataSet } from './corona-data-set';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { County } from './county';

@Injectable({
  providedIn: 'root'
})
export class CoronaDataService extends LocalStorage<CoronaDataSet> {

  private coronaData: BehaviorSubject<CoronaDataSet>;
  public coronaData$: Observable<CoronaDataSet>;

  private selectedCounty: BehaviorSubject<County>;
  public selectedCounty$: Observable<County>;

  constructor(
    private readonly httpClient: HttpClient) {
    super('casefigures');
    this.coronaData = new BehaviorSubject({ date: new Date(), dataSet: [] });
    this.coronaData$ = this.coronaData.asObservable();
    this.selectedCounty = new BehaviorSubject(null);
    this.selectedCounty$ = this.selectedCounty.asObservable();
    this.initializeData();
  }

  private initializeData(): void {

    if (this.currentDataSetIsCached()) {
      this.coronaData.next(this.getData()[0]);
    } else {
      const query = `query?where=BEZ='Landkreis' OR BEZ='Kreis'&orderByFields=GEN&outFields=BEZ,GEN,OBJECTID,cases,deaths,cases7_per_100k,cases7_bl_per_100k,BL&returnGeometry=false&f=json`;
      this.httpClient.get<CoronaDataSetDTO>(environment.apiUrl + query).pipe(
        map((data) => data.features),
        map((data) => {
          const parsedCoronaDataSet = new CoronaDataSet(new Date(), []);

          data.forEach((dataSetEntryDTO) => {
            const county = new County(
              dataSetEntryDTO.attributes.BEZ,
              dataSetEntryDTO.attributes.GEN,
              dataSetEntryDTO.attributes.OBJECTID,
              dataSetEntryDTO.attributes.cases,
              dataSetEntryDTO.attributes.deaths,
              dataSetEntryDTO.attributes.cases7_per_100k,
              dataSetEntryDTO.attributes.cases7_bl_per_100k,
              dataSetEntryDTO.attributes.BL
            );
            parsedCoronaDataSet.dataSet.push(county);
          });

          // JSON.stringify(JSON.parse(localStorage.getItem('casefigures'))[0]) === JSON.stringify(JSON.parse(localStorage.getItem('casefigures'))[1])



          this.coronaData.next(parsedCoronaDataSet);
          this.addNewestDataSet(parsedCoronaDataSet);
        })
      ).subscribe();
    }
  }

  private currentDataSetIsCached(): boolean {
    const currentDate = new Date();
    let isCached = false;
    this.getData().forEach((coronaDataSet) => {
      if (this.isSameDay(new Date(coronaDataSet.date), currentDate) === true) {
        isCached = true;
      }
    });
    return isCached;
  }

  private addNewestDataSet(newDataSet: CoronaDataSet) {
    const cachedDataSets = this.getData();
    cachedDataSets.unshift(newDataSet);
    if (cachedDataSets.length > 2) {
      cachedDataSets.pop();
    }
    this.setData(cachedDataSets);
  }

  private isSameDay(dateOne: Date, dateTwo: Date): boolean {
    if (
      dateOne.getDay() === dateTwo.getDay()
      && dateOne.getMonth() === dateTwo.getMonth()
      && dateOne.getFullYear() === dateTwo.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }

  public setSelectedCounty(objectId: string) {
    this.selectedCounty.next(this.getData()[0].dataSet.find((val) => val.id.toString() === objectId));
  }

}


class CoronaDataSetDTO {
  features: DataSetEntryDTO[];
}

class DataSetEntryDTO {
  attributes: {
    BEZ: string,
    GEN: string,
    OBJECTID: number,
    cases: number,
    deaths: number,
    cases7_per_100k: number,
    cases7_bl_per_100k: number,
    BL: string
  };
}
