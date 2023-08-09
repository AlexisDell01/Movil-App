import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileServiceService } from '../services/file-service.service';

@Component({
  selector: 'app-agave',
  templateUrl: './agave.component.html',
  styleUrls: ['./agave.component.scss'],
})
export class AgaveComponent implements OnInit {
  processedImageSrc: string = '';
  selectedFileBase64: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileServiceService
  ) {}

  async ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    console.log(queryParams);
    this.processedImageSrc = queryParams['imagenProcesadaBase64'];
    console.log('Valor de processedImageSrc', this.processedImageSrc);

    if (this.processedImageSrc) {
      try {
        await this.fileService.loadProcessedImage(this.processedImageSrc);
        const serverResponse = this.fileService.getServerResponse();
        if (serverResponse) {
          // Actualizar processedImageSrc con la imagen en base64 de la respuesta
          this.processedImageSrc = `data:image/jpeg;base64,${serverResponse.imageWithLabelsBase64}`;
          console.log('Imagen en base64 cargada:', this.processedImageSrc);
        }
      } catch (error) {
        console.error('Error al cargar la imagen procesada:', error);
      }
    }
    this.loadSelectedFileBase64();
  }

  loadSelectedFileBase64() {
    this.selectedFileBase64 = this.fileService.getSelectedFileBase64();
  }

  return() {
    this.fileService.setSelectedFileBase64('');
    this.router.navigate(['/home']);
  }
}
