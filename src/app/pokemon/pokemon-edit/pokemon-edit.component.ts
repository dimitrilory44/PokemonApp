import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getPokemonColor, POKEMON_RULES } from '../../pokemon.model';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``
})
export class PokemonEditComponent {

    // Injection du service ActivatedRoute pour récupérer les paramètres de l'URL
    readonly route = inject(ActivatedRoute);

    // Injection du service PokemonService pour récupérer les données du Pokémon
    readonly pokemonService = inject(PokemonService);

    // Récupération de l'ID du Pokémon à partir des paramètres de l'URL
    readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));

    // Création d'un signal contenant les informations du Pokémon récupéré par son ID
    // `.asReadonly()` permet d'empêcher toute modification directe de ce signal
    readonly pokemon = signal(this.pokemonService.getPokemonById(this.pokemonId)).asReadonly();

    readonly POKEMON_RULES = POKEMON_RULES;

    // Définition d'un formulaire réactif avec FormGroup
    readonly form = new FormGroup({

      // Champ pour le nom du Pokémon, initialisé avec la valeur actuelle du Pokémon
      name: new FormControl(this.pokemon().name, [
        Validators.required,
        Validators.minLength(POKEMON_RULES.MIN_NAME),
        Validators.maxLength(POKEMON_RULES.MAX_NAME),
        Validators.pattern(POKEMON_RULES.NAME_PATTERN),
      ]),

      // Champ pour les points de vie du Pokémon
      life: new FormControl(this.pokemon().life),

      // Champ pour les dégâts du Pokémon
      damage: new FormControl(this.pokemon().damage),

      // FormArray pour stocker les types du Pokémon (ex: Feu, Eau, Plante, etc.)
      // Chaque type est représenté par un FormControl individuel dans un tableau
      types: new FormArray(
        this.pokemon().types.map((type) => new FormControl(type)),
        [Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES)]
      )
    })

    getPokemonColor(type: string) {
      return getPokemonColor(type);
    }

    getChipTextColor(type: string): 'black' | 'white' {
      return type == 'Electrik' ? 'black' : 'white';
    }

    get pokemonTypeList(): FormArray {
      return this.form.get('types') as FormArray;
    }

    get pokemonName(): FormControl {
      return this.form.get('name') as FormControl;
    }

    get pokemonLife(): FormControl {
      return this.form.get('life') as FormControl;
    }

    get pokemonDamage(): FormControl {
      return this.form.get('damage') as FormControl;
    }

    incrementDamage() {
      const newValue = this.pokemonDamage.value + 1;
      this.pokemonDamage.setValue(newValue);
    }

    decrementDamage() {
      const newValue = this.pokemonDamage.value - 1;
      this.pokemonDamage.setValue(newValue);
    }

    incrementLife() {
      const newValue = this.pokemonLife.value + 1;
      this.pokemonLife.setValue(newValue);
    }

    decrementLife() {
      const newValue = this.pokemonLife.value - 1;
      this.pokemonLife.setValue(newValue);
    }

    isPokemonTypeSelected(type: string): boolean {
      return !!this.pokemonTypeList.controls.find(
        (control) => control.value == type
      );
    }

    onPokemonTypeChange(type: string, isChecked: boolean) {
      if(isChecked) {
        const control = new FormControl(type);
        this.pokemonTypeList.push(control);
      } else {
        const index = this.pokemonTypeList.controls
          .map((control) => control.value)
          .indexOf(type)

        this.pokemonTypeList.removeAt(index);
      }
    }

    onSubmit() {
      console.log(this.form.value);
    }
}
