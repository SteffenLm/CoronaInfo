import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CoronaDataService } from '../coronadata.service';
import { County } from '../county';
import { FavouriteService } from '../favourite.service';

@Component({
  selector: 'app-favoriten',
  templateUrl: './favoriten.component.html',
  styleUrls: ['./favoriten.component.scss']
})
export class FavoritenComponent implements OnInit {

  public favourites$: Observable<County[]>;

  constructor(private favouriteService: FavouriteService, private coronaDataService: CoronaDataService) { }

  ngOnInit(): void {
    this.favourites$ = this.favouriteService.favouritesData$;
  }

  public OnClick(countyId: number) {
    this.coronaDataService.setSelectedCounty(countyId.toString());
  }
}
