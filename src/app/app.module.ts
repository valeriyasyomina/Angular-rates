import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RatesGraphBuiderComponent } from './components/rates-graph-buider/rates-graph-buider.component';

import { RatesService } from './services/rates.service';

@NgModule({
  declarations: [
    AppComponent,
    RatesGraphBuiderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    RatesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
