import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Page de connexion',
    },
    {
        path: 'pokemons', 
        canActivateChild: [AuthGuard],
        children: [
            {path: 'edit/:id', component: PokemonEditComponent},
            {path: ':id', component: PokemonProfileComponent},
            {path: '', component: PokemonListComponent, title: 'Pokedex'}
        ]
    },
    {path: '', redirectTo: '/pokemons', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent, title: 'NotFound'}
];
