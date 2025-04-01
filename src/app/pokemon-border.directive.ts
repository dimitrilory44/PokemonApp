import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appPokemonBorder]'
})
export class PokemonBorderDirective {

  /** Couleur initiale du bord de l'élément, sauvegardée lors de l'initialisation. */
  private initialColor: string;
  
  /** Le type de Pokémon pour déterminer la couleur du bord (via un signal ou un autre mécanisme de gestion d'état). */
  pokemonType = input.required<string>();

  /**
   * Constructeur de la directive. Initialise la couleur du bord de l'élément.
   * @param {ElementRef} el - Référence à l'élément DOM sur lequel la directive est appliquée.
   */
  constructor(private el: ElementRef) {

    // Sauvegarde la couleur initiale du bord de l'élément
    this.initialColor = this.el.nativeElement.style.borderColor;

    // Définit la largeur du bord de l'élément
    this.el.nativeElement.style.borderWidth = '2px';
  }

  /**
   * Écouteur d'événement déclenché lorsque la souris entre dans l'élément.
   * Change la couleur du bord en fonction du type de Pokémon.
   */
  @HostListener('mouseenter') onMouseEnter() {
    const color = this.getBorderColor();
    this.setBorder(color);
  }

   /**
   * Écouteur d'événement déclenché lorsque la souris quitte l'élément.
   * Restaure la couleur de bord initiale de l'élément.
   */
  @HostListener('mouseleave') onMouseLeave() {
    const color = this.initialColor;
    this.setBorder(color);
  }

  /**
   * Définit la couleur du bord de l'élément.
   * @param {string} color - La couleur à appliquer au bord de l'élément.
   */
  private setBorder(color: string) {
    this.el.nativeElement.style.borderColor = color;
  }

  /**
   * Détermine la couleur du bord en fonction du type de Pokémon.
   * @returns {string} La couleur correspondante au type de Pokémon.
   */
  private getBorderColor() {
    switch (this.pokemonType()) {
      case 'Feu':
        return '#EF5350';
      case 'Eau':
        return '#42A5F5';
      case 'Plante':
        return '#66BB6A';
      case 'Insecte':
        return '#8d6e63';
      case 'Vol':
        return '#90CAF9';
      case 'Poison':
        return '#b388ff';
      case 'Fée':
        return '#f8bbd0';
      case 'Electrik':
        return '#f4ff81';
      default:
        return '#303030';
    }
  }

}
