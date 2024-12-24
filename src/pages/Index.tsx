import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { PriceCard } from "@/components/PriceCard";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

const CONTRACT_ADDRESS = "0xAc8DEF8e0ebE83c5484509638aC5Ee6e98e416C8";
const CONTRACT_ABI = [
  "function getLatestPrice(string) public view returns (int)"
];

const CRYPTO_DATA = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "LINK", name: "Chainlink" }
];

export default function Index() {
  const { toast } = useToast();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [networkName, setNetworkName] = useState("");

  const fetchPrice = async (symbol: string, contract: ethers.Contract) => {
    try {
      const price = await contract.getLatestPrice(symbol);
      console.log(`${symbol} price:`, price.toString());
      return Number(ethers.utils.formatUnits(price, 8));
    } catch (error) {
      console.error(`Error fetching ${symbol} price:`, error);
      return 0;
    }
  };

  const fetchAllPrices = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum) throw new Error("Please install MetaMask");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const newPrices: { [key: string]: number } = {};
      
      // Fetch prices sequentially to avoid any potential issues
      for (const { symbol } of CRYPTO_DATA) {
        const price = await fetchPrice(symbol, contract);
        newPrices[symbol] = price;
      }
      
      setPrices(newPrices);
    } catch (error: any) {
      toast({
        title: "Error fetching prices",
        description: error.message || "Please make sure you're connected to Sepolia network",
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
      fetchAllPrices();
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
    const interval = setInterval(fetchAllPrices, 30000); // Refresh every 30 seconds
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
              onClick={fetchAllPrices}
              disabled={isLoading}
            >
              <RefreshCwIcon size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CRYPTO_DATA.map((crypto) => (
            <PriceCard
              key={crypto.symbol}
              symbol={crypto.symbol}
              name={crypto.name}
              price={prices[crypto.symbol]?.toFixed(2) || "0.00"}
              priceChange={Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}