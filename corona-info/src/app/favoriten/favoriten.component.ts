import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CoronadataService } from '../coronadata.service';
import { FavouriteService } from '../favourite.service';

@Component({
  selector: 'app-favoriten',
  templateUrl: './favoriten.component.html',
  styleUrls: ['./favoriten.component.scss']
})
export class FavoritenComponent implements OnInit {

  public favourites$: Observable<any>;

  constructor(private coronadataService: CoronadataService) { }

  ngOnInit(): void {  
    this.favourites$ = this.coronadataService.getFavouritesData();
  }
}
