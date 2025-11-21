import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountrySearch } from './country-search';
import { CountryService, Country } from '../../services/country.service';
import { of, throwError } from 'rxjs';

describe('CountrySearch', () => {
  let component: CountrySearch;
  let fixture: ComponentFixture<CountrySearch>;
  let countryService: jasmine.SpyObj<CountryService>;

  const mockCountries: Country[] = [
    {
      name: {
        common: 'Spain',
        official: 'Kingdom of Spain',
      },
      flags: {
        png: 'https://flagcdn.com/w320/es.png',
        svg: 'https://flagcdn.com/es.svg',
      },
      capital: ['Madrid'],
      region: 'Europe',
      subregion: 'Southern Europe',
      population: 47615034,
    },
    {
      name: {
        common: 'Spanish Sahara',
        official: 'Spanish Sahara',
      },
      flags: {
        png: 'https://flagcdn.com/w320/eh.png',
        svg: 'https://flagcdn.com/eh.svg',
      },
      capital: ['Laayoune'],
      region: 'Africa',
      subregion: 'Northern Africa',
      population: 603253,
    },
  ];

  beforeEach(async () => {
    const countryServiceSpy = jasmine.createSpyObj('CountryService', ['searchCountries', 'getCountriesByCode']);

    await TestBed.configureTestingModule({
      imports: [CountrySearch],
      providers: [
        { provide: CountryService, useValue: countryServiceSpy },
      ],
    }).compileComponents();

    countryService = TestBed.inject(CountryService) as jasmine.SpyObj<CountryService>;
    fixture = TestBed.createComponent(CountrySearch);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty signals', () => {
    expect(component.searchQuery()).toBe('');
    expect(component.countries()).toEqual([]);
    expect(component.selectedCountry()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });

  it('should search for countries when search is called', () => {
    countryService.searchCountries.and.returnValue(of(mockCountries));
    component.searchQuery.set('Spain');

    component.search();

    expect(countryService.searchCountries).toHaveBeenCalledWith('Spain');
    expect(component.countries()).toEqual(mockCountries);
    expect(component.selectedCountry()).toBe(mockCountries[0]);
    expect(component.isLoading()).toBe(false);
  });

  it('should clear results when search query is empty', () => {
    component.searchQuery.set('');
    component.countries.set(mockCountries);
    component.selectedCountry.set(mockCountries[0]);

    component.search();

    expect(component.countries()).toEqual([]);
    expect(component.selectedCountry()).toBeNull();
    expect(component.errorMessage()).toBe('');
  });

  it('should handle search errors gracefully', () => {
    countryService.searchCountries.and.returnValue(throwError(() => new Error('Not found')));
    component.searchQuery.set('InvalidCountry');

    component.search();

    expect(component.countries()).toEqual([]);
    expect(component.selectedCountry()).toBeNull();
    expect(component.errorMessage()).toContain('No country found');
    expect(component.isLoading()).toBe(false);
  });

  it('should select country when selectCountry is called', () => {
    component.selectCountry(mockCountries[1]);

    expect(component.selectedCountry()).toBe(mockCountries[1]);
  });

  it('should trigger search on Enter key', () => {
    countryService.searchCountries.and.returnValue(of(mockCountries));
    component.searchQuery.set('Spain');
    spyOn(component, 'search');

    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    component.onKeyup(event);

    expect(component.search).toHaveBeenCalled();
  });

  it('should not trigger search on other keys', () => {
    spyOn(component, 'search');

    const event = new KeyboardEvent('keyup', { key: 'a' });
    component.onKeyup(event);

    expect(component.search).not.toHaveBeenCalled();
  });

  it('should display search input', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Enter country name...');
  });

  it('should display search button', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.search-button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Search');
  });

  it('should display loading state in button', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.search-button') as HTMLButtonElement;
    expect(button.textContent).toContain('Searching...');
    expect(button.disabled).toBe(true);
  });

  it('should display error message when search fails', () => {
    component.errorMessage.set('No country found for "InvalidCountry"');
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('.error-message');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain('No country found');
  });

  it('should not display error message when empty', () => {
    component.errorMessage.set('');
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('.error-message');
    expect(errorMsg).toBeFalsy();
  });

  it('should display FlagCard when country is selected', () => {
    component.selectedCountry.set(mockCountries[0]);
    fixture.detectChanges();

    const flagCard = fixture.nativeElement.querySelector('app-flag-card');
    expect(flagCard).toBeTruthy();
  });

  it('should not display FlagCard when no country is selected', () => {
    component.selectedCountry.set(null);
    fixture.detectChanges();

    const flagCard = fixture.nativeElement.querySelector('app-flag-card');
    expect(flagCard).toBeFalsy();
  });

  it('should display other country options when multiple countries match', () => {
    component.countries.set(mockCountries);
    component.selectedCountry.set(mockCountries[0]);
    fixture.detectChanges();

    const countryList = fixture.nativeElement.querySelector('.country-list');
    expect(countryList).toBeTruthy();

    const listItems = fixture.nativeElement.querySelectorAll('.list-item');
    expect(listItems.length).toBe(1); // Only Spanish Sahara (not Spain which is selected)
  });

  it('should not display country list when only one country matches', () => {
    component.countries.set([mockCountries[0]]);
    component.selectedCountry.set(mockCountries[0]);
    fixture.detectChanges();

    const countryList = fixture.nativeElement.querySelector('.country-list');
    expect(countryList).toBeFalsy();
  });

  it('should update selected country when clicking on alternative country', () => {
    component.countries.set(mockCountries);
    component.selectedCountry.set(mockCountries[0]);
    spyOn(component, 'selectCountry').and.callThrough();
    fixture.detectChanges();

    const listItem = fixture.nativeElement.querySelector('.list-item') as HTMLButtonElement;
    listItem.click();

    expect(component.selectCountry).toHaveBeenCalledWith(mockCountries[1]);
    expect(component.selectedCountry()).toBe(mockCountries[1]);
  });

  it('should trim search query before searching', () => {
    countryService.searchCountries.and.returnValue(of(mockCountries));
    component.searchQuery.set('  Spain  ');

    component.search();

    expect(countryService.searchCountries).toHaveBeenCalledWith('Spain');
  });

  it('should update isLoading state during search', (done) => {
    expect(component.isLoading()).toBe(false);

    countryService.searchCountries.and.returnValue(of(mockCountries));
    component.searchQuery.set('Spain');

    component.search();

    expect(component.isLoading()).toBe(false);
    done();
  });
});
