import time
import asyncio

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = float(capacity)
        self._tokens = float(capacity)
        self.refill_rate = float(refill_rate)
        self.last_refill_time = time.monotonic()
        self._lock = asyncio.Lock()

    def _refill(self):
        now = time.monotonic()
        elapsed_time = now - self.last_refill_time
        
        if elapsed_time > 0:
            new_tokens = elapsed_time * self.refill_rate
            self._tokens = min(self.capacity, self._tokens + new_tokens)
            self.last_refill_time = now

    async def consume(self, tokens_to_consume: int = 1):
        async with self._lock:
            self._refill()

            while self._tokens < tokens_to_consume:
                required_tokens = tokens_to_consume - self._tokens
                wait_time = required_tokens / self.refill_rate
                
                await asyncio.sleep(wait_time)
                
                self._refill()
            
            self._tokens -= tokens_to_consume