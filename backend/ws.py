# backend/ws.py
import asyncio
from typing import List

WS_CLIENTS: List = []
LOOP: asyncio.AbstractEventLoop | None = None


def set_event_loop(loop: asyncio.AbstractEventLoop):
    """Call from main startup to store the running loop used by uvicorn."""
    global LOOP
    LOOP = loop


async def _broadcast_async(payload: dict):
    dead = []
    for ws in list(WS_CLIENTS):
        try:
            await ws.send_json(payload)
        except Exception:
            dead.append(ws)
    for d in dead:
        try:
            WS_CLIENTS.remove(d)
        except ValueError:
            pass


def broadcast(payload: dict):
    """
    Thread-safe broadcast: schedule _broadcast_async on the uvicorn event loop.
    If loop is not set, fall back to running a new loop (blocking).
    """
    global LOOP
    if LOOP:
        # schedule without blocking
        asyncio.run_coroutine_threadsafe(_broadcast_async(payload), LOOP)
    else:
        # fallback (blocking) — safe for local demos but not ideal in prod
        loop = asyncio.new_event_loop()
        try:
            loop.run_until_complete(_broadcast_async(payload))
        finally:
            loop.close()
