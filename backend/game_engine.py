import random
from typing import Dict, Any
import asyncio

class MemeStockEngine:
    def __init__(self):
        self.stocks = {
            "DOGE": {"price": 0.42, "history": []},
            "GME": {"price": 185.30, "history": []},
            "SHIB": {"price": 0.000012, "history": []},
            "ELON": {"price": 0.00032, "history": []}
        }
        self.news_events = [
            {"text": "Elon tweets about DOGE!", "impact": {"DOGE": 0.25}},
            {"text": "Reddit buys GME", "impact": {"GME": 1.5}},
            {"text": "NFT market crashes", "impact": {"SHIB": -0.4}}
        ]
        self.connected_clients = set()

    def _apply_news_event(self):
        """Randomly trigger market-moving events"""
        if random.random() > 0.95:  # 5% chance
            event = random.choice(self.news_events)
            print(f"🔥 News Event: {event['text']}")
            for stock, impact in event["impact"].items():
                self.stocks[stock]["price"] *= (1 + impact)

    def _update_prices(self):
        """Simulate natural market fluctuations"""
        for symbol in self.stocks:
            # Base random movement (-2% to +2%)
            change = (random.random() * 0.04 - 0.02)  
            self.stocks[symbol]["price"] *= (1 + change)
            
            # Keep history (last 100 entries)
            self.stocks[symbol]["history"].append({
                "time": asyncio.get_event_loop().time(),
                "price": self.stocks[symbol]["price"]
            })
            if len(self.stocks[symbol]["history"]) > 100:
                self.stocks[symbol]["history"].pop(0)

    async def run_market_simulation(self):
        """Continuously update market state"""
        while True:
            self._apply_news_event()
            self._update_prices()
            await asyncio.sleep(1)  # Update every second