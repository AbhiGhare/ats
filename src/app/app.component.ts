import { Component, signal, effect } from '@angular/core';
import { AtsCheckerComponent } from './components/ats-checker/ats-checker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AtsCheckerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  isDarkMode = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    // Effect runs whenever isDarkMode changes
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}