import { Component, computed, inject, signal } from '@angular/core';

import { PokemonService } from '../../pokemon.service';
import { Pokemon } from '../../pokemon.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PokemonBorderDirective } from '../../pokemon-border.directive';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, PokemonBorderDirective, DatePipe, MatFormFieldModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styles: ``
})
export class PokemonListComponent {
  /** 
   * Service permettant de récupérer la liste des Pokémon.
   * La propriété ne peut être assigné qu'une fois d'où la propriété readonly
   */
  readonly #pokemonService = inject(PokemonService);

  /** 
   * Service Angular permettant de modifier le titre de la page.
   * La propriété ne peut être assigné qu'une fois d'où la propriété readonly.
   */
  readonly #title = inject(Title);

   /** 
   * Signal contenant la liste des Pokémon.
   * La propriété ne peut être assigné qu'une fois d'où la propriété readonly.
   */
  readonly pokemons = signal(this.#pokemonService.getPokemonList());

  /** 
   * Signal contenant le terme de recherche de l'utilisateur.
   * La propriété ne peut être assigné qu'une fois d'où la propriété readonly.
   */
  readonly searchTerm = signal('');

  /** 
   * Signal calculé contenant la liste des Pokémon filtrés selon `searchTerm`.
   * La propriété ne peut être assigné qu'une fois d'où la propriété readonly.
   */
  readonly pokemonsFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemons = this.pokemons();

    return pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
  })

  /**
   * Met à jour le titre de la page.
   * @param newTitle - Le nouveau titre à afficher.
   */
  setTitle(newTitle: string) {
    this.#title.setTitle("Pokemon : " + newTitle);
  }

  /**
   * Détermine la taille d'un Pokémon en fonction de ses points de vie.
   * @param pokemon - L'objet Pokémon à évaluer.
   * @returns "Petit", "Moyen" ou "Grand" en fonction des points de vie.
   */
  size(pokemon: Pokemon) {
    if (pokemon.life <= 15) {
      return "Petit"
    } else if (pokemon.life >= 25) {
      return "Grand";
    }
    return "Moyen";
  }

  /**
   * Incrémente les points de vie d'un Pokémon.
   * @param pokemon - L'objet Pokémon dont on augmente la vie.
   */
  increment(pokemon: Pokemon) {
    pokemon.life = pokemon.life + 1;
  }

  /**
   * Décrémente les points de vie d'un Pokémon.
   * @param pokemon - L'objet Pokémon dont on diminue la vie.
   */
  decrement(pokemon: Pokemon) {
    pokemon.life = pokemon.life - 1;
  }

}
