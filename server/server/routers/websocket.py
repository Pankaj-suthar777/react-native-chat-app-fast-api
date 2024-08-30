from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

user_connections: Dict[int, WebSocket] = {}

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    print("user_id",user_id)
    print("user_connections",user_connections)
    user_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received data from user_id {user_id}: {data}")
    except WebSocketDisconnect:
        print(f"WebSocket connection closed for user_id: {user_id}")
        del user_connections[user_id]

async def send_message_to_client(user_id: int, message: str):
    print("user_id",user_id)
    client = user_connections.get(user_id)
    print("client",client)
    if client:
        try:
           await client.send_text(message)
        except WebSocketDisconnect:
            del user_connections[user_id]