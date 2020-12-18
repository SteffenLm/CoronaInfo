import { Injectable } from '@angular/core';
import { LocalStorage } from './local-storage';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService extends LocalStorage<string> {

  constructor() {
    super('favourites');
  }

  public addFavourite(favourite: string) {
    const favourites = this.getData();
    favourites.push(favourite);
    this.setData(favourites);
  }

  public removeFavourite(favourite: string) {
    const favourites = this.getData();
    const index = favourites.indexOf(favourite);
    favourites.splice(index, 1);
    this.setData(favourites);
  }

  public getFavourites(): string[] {
    return this.getData();
  }
}
