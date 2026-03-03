import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { AtsCheckerComponent } from './components/ats-checker/ats-checker.component';
import { isPlatformBrowser } from '@angular/common';
import { inject as injectVercelAnalytics } from '@vercel/analytics';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AtsCheckerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
   private platformId = inject(PLATFORM_ID);

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

   ngOnInit() {
    // Only run Vercel Analytics in the browser (prevents SSR errors)
    if (isPlatformBrowser(this.platformId)) {
      injectVercelAnalytics();
    }
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}