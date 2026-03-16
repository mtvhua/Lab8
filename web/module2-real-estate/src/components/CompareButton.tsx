import { Button } from './ui/button';

// Definimos qué información necesita recibir el botón
interface CompareButtonProps {
  propertyId: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export function CompareButton({
  propertyId,
  isSelected,
  onToggle,
  disabled = false
}: CompareButtonProps) {

  return (
    <Button
      // Si está seleccionado lo mostramos diferente (puedes cambiar "secondary" por "default")
      variant={isSelected ? "secondary" : "outline"}
      onClick={() => onToggle(propertyId)}
      // Deshabilitamos el botón si ya se alcanzó el límite de 3,
      // PERO siempre permitimos hacer clic si ya está seleccionado (para poder quitarlo)
      disabled={disabled && !isSelected}
      className="w-full mt-2"
    >
      {isSelected ? "Quitar de comparación" : "Comparar"}
    </Button>
  );
}