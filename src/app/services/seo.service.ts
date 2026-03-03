// src/app/services/seo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title, 
    private meta: Meta,
    @Inject(DOCUMENT) private dom: Document
  ) {}

  updateSeoData(title: string, description: string, keywords: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    
    // Open Graph for LinkedIn/Socials
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });

    // Canonical URL
    let link: HTMLLinkElement | null = this.dom.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.dom.head.appendChild(link);
    }
    link.setAttribute('href', this.dom.URL);
  }
}