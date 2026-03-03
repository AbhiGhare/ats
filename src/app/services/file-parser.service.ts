import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FileParserService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async extractText(file: File): Promise<string> {
    // 1. Safety check for Angular SSR
    if (!isPlatformBrowser(this.platformId)) return '';

    const ext = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    if (ext === 'pdf') {
      try {
        // 2. Dynamically load the LATEST installed pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist');

        // 3. Automatically sync the worker with the installed version
        const version = pdfjsLib.version;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + ' ';
        }
        return text;
      } catch (e) {
        console.error("PDF.js Latest Error:", e);
        return 'Error reading PDF';
      }
    } 
    
    if (ext === 'docx') {
      try {
        // 4. Dynamically load the LATEST mammoth
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } catch (e) {
        return 'Error reading Word file';
      }
    }

    return '';
  }
}