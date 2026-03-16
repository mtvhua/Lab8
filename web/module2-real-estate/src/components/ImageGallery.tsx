import type React from 'react';
import { useState } from 'react';
import { ImageModal } from './ImageModal';
import { OPERATION_TYPE_LABELS } from '@/types/property';

interface ImageGalleryProps {
  images: string[];
  title: string;
  operationType: 'venta' | 'alquiler';
  propertyType: string;
}

export function ImageGallery({
  images,
  title,
  operationType,
  propertyType
}: ImageGalleryProps): React.ReactElement {

  // para saber que imagen esta abierta
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // por si el array esta vacio
  const displayImages = images.length > 0
    ? images
    : [`https://placehold.co/1200x600/e2e8f0/64748b?text=${encodeURIComponent(propertyType)}`];

  const handleOpen = (index: number) => setSelectedIndex(index);
  const handleClose = () => setSelectedIndex(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      // Si llega al final se repite lo del inicio
      setSelectedIndex(selectedIndex === displayImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? displayImages.length - 1 : selectedIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Imagen Principal Grande */}
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => handleOpen(0)}
      >
        <img
          src={displayImages[0]}
          alt={title}
          className="w-full h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        <span
          className={`absolute top-4 left-4 px-4 py-2 text-sm font-semibold rounded-full shadow-md ${
            operationType === 'venta' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {OPERATION_TYPE_LABELS[operationType]}
        </span>
      </div>

      {/* (Thumbnails) */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {displayImages.slice(1).map((img, index) => {
            const actualIndex = index + 1; // Le sumamos 1 porque el slice omitió el índice 0
            return (
              <div
                key={actualIndex}
                className="relative rounded-lg overflow-hidden h-24 cursor-pointer group"
                onClick={() => handleOpen(actualIndex)}
              >
                <img
                  src={img}
                  alt={`${title} - miniatura ${actualIndex}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      )}

      {/* modal */}
      {selectedIndex !== null && (
        <ImageModal
          images={displayImages}
          currentIndex={selectedIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}