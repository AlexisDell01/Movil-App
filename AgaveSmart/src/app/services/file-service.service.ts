import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileServiceService {
  private serverResponse: any | null = null;
  private selectedFileNameWithoutExtension: string | null = null;
  private selectedFileBase64: string | null = null;

  constructor(private http: HttpClient) {}

  async saveFileNameAsJSON(fileName: string): Promise<void> {
    const urlAPI = 'http://localhost:3000/procesar-imagen';
    console.log('Guardando nombre del archivo en el servidor...');

    try {
      await this.http
        .post<void>(urlAPI, { nombreImagen: fileName })
        .toPromise();
      console.log('Nombre del archivo guardado correctamente.');
    } catch (error) {
      console.error('Error al guardar el nombre del archivo:', error);
      throw error;
    }
  }

  setSelectedFile(file: File | null): void {
    if (file) {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      this.selectedFileNameWithoutExtension = fileNameWithoutExtension;
    } else {
      this.selectedFileNameWithoutExtension = null;
    }
    console.log('Archivo seleccionado:', this.selectedFileNameWithoutExtension);
  }

  getSelectedFileNameWithoutExtension(): string | null {
    return this.selectedFileNameWithoutExtension;
  }
  setSelectedFileBase64(base64Image: string): void {
    this.selectedFileBase64 = base64Image;
  }
  getSelectedFileBase64(): string | null {
    return this.selectedFileBase64;
  }

  async loadProcessedImage(
    selectedFileNameWithoutExtension: string
  ): Promise<void> {
    // Tu lógica para cargar la imagen procesada desde el servidor
  }

  getServerResponse(): any | null {
    return this.serverResponse;
  }
}
