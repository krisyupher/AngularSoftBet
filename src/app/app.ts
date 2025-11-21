import { Component } from '@angular/core';
import { CountrySearch } from './components/country-search/country-search';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CountrySearch],
})
export class App {
  protected readonly title = 'Country Flags Explorer';
}
