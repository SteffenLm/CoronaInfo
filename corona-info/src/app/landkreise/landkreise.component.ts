import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CoronaDataSet } from '../corona-data-set';
import { CoronaDataService } from '../coronadata.service';

@Component({
  selector: 'app-landkreise',
  templateUrl: './landkreise.component.html',
  styleUrls: ['./landkreise.component.scss']
})
export class LandkreiseComponent implements OnInit {

  public landkreise$: Observable<CoronaDataSet>;

  constructor(private readonly coronaService: CoronaDataService) { }

  ngOnInit(): void {
    this.landkreise$ = this.coronaService.getObservable();
    this.coronaService.getLandkreise();
  }
}
