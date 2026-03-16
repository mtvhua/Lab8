import type React from 'react';
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageModal({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: ImageModalProps): React.ReactElement | null {

  // para el teclado y que no escrolee
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Botón para cerrar (X) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </Button>

      {/* Contador de imágenes (ej. "3 de 10") */}
      <div className="absolute top-6 left-6 text-white text-lg font-medium z-50">
        {currentIndex + 1} de {images.length}
      </div>

      {/* Botón Anterior */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 h-12 w-12 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft className="h-10 w-10" />
      </Button>

      {/* Imagen Principal */}
      <div
        className="relative max-w-5xl w-full h-full max-h-[85vh] flex items-center justify-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1} de la propiedad`}
          className="max-w-full max-h-full object-contain rounded-md shadow-2xl transition-all duration-300"
        />
      </div>

      {/* Botón Siguiente */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 h-12 w-12 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight className="h-10 w-10" />
      </Button>
    </div>
  );
}