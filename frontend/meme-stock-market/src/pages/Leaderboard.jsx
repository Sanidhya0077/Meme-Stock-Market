import { Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";

export default function Leaderboard() {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: "DogeWhisperer", profit: "$58,420", avatar: "🐶" },
    { rank: 2, name: "HarambeLegend", profit: "$49,300", avatar: "🦍" },
    { rank: 3, name: "GMEGang", profit: "$42,150", avatar: "🎮" },
    { rank: 4, name: "NFTQueen", profit: "$38,900", avatar: "👑" },
    { rank: 5, name: "ShrimpDynasty", profit: "$35,670", avatar: "🦐" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-400 mr-4"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
        </div>

        {/* Leaderboard table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {leaderboard.map((player) => (
            <div
              key={player.rank}
              className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 text-center">
                <span
                  className={`text-lg font-bold ${
                    player.rank === 1
                      ? "text-yellow-400"
                      : player.rank === 2
                      ? "text-gray-300"
                      : player.rank === 3
                      ? "text-amber-600"
                      : "text-gray-400"
                  }`}
                >
                  #{player.rank}
                </span>
              </div>

              <div className="mx-4 text-2xl">{player.avatar}</div>

              <div className="flex-1">
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-gray-400">Last trade: 2 mins ago</p>
              </div>

              <div className="text-right">
                <p className="text-green-400 font-mono">{player.profit}</p>
                <p className="text-xs text-gray-500">+12.5% today</p>
              </div>
            </div>
          ))}
        </div>

        {/* Your position */}
        <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-pink-500/30">
          <h3 className="text-lg font-bold mb-2 text-pink-400">
            Your Position
          </h3>
          <div className="flex items-center">
            <div className="w-10 text-center text-gray-400">#42</div>
            <div className="mx-4 text-2xl">😎</div>
            <div className="flex-1">
              <p className="font-medium">You</p>
              <p className="text-sm text-gray-400">Active now</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-mono">$12,450</p>
              <p className="text-xs text-gray-500">+3.2% today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
