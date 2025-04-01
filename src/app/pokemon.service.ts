import { Injectable } from '@angular/core';
import { Pokemon, PokemonList } from './pokemon.model';
import { POKEMON_LIST } from './pokemon-list.fake';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  /**
   * Récupère la liste complète des Pokémon disponibles.
   * @returns {PokemonList} Liste des Pokémon.
   */
  getPokemonList(): PokemonList {
    return POKEMON_LIST;
  }

  /**
   * Récupère un Pokémon par son identifiant unique.
   * @param {number} id - L'identifiant du Pokémon recherché.
   * @returns {Pokemon} Le Pokémon correspondant à l'ID fourni.
   * @throws {Error} Si aucun Pokémon ne correspond à l'ID donné.
   */
  getPokemonById(id: number): Pokemon {
    const pokemon = POKEMON_LIST.find(pokemon => pokemon.id == id);

    if(!pokemon) {
      throw new Error(`No pokemon found with id ${id}`)
    }

    return pokemon;
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
      'Vol',
    ]
  }

}