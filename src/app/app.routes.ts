import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';

export const routes: Routes = [
    {path: 'pokemons/edit/:id', component: PokemonEditComponent},
    {path: 'pokemons/:id', component: PokemonProfileComponent},
    {path: 'pokemons', component: PokemonListComponent, title: 'Pokedex'},
    {path: '', redirectTo: '/pokemons', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent, title: 'NotFound'}
];
