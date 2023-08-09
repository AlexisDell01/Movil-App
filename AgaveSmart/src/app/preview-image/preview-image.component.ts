import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileServiceService } from '../services/file-service.service';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent implements OnInit {
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

  goToSearching() {
    this.router.navigate(['/searching']);
  }

  return() {
    this.router.navigate(['/home']);
  }
}
