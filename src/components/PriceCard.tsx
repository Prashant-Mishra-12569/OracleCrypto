import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface PriceCardProps {
  symbol: string;
  name: string;
  price: string;
  priceChange: number;
  isLoading: boolean;
}

export function PriceCard({ symbol, name, price, priceChange, isLoading }: PriceCardProps) {
  return (
    <Card className={cn(
      "glass-card p-6 relative overflow-hidden transition-all duration-300 hover:translate-y-[-5px]",
      isLoading && "animate-pulse"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{symbol}</span>
          <span className="text-sm opacity-70">{name}</span>
        </div>
        <div className={cn(
          "flex items-center gap-1",
          priceChange > 0 ? "price-up" : "price-down"
        )}>
          {priceChange > 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
          <span className="font-medium">{Math.abs(priceChange).toFixed(2)}%</span>
        </div>
      </div>
      <div className="text-3xl font-bold animate-price-change">
        ${isLoading ? "..." : price}
      </div>
    </Card>
  );
}