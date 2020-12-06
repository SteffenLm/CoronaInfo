import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandkreiseComponent } from './landkreise/landkreise.component';
import { LandkreisDetailComponent } from './landkreis-detail/landkreis-detail.component';
import { FavoritenComponent } from './favoriten/favoriten.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'landkreise'
  },
  {
    path: 'landkreise', component: LandkreiseComponent
  },
  {
    path: 'landkreise/:objectId', component: LandkreisDetailComponent
  },
  {
    path: 'favoriten', component: FavoritenComponent
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: '**', redirectTo: 'landkreise'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: true,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
