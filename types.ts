
export type ConversionFormat = 'png' | 'jpeg' | 'webp' | 'gif';

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ConvertedFile extends ImageFile {
  convertedUrl: string;
  originalSize: number;
  convertedSize: number;
}

export interface ConversionOptions {
  format: ConversionFormat;
  quality: number; // 0-1
  resize: boolean;
  width: number;
  height: number;
}

export type ConversionStatus = 'idle' | 'converting' | 'done';

export interface Article {
    slug: string;
    title: string;
    description: string;
    date: string;
    content: React.FC;
}
