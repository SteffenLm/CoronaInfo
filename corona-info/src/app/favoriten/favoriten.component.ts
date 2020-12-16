import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CoronaDataService } from '../coronadata.service';

@Component({
  selector: 'app-favoriten',
  templateUrl: './favoriten.component.html',
  styleUrls: ['./favoriten.component.scss']
})
export class FavoritenComponent implements OnInit {

  public favourites$: Observable<any>;

  constructor(private coronadataService: CoronaDataService) { }

  ngOnInit(): void {
    this.favourites$ = this.coronadataService.getFavouritesData();
  }
}
