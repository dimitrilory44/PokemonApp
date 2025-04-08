import { inject, Injectable } from '@angular/core';
import { Pokemon, PokemonList } from './pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  readonly #POKEMON_API_URL = "http://localhost:3000/pokemons";
  readonly #http = inject(HttpClient);

  /**
   * Récupère la liste complète des Pokémon disponibles.
   * @returns {PokemonList} Liste des Pokémon.
   */
  getPokemonList(): Observable<PokemonList> {
    return this.#http.get<PokemonList>(this.#POKEMON_API_URL);
  }

  /**
   * Récupère un Pokémon par son identifiant unique.
   * @param {number} id - L'identifiant du Pokémon recherché.
   * @returns {Pokemon} Le Pokémon correspondant à l'ID fourni.
   * @throws {Error} Si aucun Pokémon ne correspond à l'ID donné.
   */
  getPokemonById(id: number): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + "/" + id;
    return this.#http.get<Pokemon>(url);
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + "/" + pokemon.id;
    return this.#http.put<Pokemon>(url, pokemon);
  }

  deletePokemon(id: number): Observable<void> {
    const url = this.#POKEMON_API_URL + "/" + id;
    return this.#http.delete<void>(url);
  }
 
  /**
   * Retourne la liste des types de Pokémon disponibles.
   * @returns {string[]} Liste des types de Pokémon.
   */
  getPokemonTypeList(): string[] {
    return [
      'Plante',
      'Feu',
      'Insecte',
      'Normal',
      'Electrik',
      'Poison',
      'Fée',
      'Eau',
      'Vol',
    ]
  }

}