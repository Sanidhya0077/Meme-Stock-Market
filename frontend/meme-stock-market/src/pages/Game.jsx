import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  TrendingUp,
  DollarSign,
  AlertTriangle,
} from "react-feather";

export default function Game() {
  // Game state
  const ws = useRef(null);
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState({ DOGE: 0, GME: 0 });
  const [stocks, setStocks] = useState({
    DOGE: { price: 4.2, change: "+0.00%" },
    GME: { price: 185.3, change: "+0.00%" },
    SHIB: { price: 0.0012, change: "+0.00%" },
    ELON: { price: 0.0032, change: "+0.00%" },
  });
  const [selectedStock, setSelectedStock] = useState("DOGE");
  const [quantity, setQuantity] = useState(1);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);

  // Responsive states
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "market_update") {
        setStocks(data.data);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock WebSocket connection
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) => {
        const newStocks = { ...prev };
        Object.keys(newStocks).forEach((symbol) => {
          const changePercent = (Math.random() * 1000 - 500).toFixed(2);
          const changeValue = parseFloat(
            ((newStocks[symbol].price * changePercent) / 100).toFixed(4)
          );

          newStocks[symbol] = {
            price: parseFloat(
              (newStocks[symbol].price + changeValue < 0
                ? 1
                : newStocks[symbol].price + changeValue
              ).toFixed(6)
            ),
            change: `${changePercent > 0 ? "+" : ""}${changePercent}%`,
          };
          if (newStocks[symbol].price < 0) {
            newStocks[symbol].price = 0;
          }
        });
        return newStocks;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Trading functions
  const buyStock = () => {
    const totalCost = stocks[selectedStock].price * quantity;

    if (balance < totalCost) {
      setShowInsufficientFunds(true);
      setTimeout(() => setShowInsufficientFunds(false), 3000);
      return;
    }

    setBalance(balance - totalCost);
    setPortfolio({
      ...portfolio,
      [selectedStock]: (portfolio[selectedStock] || 0) + quantity,
    });
  };

  const sellStock = () => {
    if (portfolio[selectedStock] >= quantity) {
      const totalValue = stocks[selectedStock].price * quantity;
      setBalance(balance + totalValue);
      setPortfolio({
        ...portfolio,
        [selectedStock]: portfolio[selectedStock] - quantity,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-pink-500 hover:text-pink-400 text-sm md:text-base"
        >
          <ArrowLeft size={isMobile ? 18 : 20} />
          {!isMobile && "Back to Home"}
        </Link>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="font-mono text-sm md:text-base">
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stock Selector */}
      <div
        className={`grid ${
          isMobile ? "grid-cols-2" : "grid-cols-4"
        } gap-2 mb-6`}
      >
        {Object.keys(stocks).map((symbol) => (
          <button
            key={symbol}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedStock === symbol
                ? "bg-pink-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedStock(symbol)}
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-sm md:text-base">{symbol}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  stocks[symbol].change.startsWith("+")
                    ? "bg-green-900 text-green-400"
                    : "bg-red-900 text-red-400"
                }`}
              >
                {stocks[symbol].change}
              </span>
            </div>
            <div className={`${isMobile ? "text-xl" : "text-2xl"} mt-1`}>
              ${stocks[symbol].price}
            </div>
          </button>
        ))}
      </div>

      {/* Trading Panel */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
          <Zap size={isMobile ? 16 : 18} className="text-yellow-400" />
          Trade {selectedStock}
        </h3>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            max="10000"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-full bg-gray-700 text-white p-2 rounded text-sm md:text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={buyStock}
            // disabled={balance < stocks[selectedStock].price * quantity}
            className={`p-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm md:text-base ${
              balance < stocks[selectedStock].price * quantity
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <TrendingUp size={isMobile ? 14 : 16} />
            Buy
          </button>
          <button
            onClick={sellStock}
            disabled={
              !portfolio[selectedStock] || portfolio[selectedStock] < quantity
            }
            className={`p-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm md:text-base ${
              !portfolio[selectedStock] || portfolio[selectedStock] < quantity
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <TrendingUp size={isMobile ? 14 : 16} className="rotate-180" />
            Sell
          </button>
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
          <DollarSign size={isMobile ? 16 : 18} className="text-green-400" />
          Your Portfolio
        </h3>

        {Object.keys(portfolio).filter((sym) => portfolio[sym] > 0).length >
        0 ? (
          <div className="space-y-3">
            {Object.keys(portfolio)
              .filter((symbol) => portfolio[symbol] > 0)
              .map((symbol) => (
                <div
                  key={symbol}
                  className="flex justify-between items-center p-2 bg-gray-700 rounded"
                >
                  <span className="font-medium text-sm md:text-base">
                    {symbol}
                  </span>
                  <div className="text-right">
                    <div className="text-sm md:text-base">
                      {portfolio[symbol]} shares
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">
                      $
                      {(portfolio[symbol] * stocks[symbol]?.price || 0).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4 text-sm md:text-base">
            You don't own any stocks yet
          </p>
        )}
      </div>

      {/* Fixed Insufficient Funds Modal */}
      {showInsufficientFunds && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div
            className={`
            bg-red-600 text-white rounded-lg shadow-xl
            ${isMobile ? "w-full mx-4" : "w-96"}
            ${isMobile ? "p-4" : "p-6"}
            animate-bounce
          `}
          >
            <div
              className={`flex ${
                isMobile ? "flex-col gap-3" : "flex-row gap-4"
              } items-center`}
            >
              <AlertTriangle
                size={isMobile ? 24 : 32}
                className="flex-shrink-0 text-red-200"
              />
              <div className="text-center md:text-left">
                <h3
                  className={`font-bold mb-1 ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  Insufficient Funds!
                </h3>
                <p
                  className={`text-red-100 ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                >
                  Need $
                  {(stocks[selectedStock].price * quantity - balance).toFixed(
                    2
                  )}{" "}
                  more to buy {quantity} {selectedStock}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInsufficientFunds(false)}
              className={`
                mt-4 w-full
                bg-red-700 hover:bg-red-800 
                py-2 rounded
                transition-colors
                ${isMobile ? "text-sm" : "text-base"}
              `}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
