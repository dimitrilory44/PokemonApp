import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``
})
export class PokemonEditComponent {
    readonly route = inject(ActivatedRoute);
    readonly pokemonService = inject(PokemonService);
    readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));
    readonly pokemon = signal(this.pokemonService.getPokemonById(this.pokemonId)).asReadonly();
}
