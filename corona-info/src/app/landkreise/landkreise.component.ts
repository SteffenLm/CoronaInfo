import { Component, OnInit } from '@angular/core';
import { CoronaDataService } from '../coronadata.service';

@Component({
  selector: 'app-landkreise',
  templateUrl: './landkreise.component.html',
  styleUrls: ['./landkreise.component.scss']
})
export class LandkreiseComponent implements OnInit {

  public landkreise$: any;

  constructor(private readonly coronaService: CoronaDataService) { }

  ngOnInit(): void {
    this.landkreise$ = this.coronaService.getLandkreise();
  }

}
