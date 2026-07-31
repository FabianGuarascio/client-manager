import { Injectable } from '@angular/core';

const STORAGE_KEY = 'client-manager-theme';
const DARK_CLASS = 'dark-theme';

/**
 * Maneja el modo oscuro: arranca según lo guardado en localStorage, o si no
 * hay nada guardado, según `prefers-color-scheme` del sistema. Aplica la
 * clase `.dark-theme` (definida en styles.scss) al <body>.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = false;

  init(): void {
    const guardado = localStorage.getItem(STORAGE_KEY);
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setDarkMode(guardado ? guardado === 'dark' : prefiereOscuro);
  }

  get isDarkMode(): boolean {
    return this.darkMode;
  }

  toggle(): void {
    this.setDarkMode(!this.darkMode);
  }

  private setDarkMode(activar: boolean): void {
    this.darkMode = activar;
    document.body.classList.toggle(DARK_CLASS, activar);
    localStorage.setItem(STORAGE_KEY, activar ? 'dark' : 'light');
  }
}
