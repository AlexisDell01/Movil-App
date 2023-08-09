import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileServiceService } from '../services/file-service.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './no-agave.component.html',
  styleUrls: ['./no-agave.component.scss'],
})
export class NoAgaveComponent implements OnInit {
  selectedFileBase64: string | null = null;
  constructor(
    private router: Router,
    private fileService: FileServiceService
  ) {}

  ngOnInit() {
    this.loadSelectedFileBase64();
  }
  loadSelectedFileBase64() {
    this.selectedFileBase64 = this.fileService.getSelectedFileBase64();
  }

  regresar() {
    // Vaciar la representación en base64 cuando el usuario regrese al componente HomePage
    this.fileService.setSelectedFileBase64('');
    this.router.navigate(['/home']);
  }
}
