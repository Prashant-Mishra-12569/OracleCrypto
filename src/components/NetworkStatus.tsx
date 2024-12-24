import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WifiIcon } from "lucide-react";

interface NetworkStatusProps {
  isConnected: boolean;
  networkName: string;
}

export function NetworkStatus({ isConnected, networkName }: NetworkStatusProps) {
  return (
    <Badge variant="outline" className={cn(
      "glass-card px-4 py-2 flex items-center gap-2",
      isConnected ? "bg-green-500/10" : "bg-red-500/10"
    )}>
      <WifiIcon size={16} className={cn(
        isConnected ? "text-green-500" : "text-red-500"
      )} />
      <span>{networkName}</span>
    </Badge>
  );
}