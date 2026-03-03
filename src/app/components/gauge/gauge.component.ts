import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  standalone: true,
  template: `
    <div class="relative flex items-center justify-center">
      <svg class="w-40 h-40 transform -rotate-90">
        <!-- Gray Background Circle (adjusts for dark mode) -->
        <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="10" fill="transparent" class="text-slate-100 dark:text-zinc-800" />
        <!-- Active Meter -->
        <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="10" fill="transparent"
          [style.stroke-dasharray]="440"
          [style.stroke-dashoffset]="440 - (440 * (value() || 0) / 100)"
          [class]="value() > 75 ? 'text-violet-500' : value() > 40 ? 'text-amber-500' : 'text-rose-500'"
          class="transition-all duration-1000 ease-out stroke-current" />
      </svg>
      <span class="absolute text-4xl font-black text-slate-800 dark:text-zinc-100">{{ value() }}%</span>
    </div>
  `
})
export class GaugeComponent {
  value = input<number>(0);
}