export interface ImageWithPreview {
  file: File;
  preview: string;
}

export interface Pair {
  sourceImage?: ImageWithPreview;
  targetImage?: ImageWithPreview;
  description: string;
}
