import type React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPropertyById } from '@/lib/storage';
import type { Property } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';

export function ComparePage(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado local para las propiedades que estamos comparando
  const [compareList, setCompareList] = useState<Property[]>([]);

  // Efecto para cargar las propiedades basándonos en los IDs que recibimos del Home
  useEffect(() => {
    // Intentamos obtener los IDs del estado de la navegación
    const propertyIds = location.state?.propertyIds as string[] || [];

    if (propertyIds.length > 0) {
      // Buscamos la información completa de cada propiedad
      const loadedProperties = propertyIds
        .map(id => getPropertyById(id))
        .filter((p): p is Property => p !== undefined); // Filtramos por si alguna fue eliminada

      setCompareList(loadedProperties);
    }
  }, [location.state]);

  // Función para quitar una propiedad de la vista de comparación
  const handleRemove = (idToRemove: string) => {
    setCompareList(prev => prev.filter(p => p.id !== idToRemove));
  };

  // =========================================================================
  // LÓGICA DE DESTACADOS (Highlights)
  // =========================================================================
  // Calculamos los mejores valores para resaltarlos en la tabla
  const lowestPrice = compareList.length > 0
    ? Math.min(...compareList.map(p => p.price))
    : 0;

  const highestArea = compareList.length > 0
    ? Math.max(...compareList.map(p => p.area))
    : 0;

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Comparación de Propiedades</h1>
        <p className="text-muted-foreground mb-8">
          No has seleccionado ninguna propiedad para comparar.
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al listado y seleccionar propiedades
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver atrás
        </Button>
        <h1 className="text-3xl font-bold">Comparar Propiedades</h1>
        <p className="text-muted-foreground">
          Analiza y compara hasta 3 propiedades lado a lado para tomar la mejor decisión.
        </p>
      </div>

      {/* Tabla de Comparación usando CSS Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse bg-card rounded-lg overflow-hidden shadow-sm border">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground w-48">Características</th>
              {compareList.map(property => {
                const imageUrl = property.images?.[0] ?? `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(property.propertyType)}`;
                return (
                  <th key={property.id} className="p-4 text-center align-top w-72">
                    <div className="relative h-32 w-full mb-3 rounded-md overflow-hidden">
                      <img src={imageUrl} alt={property.title} className="object-cover w-full h-full" />
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground font-normal mb-3">{property.city}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(property.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Quitar
                    </Button>
                  </th>
                );
              })}
              {/* Espacios vacíos si hay menos de 3 */}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                <th key={`empty-head-${i}`} className="p-4 w-72 bg-muted/20"></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">

            {/* FILA: Precio */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium text-muted-foreground">Precio</td>
              {compareList.map(property => (
                <td key={property.id} className="p-4 text-center">
                  <div className={`text-lg font-semibold inline-flex items-center gap-1 ${property.price === lowestPrice ? 'text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full' : ''}`}>
                    {property.price === lowestPrice && <Trophy className="h-4 w-4" />}
                    {formatPrice(property.price)}
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-price-${i}`}></td>)}
            </tr>

            {/* FILA: Área */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium text-muted-foreground">Área Total</td>
              {compareList.map(property => (
                <td key={property.id} className="p-4 text-center">
                  <div className={`inline-flex items-center gap-1 ${property.area === highestArea ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full font-semibold' : ''}`}>
                    {property.area === highestArea && <Trophy className="h-4 w-4" />}
                    {formatArea(property.area)}
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-area-${i}`}></td>)}
            </tr>

            {/* FILA: Habitaciones */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium text-muted-foreground">Habitaciones</td>
              {compareList.map(property => (
                <td key={property.id} className="p-4 text-center font-medium">
                  {property.bedrooms}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-beds-${i}`}></td>)}
            </tr>

            {/* FILA: Baños */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium text-muted-foreground">Baños</td>
              {compareList.map(property => (
                <td key={property.id} className="p-4 text-center font-medium">
                  {property.bathrooms}
                </td>
              ))}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-baths-${i}`}></td>)}
            </tr>

            {/* precio por m2, lo calcula automaticamente */}
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="p-4 font-medium text-muted-foreground">Precio / m²</td>
              {compareList.map(property => {
                const pricePerSqm = property.price / property.area;
                return (
                  <td key={property.id} className="p-4 text-center">
                    {formatPrice(pricePerSqm)}
                  </td>
                );
              })}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-sqm-${i}`}></td>)}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}