// =============================================================================
// COMPONENTE: PROPERTY CARD - Real Estate React
// =============================================================================
// Tarjeta para mostrar una propiedad en la lista.
//
// ## Componentes funcionales en React 19
// React 19 simplifica el uso de componentes con mejoras como:
// - ref como prop regular (no necesita forwardRef para la mayoría de casos)
// - Mejor inferencia de tipos
// - Hooks mejorados
// =============================================================================

import type React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types/property';
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from '@/types/property';
import { formatPrice, formatArea, truncateText } from '@/lib/utils';

// NUEVO: Importamos el botón que acabamos de crear
import { CompareButton } from './CompareButton';

/**
 * Props del componente PropertyCard.
 */
interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;

  // NUEVO: Agregamos las props opcionales para manejar la comparación
  isCompared?: boolean;
  onCompareToggle?: (id: string) => void;
  compareDisabled?: boolean;
}

export function PropertyCard({
  property,
  onDelete,
  // NUEVO: Extraemos las nuevas props
  isCompared = false,
  onCompareToggle,
  compareDisabled = false
}: PropertyCardProps): React.ReactElement {

  const imageUrl =
    property.images?.[0] ?? `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(property.propertyType)}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Imagen con badge */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badge de tipo de operación */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${property.operationType === 'venta'
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white'
            }`}
        >
          {OPERATION_TYPE_LABELS[property.operationType]}
        </span>

        {/* Tipo de propiedad */}
        <span className="absolute top-3 right-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full">
          {PROPERTY_TYPE_LABELS[property.propertyType]}
        </span>
      </div>

      <CardContent className="p-4 flex-grow">
        {/* Título */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>

        {/* Ubicación */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span>{truncateText(`${property.address}, ${property.city}`, 40)}</span>
        </div>

        {/* Características */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{formatArea(property.area)}</span>
          </div>
        </div>

        {/* Precio */}
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
            {property.operationType === 'alquiler' && (
              <span className="text-sm font-normal text-muted-foreground">/mes</span>
            )}
          </span>
        </div>
      </CardContent>

      {/* NUEVO: Cambié el layout del footer a flex-col para que los botones se apilen bien */}
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex w-full gap-2">
          {/* Botón ver detalles */}
          <Button asChild className="flex-1">
            <Link to={`/property/${property.id}`}>Ver detalles</Link>
          </Button>

          {/* Botón eliminar */}
          {onDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(property.id)}
              aria-label="Eliminar propiedad"
            >
              <span aria-hidden="true">×</span>
            </Button>
          )}
        </div>

        {/* NUEVO: Renderizamos el botón de comparar solo si nos pasaron la función onCompareToggle */}
        {onCompareToggle && (
          <CompareButton
            propertyId={property.id}
            isSelected={isCompared}
            onToggle={onCompareToggle}
            disabled={compareDisabled}
          />
        )}
      </CardFooter>
    </Card>
  );
}