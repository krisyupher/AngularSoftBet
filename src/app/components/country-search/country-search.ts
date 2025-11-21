import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountryService, Country } from '../../services/country.service';
import { FlagCard } from '../flag-card/flag-card';

@Component({
  selector: 'app-country-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FlagCard],
  templateUrl: './country-search.html',
  styleUrl: './country-search.scss',
})
export class CountrySearch {
  searchQuery = signal('');
  countries = signal<Country[]>([]);
  selectedCountry = signal<Country | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private countryService: CountryService) {}

  search() {
    const query = this.searchQuery().trim();
    if (!query) {
      this.countries.set([]);
      this.selectedCountry.set(null);
      this.errorMessage.set('');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.countryService.searchCountries(query).subscribe({
      next: (results) => {
        this.countries.set(results);
        if (results.length > 0) {
          this.selectedCountry.set(results[0]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.countries.set([]);
        this.selectedCountry.set(null);
        this.errorMessage.set(`No country found for "${query}"`);
        this.isLoading.set(false);
      },
    });
  }

  selectCountry(country: Country) {
    this.selectedCountry.set(country);
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }
}
