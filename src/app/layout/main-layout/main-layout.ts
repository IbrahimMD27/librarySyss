import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header],
  template: '<app-header></app-header><router-outlet></router-outlet>',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
