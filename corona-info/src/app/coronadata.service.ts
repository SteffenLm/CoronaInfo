import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FavouriteService } from './favourite.service';

@Injectable({
  providedIn: 'root'
})
export class CoronadataService {

  private static QUERY = `query?where=BEZ='Landkreis' OR BEZ='Kreis'&orderByFields=GEN&outFields=BEZ,GEN,OBJECTID&returnGeometry=false&f=json`;


  constructor(
    private readonly httpClient: HttpClient,
    private readonly favouriteService: FavouriteService) { }

  public getLandkreise() {
    return this.httpClient.get(environment.apiUrl + CoronadataService.QUERY).pipe(
      map((data: any) => data.features)
    );
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
