import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileServiceService } from '../services/file-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private fileService: FileServiceService
  ) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Convert and save the selected file to base64 representation
      this.convertAndSaveFileToBase64();

      // Extract the filename without extension
      const fileNameWithoutExtension = this.getFileNameWithoutExtension(
        this.selectedFile.name
      );

      // Save the selected filename to the service
      this.fileService.setSelectedFile(this.selectedFile);

      // Call the service to save the filename on the server
      await this.fileService.saveFileNameAsJSON(fileNameWithoutExtension);

      // Navigate to the PreviewImageComponent
      this.router.navigate(['/preview-image']);
    } else {
      console.log('No se seleccionó ningún archivo.');
    }
  }

  convertAndSaveFileToBase64(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const base64Image = event.target.result as string;
          this.fileService.setSelectedFileBase64(base64Image);
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getFileNameWithoutExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return fileName.substring(0, lastDotIndex);
    }
    return fileName;
  }

  // Rest of the code remains the same...
}
