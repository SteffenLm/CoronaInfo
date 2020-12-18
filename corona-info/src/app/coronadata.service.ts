import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FavouriteService } from './favourite.service';
import { LocalStorage } from './local-storage';
import { CoronaDataSet } from './corona-data-set';
import { BehaviorSubject, Observable } from 'rxjs';
import { County } from './county';

@Injectable({
  providedIn: 'root'
})
export class CoronaDataService extends LocalStorage<CoronaDataSet> {

  private static QUERY = `query?where=BEZ='Landkreis' OR BEZ='Kreis'&orderByFields=GEN&outFields=BEZ,GEN,OBJECTID,cases,deaths,cases7_per_100k,cases7_bl_per_100k,BL&returnGeometry=false&f=json`;
  private isLocallyAvailable = false;

  private sub = new BehaviorSubject<CoronaDataSet>(new CoronaDataSet(new Date, []));
  private currentCoronaDataSet: CoronaDataSet;


  constructor(
    private readonly httpClient: HttpClient,
    private readonly favouriteService: FavouriteService) {
    super('casefigures');
  }

  public getObservable(): Observable<CoronaDataSet> {
    return this.sub.asObservable();
  }

  public getLandkreise(): void {
    const coronaDataSets = this.getData();
    const currentDate = new Date();
    coronaDataSets.forEach((coronaDataSet) => {
      if (this.isSameDay(new Date(coronaDataSet.date), currentDate) === true) {
        this.isLocallyAvailable = true;
        this.currentCoronaDataSet = coronaDataSet;
      }
    });

    if (this.isLocallyAvailable === true) {
      this.sub.next(this.currentCoronaDataSet);
    } else {
      this.httpClient.get<CoronaDataSetDTO>(environment.apiUrl + CoronaDataService.QUERY).pipe(
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

          const savedCoronaData = this.getData();
          savedCoronaData.push(parsedCoronaDataSet);
          this.setData(savedCoronaData);
          debugger;
          this.sub.next(parsedCoronaDataSet);
        })
      ).subscribe();
    }
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

  public getLandkreisData(objectId: string) {
    const query = `query?where=ObjectId=${objectId}&outFields=BEZ,GEN,cases,deaths,cases7_per_100k,cases7_bl_per_100k,BL&returnGeometry=false&f=json`;
    return this.httpClient.get(environment.apiUrl + query).pipe(
      map((data: any) => data.features)
    );
  }

  public getFavouritesData() {
    const favourites = this.favouriteService.getFavourites();
    const objectIds = favourites.join(',');
    const query = `query?outFields=BEZ,GEN,cases7_per_100k,OBJECTID&returnGeometry=false&f=json&objectIds=${objectIds}`;
    return this.httpClient.get(environment.apiUrl + query).pipe(
      map((data: any) => data.features)
    );
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
