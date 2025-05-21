from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from game_engine import MemeStockEngine
import uvicorn
import json
import asyncio

app = FastAPI()
engine = MemeStockEngine()

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    """Start market simulation when server starts"""
    asyncio.create_task(engine.run_market_simulation())
    asyncio.create_task(broadcast_market_data())

async def broadcast_market_data():
    """Send market updates to all connected clients"""
    while True:
        if manager.active_connections:
            await manager.broadcast(json.dumps({
                "type": "market_update",
                "data": engine.stocks
            }))
        await asyncio.sleep(1)  # Broadcast every second

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive client actions (e.g., buy/sell orders)
            data = await websocket.receive_text()
            await handle_client_message(data, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def handle_client_message(data: str, websocket: WebSocket):
    """Process client trades"""
    try:
        message = json.loads(data)
        
        if message["type"] == "place_order":
            # Validate and process order here
            response = {
                "type": "order_confirmation",
                "success": True,
                "order_id": "12345"
            }
            await websocket.send_text(json.dumps(response))
    except Exception as e:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": str(e)
        }))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)