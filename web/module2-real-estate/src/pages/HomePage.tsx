// =============================================================================
// PÁGINA: HOME - Real Estate React
// =============================================================================
// Página principal que muestra la lista de propiedades con filtros.
//
// ## Gestión de Estado en React 19
// Usamos useState para el estado local de filtros y propiedades.
// En aplicaciones más grandes, consideraríamos:
// - Context API para estado compartido
// - Zustand/Jotai para estado global simple
// - TanStack Query para datos del servidor
// =============================================================================

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // NUEVO: Importamos useNavigate
import { Plus, Search, X, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyCard } from '@/components/PropertyCard';
import { filterProperties, deleteProperty, initializeWithSampleData } from '@/lib/storage';
import type { Property, PropertyFilters } from '@/types/property';
import {
  PROPERTY_TYPES,
  OPERATION_TYPES,
  PROPERTY_TYPE_LABELS,
  OPERATION_TYPE_LABELS,
} from '@/types/property';

export function HomePage(): React.ReactElement {
  // =========================================================================
  // ESTADO
  // =========================================================================
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});

  // NUEVO: Estado para mantener los IDs de las propiedades seleccionadas para comparar
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);

  // NUEVO: Hook para la navegación programática
  const navigate = useNavigate();

  // ... (El código de loadProperties y useEffect se mantiene igual)
  const loadProperties = useCallback(() => {
    const filtered = filterProperties(filters);
    setProperties(filtered);
  }, [filters]);

  useEffect(() => {
    initializeWithSampleData();
    const timer = setTimeout(() => {
      loadProperties();
    }, 100);
    return () => clearTimeout(timer);
  }, [loadProperties]);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleFilterChange = (key: keyof PropertyFilters, value: string | number): void => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const handleClearFilters = (): void => {
    setFilters({});
  };

  const handleDelete = (id: string): void => {
    if (window.confirm('¿Estás seguro de eliminar esta propiedad?')) {
      deleteProperty(id);

      // NUEVO: Si eliminamos una propiedad, también la quitamos de la lista de comparación
      setComparedPropertyIds(prev => prev.filter(compareId => compareId !== id));

      loadProperties();
    }
  };

  // NUEVO: Handler para alternar la selección de una propiedad para comparar
  const handleToggleCompare = (id: string): void => {
    setComparedPropertyIds(prev => {
      // Si ya está seleccionada, la quitamos
      if (prev.includes(id)) {
        return prev.filter(compareId => compareId !== id);
      }
      // Si no está seleccionada y aún no llegamos al límite de 3, la agregamos
      if (prev.length < 3) {
        return [...prev, id];
      }
      // Si ya hay 3, no hacemos nada (el botón debería estar deshabilitado de todas formas)
      return prev;
    });
  };

  // Verificamos si hay filtros activos
  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && v !== 0
  );

  return (
    <div className="container mx-auto px-4 py-8 relative"> {/* NUEVO: relative para el botón flotante */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Propiedades Disponibles</h1>
          <p className="text-muted-foreground">
            {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        </div>

        <div className="flex gap-2"> {/* NUEVO: Contenedor para alinear los botones */}
          <Button asChild>
            <Link to="/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </Link>
          </Button>
        </div>
      </div>

      {/* ... (Todo el bloque de Filtros se mantiene exactamente igual) ... */}
      <div className="bg-card rounded-lg border p-4 mb-8">
        {/* ... */}
      </div>

      {/* Lista de propiedades */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDelete}
              // NUEVO: Pasamos las props necesarias para el CompareButton
              isCompared={comparedPropertyIds.includes(property.id)}
              onCompareToggle={handleToggleCompare}
              compareDisabled={comparedPropertyIds.length >= 3}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
           {/* ... (Estado vacío se mantiene igual) ... */}
        </div>
      )}

      {/* NUEVO: Botón Flotante para ir a la página de comparación (solo aparece si hay seleccionadas) */}
      {comparedPropertyIds.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            size="lg"
            className="shadow-xl flex items-center gap-2 rounded-full px-6"
            onClick={() => {
              // Navegamos a la página de comparación y pasamos los IDs en el "state" de la ruta
              navigate('/compare', { state: { propertyIds: comparedPropertyIds } });
            }}
          >
            <Scale className="h-5 w-5" />
            Comparar ({comparedPropertyIds.length}/3)
          </Button>
        </div>
      )}
    </div>
  );
}