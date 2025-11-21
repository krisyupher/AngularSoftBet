import { Component } from '@angular/core';
import { FlagCard } from './components/flag-card/flag-card';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [FlagCard],
})
export class App {
  protected readonly title = 'AngularSoftBet asd';
}
