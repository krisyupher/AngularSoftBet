import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  searchCountries(countryName: string): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.apiUrl}/name/${countryName}?fields=name,flags,capital,region,subregion,population`
    );
  }

  getCountriesByCode(countryCode: string): Observable<Country[]> {
    return this.http.get<Country[]>(
      `${this.apiUrl}/alpha/${countryCode}?fields=name,flags,capital,region,subregion,population`
    );
  }
}
