import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  static readonly LocalStorageKey = 'favourites';

  private favourites: string[];

  constructor() {

    const favouritesAsString = localStorage.getItem(FavouriteService.LocalStorageKey);
    if (favouritesAsString === null) {
      this.favourites = [];
      this.persistFavourites();
    } else {
      this.favourites = JSON.parse(favouritesAsString);
    }
  }

  private persistFavourites(): void {
    localStorage.setItem(FavouriteService.LocalStorageKey, JSON.stringify(this.favourites));
  }

  public addFavourite(favourite: string) {
    this.favourites.push(favourite);
    this.persistFavourites();
  }

  public removeFavourite(objectId: string) {
    const index = this.favourites.indexOf(objectId);
    this.favourites.splice(index, 1);
    this.persistFavourites();
  }

  public getFavourites(): string[] {
    return this.favourites.slice(0);
  }
}
