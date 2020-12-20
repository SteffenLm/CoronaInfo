import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoronaDataService } from './coronadata.service';
import { County } from './county';
import { LocalStorage } from './local-storage';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService extends LocalStorage<string> {

  public favouritesData: BehaviorSubject<County[]>;
  public favouritesData$: Observable<County[]>;

  constructor(private coronaDataService: CoronaDataService) {
    super('favourites');
    this.favouritesData = new BehaviorSubject([]);
    this.favouritesData$ = this.favouritesData.asObservable();
    this.getFavouritesData();
  }

  private getFavouritesData(): void {
    const subscription = this.coronaDataService.coronaData$.pipe(
      map(coronaDataSet => coronaDataSet.dataSet),
      map(counties => counties.filter(county => this.getData().includes(county.id.toString())))
    ).subscribe((data) => {
      this.favouritesData.next(data);
    });
  }

  public addFavourite(favourite: string) {
    const favourites = this.getData();
    favourites.push(favourite);
    this.setData(favourites);
    this.getFavouritesData();
  }

  public removeFavourite(favourite: string) {
    const favourites = this.getData();
    const index = favourites.indexOf(favourite);
    favourites.splice(index, 1);
    this.setData(favourites);
    this.getFavouritesData();
  }

  public getFavourites(): string[] {
    return this.getData();
  }

}
