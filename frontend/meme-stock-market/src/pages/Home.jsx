import { Link } from "react-router-dom";
import { TrendingUp, BarChart2, Award, Zap } from "react-feather";

export default function Home() {
  // Mock data for preview
  const leaderboard = [
    { rank: 1, name: "DogeLord", profit: "$42,690" },
    { rank: 2, name: "HarambeForever", profit: "$38,500" },
    { rank: 3, name: "NFTGoblin", profit: "$35,200" },
  ];

  const trendingStocks = [
    { symbol: "DOGE", change: "+12.3%" },
    { symbol: "GME", change: "+8.7%" },
    { symbol: "SHIB", change: "-3.2%" },
    { symbol: "ELON", change: "+45.6%" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Meme Stock Market Simulator
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Trade absurd assets, pump fake markets, and compete to become the
          ultimate meme lord!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/play"
            className="flex items-center gap-2 bg-gray-700 hover:bg-pink-500 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Zap size={18} />
            Start Trading
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 bg-gray-700 hover:bg-pink-500 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <BarChart2 size={18} />
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <TrendingUp className="text-pink-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Real-Time Trading</h3>
            <p className="text-gray-400">
              Prices update every second based on player actions and "news
              events"
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <BarChart2 className="text-purple-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Compete Globally</h3>
            <p className="text-gray-400">
              Climb the leaderboard by maximizing your portfolio gains
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <Award className="text-yellow-500 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Absurd Assets</h3>
            <p className="text-gray-400">
              Trade Dogecoin, Harambe Tokens, and other meme-worthy "stocks"
            </p>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Top Traders</h2>
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full 
                  ${
                    entry.rank === 1
                      ? "bg-yellow-500"
                      : entry.rank === 2
                      ? "bg-gray-400"
                      : "bg-amber-700"
                  }`}
                >
                  #{entry.rank}
                </span>
                <span className="font-medium">{entry.name}</span>
              </div>
              <span className="text-green-400 font-mono">{entry.profit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Ticker */}
      <section className="py-8 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-8 py-2">
            {trendingStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center gap-2 shrink-0"
              >
                <span className="font-bold">{stock.symbol}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    stock.change.startsWith("+")
                      ? "bg-green-900 text-green-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {stock.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
