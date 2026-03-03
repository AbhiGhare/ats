import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileParserService } from '../../services/file-parser.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-ats-checker',
  standalone: true,
  imports: [CommonModule, FormsModule, GaugeComponent],
  templateUrl: './ats-checker.component.html'
})
export class AtsCheckerComponent {
  jdText = signal('');
  resumeText = signal('');
  fileName = signal('');
  
  // Scoring Signals
  score = signal<number | null>(null);
  // aiScore = signal<number | null>(null); // COMMENTED FOR LATER
  // aiFeedback = signal<string>('');      // COMMENTED FOR LATER
  
  isScanning = signal(false);
  // isAiScanning = signal(false);         // COMMENTED FOR LATER

  // Hygiene Signals
  hasEmail = signal(false);
  hasPhone = signal(false);
  hasLinkedIn = signal(false);

  // Keyword Signals
  techMissing = signal<string[]>([]);
  softMissing = signal<string[]>([]);

  // API Config - COMMENTED FOR LATER
  /*
  private readonly GEMINI_API_KEY = 'AIzaSyAMXgknaGA4ESgAkAOOkYKt0CEJPCzyg5M';
  private readonly GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.GEMINI_API_KEY}`;
  */
  
  readonly TECH_DICT = ['angular', 'react', 'typescript', 'javascript', 'node', 'python', 'java', 'sql', 'aws', 'docker', 'git', 'api', 'html', 'css', 'testing', 'mongodb', 'azure', 'kubernetes', 'cicd', 'jenkins', 'devops', 'firebase', 'graphql', 'sass', 'webpack', 'figma', 'postman', 'linux', 'c#', 'c++', 'php', 'ruby', 'go', 'flutter', 'redux'];
  readonly SOFT_DICT = ['leadership', 'management', 'communication', 'problem', 'teamwork', 'collaboration', 'strategy', 'planning', 'mentoring', 'agile', 'scrum', 'creativity', 'adaptability', 'analytical', 'interpersonal', 'presentation', 'negotiation'];
  readonly PHRASE_DICT = ['web development', 'software engineering', 'project management', 'cloud computing', 'full stack', 'data science', 'machine learning', 'artificial intelligence', 'unit testing', 'user interface', 'front end', 'back end', 'micro services', 'mobile apps', 'rest api', 'responsive design'];

  constructor(private parser: FileParserService,private seo: SeoService ) {
      this.seo.updateSeoData(
      'Free ATS Resume Checker - Match Resume to Job Description',
      'Optimize your resume with our Smart ATS Check. Upload your resume and JD to find missing keywords and improve your hiring chances.',
      'ATS scanner, resume checker, keyword optimization, job application tool, ATS score'
    );
  }

  async onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName.set(file.name);
      const text = await this.parser.extractText(file);
      this.resumeText.set(text);
    }
  }

  async scan() {
    if (!this.jdText().trim() || !this.resumeText().trim()) return;
    
    // Start Local Engine
    this.runLocalScan();
    
    // Start AI Engine - COMMENTED FOR LATER
    // await this.runAiDeepScan();
  }

  private runLocalScan() {
    this.isScanning.set(true);
    const jd = this.jdText().toLowerCase();
    const res = this.resumeText().toLowerCase();

    this.hasEmail.set(/\S+@\S+\.\S+/.test(res));
    this.hasPhone.set(/(\+?\d{1,3}[- ]?)?\d{10}/.test(res));
    this.hasLinkedIn.set(res.includes('linkedin.com') || res.includes('li/in/'));

    const clean = (text: string) => text.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    const jdWords = clean(jd);
    const resWords = new Set(clean(res));

    const tm: string[] = [], sm: string[] = [];
    let weightedTotal = 0, weightedEarned = 0;

    this.PHRASE_DICT.forEach(phrase => {
      if (jd.includes(phrase)) {
        weightedTotal += 5;
        if (res.includes(phrase)) weightedEarned += 5;
        else tm.push(phrase);
      }
    });

    [...new Set(jdWords)].forEach(word => {
      const isTech = this.TECH_DICT.includes(word);
      const isSoft = this.SOFT_DICT.includes(word);
      if (isTech || isSoft) {
        const weight = isTech ? 3 : 1;
        weightedTotal += weight;
        if (resWords.has(word)) weightedEarned += weight;
        else isTech ? tm.push(word) : sm.push(word);
      }
    });

    this.techMissing.set([...new Set(tm)]);
    this.softMissing.set([...new Set(sm)]);
    this.score.set(weightedTotal > 0 ? Math.round((weightedEarned / weightedTotal) * 100) : 0);
    const finalScore = weightedTotal > 0 ? Math.round((weightedEarned / weightedTotal) * 100) : 0;
    this.isScanning.set(false);

    // 2. Dynamic SEO Update after Scan
    // This helps if the user shares their URL or for modern search engine indexing
    this.seo.updateSeoData(
      `My ATS Score: ${finalScore}% | ATS Smart Check Results`,
      `I just scored ${finalScore}% on my resume match! Check your own resume against any JD for free.`,
      'ATS score, resume results, career optimization'
    );
  }

  // AI FUNCTION COMMENTED FOR LATER
  /*
  private async runAiDeepScan() {
    this.isAiScanning.set(true);
    this.aiFeedback.set('');
    // ... logic ...
  }
  */

  copyKeywords() {
    const list = [...this.techMissing(), ...this.softMissing()].join(', ');
    navigator.clipboard.writeText(list || "No keywords to copy");
    alert('Optimization list copied to clipboard!');
  }
}