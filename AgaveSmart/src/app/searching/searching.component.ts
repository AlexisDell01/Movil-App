import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras } from '@angular/router';
import { FileServiceService } from '../services/file-service.service';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent implements OnInit {
  progress = 0;
  resultadoProcesamiento: string = 'En progreso...';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileServiceService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    try {
      const resultadoProcesamiento = await this.obtenerResultadoDelServidor();

      if (resultadoProcesamiento === 1) {
        const processedImageBase64 = await this.obtenerImagenDelServidor();
        if (processedImageBase64) {
          const navigationExtras: NavigationExtras = {
            queryParams: { imagenProcesadaBase64: processedImageBase64 },
          };
          console.log('Agaves identificados dentro de la imagen!');
          this.router.navigate(['/agave'], navigationExtras);
        } else {
          console.log('No hay agaves identificados dentro de la imagen!');
          this.router.navigate(['/no-agave']);
        }
      } else {
        this.resultadoProcesamiento = 'Procesamiento fallido';
        this.router.navigate(['/no-agave']);
      }
    } catch (error) {
      console.error('No hay agaves identificados dentro de la imagen!:', error);
      this.router.navigate(['/no-agave']);
      // Manejo de errores si es necesario
    }
  }

  async obtenerResultadoDelServidor(): Promise<number> {
    const urlAPI = 'http://localhost:3000/respuesta-servidor';

    try {
      const selectedFileName =
        this.fileService.getSelectedFileNameWithoutExtension();
      const response: any = await this.http
        .post(urlAPI, { nombreImagen: selectedFileName })
        .toPromise();

      if ('resultado' in response) {
        return response.resultado;
      } else {
        throw new Error('Resultado no encontrado en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al obtener el resultado del servidor:', error);
      throw error; // Relanzar el error para que el componente lo maneje
    }
  }

  async obtenerImagenDelServidor(): Promise<string | null> {
    const urlAPI = 'http://localhost:3000/procesar-imagen';

    try {
      const selectedFileName =
        this.fileService.getSelectedFileNameWithoutExtension();
      const response = await this.http
        .post<{ imageWithLabelsBase64: string }>(urlAPI, {
          nombreImagen: selectedFileName,
        })
        .toPromise();

      return response?.imageWithLabelsBase64 ?? null;
    } catch (error) {
      console.log('No se encontraron agaves en la imagen');
      return null;
    }
  }

  return() {
    this.router.navigate(['/home']);
  }
}
