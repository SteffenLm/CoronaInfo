import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoronadataService {

  private static QUERY = `query?where=BEZ%20=%20'Landkreis'%20OR%20BEZ%20=%20'Kreis'&orderByFields=GEN&outFields=BEZ,GEN,OBJECTID&returnGeometry=false&f=json`;


  constructor(private readonly httpClient: HttpClient) { }

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
}
