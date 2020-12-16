import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoronaDataService } from '../coronadata.service';
import { FavouriteService } from '../favourite.service';

@Component({
  selector: 'app-landkreis-detail',
  templateUrl: './landkreis-detail.component.html',
  styleUrls: ['./landkreis-detail.component.scss']
})
export class LandkreisDetailComponent implements OnInit, OnDestroy {

  private paramKey = 'objectId';

  public iconColor: 'darkgrey' | '' = 'darkgrey';

  public data$: any;

  private paramSubscription: Subscription;
  public objectId: string;

  constructor(
    private route: ActivatedRoute,
    private readonly coronaService: CoronaDataService,
    private favouriteService: FavouriteService) { }

  ngOnInit(): void {

    this.paramSubscription = this.route.params.subscribe(params => {
      this.objectId = params[this.paramKey];
    });
    this.data$ = this.coronaService.getLandkreisData(this.objectId);
    const favourites = this.favouriteService.getFavourites();
    favourites.forEach((favourite) => {
      if (favourite === this.objectId) {
        this.iconColor = '';
      }
    });
  }

  public manageFavourite() {
    if (this.iconColor === 'darkgrey') {
      this.favouriteService.addFavourite(this.objectId);
      this.iconColor = '';
    } else {
      this.favouriteService.removeFavourite(this.objectId);
      this.iconColor = 'darkgrey';
    }
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

}
