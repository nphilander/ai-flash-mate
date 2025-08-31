import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartIconProps {
  itemCount?: number;
  className?: string;
}

export const CartIcon = ({ itemCount = 0, className = "" }: CartIconProps) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </div>
  );
};
