import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getPokemonColor, POKEMON_RULES } from '../../pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [MatProgressSpinnerModule, RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``
})
export class PokemonEditComponent {

    // Injection du service ActivatedRoute pour récupérer les paramètres de l'URL
    readonly route = inject(ActivatedRoute);

    // Service de navigation Angular, utilisé ici pour rediriger après la mise à jour
    readonly router = inject(Router);

    // Injection du service PokemonService pour récupérer les données du Pokémon
    readonly pokemonService = inject(PokemonService);

    // Récupération de l'ID du Pokémon à partir des paramètres de l'URL
    readonly pokemonId = Number(this.route.snapshot.paramMap.get('id'));

    // Création d'un signal contenant les informations du Pokémon récupéré par son ID
    // `.asReadonly()` permet d'empêcher toute modification directe de ce signal
    readonly pokemon = toSignal(this.pokemonService.getPokemonById(this.pokemonId));

    // Règles de validation définies globalement pour les Pokémon (nom, types, etc.)
    readonly POKEMON_RULES = POKEMON_RULES;

    // Création d'un formulaire réactif avec Angular `FormGroup`
    readonly form = new FormGroup({

      // Champ pour le nom du Pokémon, initialisé avec la valeur actuelle du Pokémon
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(POKEMON_RULES.MIN_NAME),
        Validators.maxLength(POKEMON_RULES.MAX_NAME),
        Validators.pattern(POKEMON_RULES.NAME_PATTERN),
      ]),

      // Champ pour les points de vie du Pokémon
      life: new FormControl(),

      // Champ pour les dégâts du Pokémon
      damage: new FormControl(),

      // FormArray pour stocker les types du Pokémon (ex: Feu, Eau, Plante, etc.)
      // Chaque type est représenté par un FormControl individuel dans un tableau
      types: new FormArray(
        [],
        [Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES)]
      )
    })

    constructor() {
      // Effet réactif déclenché automatiquement quand les données du Pokémon sont disponibles
      effect(() => {
        const pokemon = this.pokemon();

        if(pokemon) {
          // Remplit le formulaire avec les données actuelles du Pokémon
          this.form.patchValue({
            name: pokemon.name,
            life: pokemon.life,
            damage: pokemon.damage
          });

          // Ajoute chaque type existant du Pokémon dans le FormArray
          pokemon.types.forEach((type) => 
            this.pokemonTypeList.push(new FormControl(type))
          );
        }
      });
    }

    /**
      * Retourne la couleur associée à un type de Pokémon, pour l'affichage dans la vue.
      * Utilise une fonction utilitaire externe.
      */
    getPokemonColor(type: string) {
      return getPokemonColor(type);
    }

    /**
      * Retourne la couleur du texte à utiliser sur un badge de type donné.
      * Permet de s'assurer que le texte reste lisible selon la couleur de fond.
      */
    getChipTextColor(type: string): 'black' | 'white' {
      return type == 'Electrik' ? 'black' : 'white';
    }

    /**
      * Accesseur pour récupérer le champ "types" du formulaire, typé en FormArray.
      */
    get pokemonTypeList(): FormArray {
      return this.form.get('types') as FormArray;
    }

    /**
      * Accesseur pour le champ "name" du formulaire, typé en FormControl.
      */
    get pokemonName(): FormControl {
      return this.form.get('name') as FormControl;
    }

    /**
      * Accesseur pour le champ "life" du formulaire.
      */
    get pokemonLife(): FormControl {
      return this.form.get('life') as FormControl;
    }

    /**
      * Accesseur pour le champ "damage" du formulaire.
      */
    get pokemonDamage(): FormControl {
      return this.form.get('damage') as FormControl;
    }

    /**
      * Incrémente la valeur des dégâts du Pokémon dans le formulaire.
      */
    incrementDamage() {
      const newValue = this.pokemonDamage.value + 1;
      this.pokemonDamage.setValue(newValue);
    }

    /**
      * Décrémente la valeur des dégâts du Pokémon.
      */
    decrementDamage() {
      const newValue = this.pokemonDamage.value - 1;
      this.pokemonDamage.setValue(newValue);
    }

    /**
      * Incrémente les points de vie du Pokémon.
      */
    incrementLife() {
      const newValue = this.pokemonLife.value + 1;
      this.pokemonLife.setValue(newValue);
    }

    /**
      * Décrémente les points de vie du Pokémon.
      */
    decrementLife() {
      const newValue = this.pokemonLife.value - 1;
      this.pokemonLife.setValue(newValue);
    }

    /**
      * Vérifie si un type donné est actuellement sélectionné dans la liste des types du formulaire.
      */
    isPokemonTypeSelected(type: string): boolean {
      return !!this.pokemonTypeList.controls.find(
        (control) => control.value == type
      );
    }

    /**
      * Gère la sélection/désélection d’un type de Pokémon via une checkbox.
      * - Si coché, ajoute un FormControl au FormArray.
      * - Si décoché, supprime le type correspondant.
      */
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

    /**
      * Soumet le formulaire pour mettre à jour les données du Pokémon.
      * Si le formulaire est valide et que les données du Pokémon existent :
      * - Crée un nouvel objet avec les valeurs du formulaire.
      * - Envoie la mise à jour via le service.
      * - Redirige l'utilisateur vers la fiche du Pokémon mis à jour.
      */
    onSubmit() {
      const isFormValid = this.form.valid;
      const pokemon = this.pokemon();

      if (isFormValid && pokemon) {
        const updatedPokemon = {
          ...pokemon,
          name: this.pokemonName.value,
          life: this.pokemonLife.value,
          damage: this.pokemonDamage.value,
          types: this.pokemonTypeList.value
        };

        this.pokemonService.updatePokemon(updatedPokemon).subscribe(() => {
          this.router.navigate(['/pokemons', pokemon.id]);
        });
      }
    }
}
