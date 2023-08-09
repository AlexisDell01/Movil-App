import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomePage } from './home/home.page';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { SearchingComponent } from './searching/searching.component';
import { AgaveComponent } from './agave/agave.component';
import { NoAgaveComponent } from './no-agave/no-agave.component';

const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'home', component: HomePage },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Ruta por defecto cuando no hay ninguna especificada
  { path: 'preview-image', component: PreviewImageComponent },
  { path: 'searching', component: SearchingComponent },
  { path: 'agave', component: AgaveComponent },
  { path: 'no-agave', component: NoAgaveComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
