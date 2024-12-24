import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { PriceCard } from "@/components/PriceCard";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  "function getAllPrices() public view returns (int256 btcPrice, int256 ethPrice, int256 linkPrice, int256 bnbPrice, int256 ltcPrice)"
];

const CRYPTO_DATA = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "LTC", name: "Litecoin" }
];

export default function Index() {
  const { toast } = useToast();
  const [prices, setPrices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [networkName, setNetworkName] = useState("");

  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum) throw new Error("Please install MetaMask");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const priceData = await contract.getAllPrices();
      
      setPrices(priceData.map((price: any) => 
        Number(ethers.utils.formatUnits(price, 8))
      ));
    } catch (error) {
      toast({
        title: "Error fetching prices",
        description: "Please make sure you're connected to Sepolia network",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== 11155111) { // Sepolia chainId
        throw new Error("Please connect to Sepolia network");
      }

      setIsConnected(true);
      setNetworkName("Sepolia");
      fetchPrices();
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    connectWallet();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Crypto Price Oracle</h1>
          <div className="flex items-center gap-4">
            <NetworkStatus isConnected={isConnected} networkName={networkName} />
            <Button
              variant="outline"
              className="glass-card"
              onClick={fetchPrices}
              disabled={isLoading}
            >
              <RefreshCwIcon size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CRYPTO_DATA.map((crypto, index) => (
            <PriceCard
              key={crypto.symbol}
              symbol={crypto.symbol}
              name={crypto.name}
              price={prices[index]?.toFixed(2) || "0.00"}
              priceChange={Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)} // Mock price change
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}