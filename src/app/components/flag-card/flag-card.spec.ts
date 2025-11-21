import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlagCard } from './flag-card';
import { Country } from '../../services/country.service';

describe('FlagCard', () => {
  let component: FlagCard;
  let fixture: ComponentFixture<FlagCard>;

  const mockCountry: Country = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FlagCard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have country input property', () => {
    expect(component.country).toBeNull();
  });

  it('should display country data when country is provided', () => {
    component.country = mockCountry;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Spain');
    expect(compiled.querySelector('.flag-image')).toBeTruthy();
  });

  it('should display flag image with correct src', () => {
    component.country = mockCountry;
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('.flag-image') as HTMLImageElement;
    expect(img.src).toBe(mockCountry.flags.png);
    expect(img.alt).toBe(mockCountry.name.common);
  });

  it('should display capital information', () => {
    component.country = mockCountry;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Capital');
    expect(compiled.textContent).toContain('Madrid');
  });

  it('should display region information', () => {
    component.country = mockCountry;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Region');
    expect(compiled.textContent).toContain('Europe');
  });

  it('should display subregion information', () => {
    component.country = mockCountry;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sub-region');
    expect(compiled.textContent).toContain('Southern Europe');
  });

  it('should display population with number pipe', () => {
    component.country = mockCountry;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Population');
    expect(compiled.textContent).toContain('47,615,034');
  });

  it('should not display card when country is null', () => {
    component.country = null;
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.flag-card');
    expect(card).toBeFalsy();
  });

  it('should handle missing capital gracefully', () => {
    const countryWithoutCapital: Country = {
      ...mockCountry,
      capital: undefined,
    };
    component.country = countryWithoutCapital;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Capital');
  });

  it('should handle multiple capitals', () => {
    const countryWithMultipleCapitals: Country = {
      ...mockCountry,
      capital: ['La Paz', 'Sucre'],
    };
    component.country = countryWithMultipleCapitals;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('La Paz');
    expect(compiled.textContent).toContain('Sucre');
  });
});
