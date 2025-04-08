import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import {MatCardModule} from '@angular/material/card';
import { DatePipe } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { catchError, map, of } from 'rxjs';
import { PageNotFoundComponent } from '../../page-not-found/page-not-found.component';

@Component({
  selector: 'app-pokemon-profile',
  standalone: true,
  imports: [PageNotFoundComponent, MatProgressSpinnerModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatListModule, MatDividerModule, DatePipe],
  templateUrl: './pokemon-profile.component.html',
  styles: ``
})
export class PokemonProfileComponent {
  
  /** 
   * Service Angular permettant d'accéder aux paramètres de l'URL. 
   * Utilisé ici pour récupérer l'ID du Pokémon.
   */
  readonly #route = inject(ActivatedRoute);

  readonly #router = inject(Router);

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
    * Signal contenant la réponse du service pour un Pokémon donné.
    * - Utilise le service `getPokemonById` pour faire une requête HTTP.
    * - `map` transforme la réponse en un objet { value, error }.
    * - `catchError` capture une éventuelle erreur et renvoie un objet similaire avec une erreur.
    * 
    * `toSignal` transforme l'observable en signal réactif utilisable dans le composant.
    */
  readonly #pokemonResponse = toSignal(
    this.#pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((pokemon) => ({ value: pokemon, error: undefined})),
      catchError((error) => of({value: undefined, error: error}))
    )
  );

  /**
    * Signal calculé indiquant si les données sont encore en cours de chargement.
    * Retourne `true` tant que `#pokemonResponse()` est `undefined`.
    */
  readonly loading = computed(() => this.#pokemonResponse() === undefined);
  
  /**
    * Signal calculé exposant une éventuelle erreur retournée par le service.
    */
  readonly error = computed(() => this.#pokemonResponse()?.error);

  /** 
   * Signal contenant les informations du Pokémon correspondant à `pokemonId`. 
   * La donnée est récupérée via le service `PokemonService`.
   */
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);

  /**
    * Méthode permettant de supprimer le Pokémon courant.
    * - Utilise le service `deletePokemon` avec l'ID récupéré depuis l'URL.
    * - Une fois la suppression terminée, redirige l'utilisateur vers la liste des Pokémon.
    */
  deletePokemon() {
    this.#pokemonService.deletePokemon(this.#pokemonId).subscribe(() => {
      this.#router.navigate(['/pokemons'])
    })
  }

}