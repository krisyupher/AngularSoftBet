import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country } from '../../services/country.service';

@Component({
  selector: 'app-flag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flag-card.html',
  styleUrl: './flag-card.scss',
})
export class FlagCard {
  @Input() country: Country | null = null;
}
