import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import {MatCardModule} from '@angular/material/card';
import { DatePipe } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-profile',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatListModule, MatDividerModule, DatePipe],
  templateUrl: './pokemon-profile.component.html',
  styles: ``
})
export class PokemonProfileComponent {
  
  /** 
   * Service Angular permettant d'accéder aux paramètres de l'URL. 
   * Utilisé ici pour récupérer l'ID du Pokémon.
   */
  readonly #route = inject(ActivatedRoute);

  /** 
   * Service permettant de récupérer les informations des Pokémon. 
   */
  readonly #pokemonService = inject(PokemonService);

  /** 
   * Identifiant du Pokémon récupéré depuis l'URL. 
   * Converti en nombre pour être utilisé dans le service.
   */
  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  /** 
   * Signal contenant les informations du Pokémon correspondant à `pokemonId`. 
   * La donnée est récupérée via le service `PokemonService`.
   */
  readonly pokemon = signal(this.#pokemonService.getPokemonById(this.#pokemonId))

}