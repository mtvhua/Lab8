import { Button } from './ui/button';

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
      // Si está seleccionado lo mostramos diferente
      variant={isSelected ? "secondary" : "outline"}
      onClick={() => onToggle(propertyId)}
      // Deshabilitamos el botón si ya se alcanzó el límite de 3
      disabled={disabled && !isSelected}
      className="w-full mt-2"
    >
      {isSelected ? "Quitar de comparación" : "Comparar"}
    </Button>
  );
}