import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule]
})
export class LandingPageComponent  implements OnInit {
  progress = 0

  phrases: string[] = [
  "Cargando...",
  "Preparando datos...",
  "Procesando información...",
  "Espere un momento..."
];

  progressPhrase?: string;


  constructor(private router: Router, private _matprogressbar: MatProgressBarModule, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.progress = 0;
    this.progressPhrase = 'Cargando...'; // O una frase por defecto
    this.startProgressBar();
  }

  
 startProgressBar() {
  this.progress = 0; // Reinicia el progreso a 0
  const interval = setInterval(() => {
    this.progress += 7.3;
    this.progress = parseFloat(this.progress.toFixed(3));

    if (this.progress >= 100) {
      clearInterval(interval);
      this.router.navigate(['/home']);
    } else {
      this.progressPhrase = this.getRandomPhrase();
      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }, 2000); // Cambia el tiempo de actualización según tus necesidades
}
 
getRandomPhrase(): string {
    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    return this.phrases[randomIndex];
  }

}


