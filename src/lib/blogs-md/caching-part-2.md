---
title: "The Advanced Guide to Caching in Python: From Theory to Production (Part 2)"
author: Joel M.
date: 2024/10/04
description: "A deep dive into advanced caching patterns in Python, focusing on production-ready implementations, thread safety, and cache invalidation strategies."
thumbnail: advanced-caching.webp
readTime: 15 minutes
---

In [Part 1](https://joelmr.com/blog/caching) of our caching guide, we covered the fundamentals of caching in Python. We learned about basic caching patterns, when to use them, and how to implement simple caches. Now, it's time to dive deep into the challenges you'll face when implementing caching in production systems.

## Real-World Caching: Beyond the Basics

Let's start with a real scenario that many developers face. You've implemented a simple cache in your application, and it works great in development. Then you deploy to production, and things start breaking in subtle ways:

```python
# Seems simple enough, right?
cache = {}

def get_user_data(user_id):
    if user_id in cache:
        return cache[user_id]
    
    data = fetch_from_database(user_id)
    cache[user_id] = data
    return data

# But what happens when...
# - Multiple threads access the cache?
# - The cache grows too large?
# - Cached data becomes stale?
# - The system restarts and loses all cached data?
```

These are the kinds of problems we'll solve in this guide. We'll focus on three critical areas that every production caching system needs to handle:

1. Advanced Local Caching Strategies
2. Thread-Safe Caching Implementations
3. Robust Cache Invalidation

## Advanced Local Caching: Building a Production-Ready LRU Cache

Let's start by building a production-ready LRU (Least Recently Used) cache from scratch. While Python's `@lru_cache` is great, understanding how to build one helps you handle custom requirements and understand performance tradeoffs.

Here's what our cache needs to handle:
- Maximum size constraints
- Automatic eviction of least recently used items
- Time-based expiration
- Memory usage monitoring
- Performance statistics

First, let's implement the core LRU cache structure:

```python
from collections import OrderedDict
from typing import TypeVar, Generic, Optional
from time import time
from dataclasses import dataclass
import sys

KT = TypeVar('KT')  # Key Type
VT = TypeVar('VT')  # Value Type

@dataclass
class CacheEntry(Generic[VT]):
    value: VT
    expiry: Optional[float] = None
    size: int = 0

class AdvancedLRUCache(Generic[KT, VT]):
    def __init__(
        self,
        max_size: int = 1000,
        max_memory_mb: float = 100,
        default_ttl: Optional[float] = None
    ):
        self._cache = OrderedDict()  # type: OrderedDict[KT, CacheEntry[VT]]
        self.max_size = max_size
        self.max_memory = max_memory_mb * 1024 * 1024  # Convert MB to bytes
        self.default_ttl = default_ttl
        
        # Statistics
        self.hits = 0
        self.misses = 0
        self.evictions = 0
        self._current_memory = 0

    def _estimate_size(self, value: VT) -> int:
        """Estimate memory size of a cached value in bytes."""
        return sys.getsizeof(value)

    def _evict_if_needed(self, needed_space: int = 0):
        """Evict entries if we're over max size or memory limit."""
        while (
            len(self._cache) >= self.max_size or
            (self._current_memory + needed_space) > self.max_memory
        ):
            if not self._cache:
                raise ValueError("Can't evict from empty cache")
            
            _, entry = self._cache.popitem(last=False)  # Remove oldest item
            self._current_memory -= entry.size
            self.evictions += 1

    def _is_expired(self, entry: CacheEntry[VT]) -> bool:
        """Check if a cache entry has expired."""
        return (
            entry.expiry is not None and
            time() > entry.expiry
        )

    def get(self, key: KT) -> Optional[VT]:
        """Get a value from the cache."""
        if key not in self._cache:
            self.misses += 1
            return None

        entry = self._cache[key]
        
        # Check for expiration
        if self._is_expired(entry):
            del self._cache[key]
            self._current_memory -= entry.size
            self.misses += 1
            return None

        # Move to end (most recently used)
        self._cache.move_to_end(key)
        self.hits += 1
        return entry.value

    def put(
        self,
        key: KT,
        value: VT,
        ttl: Optional[float] = None
    ) -> None:
        """Put a value into the cache."""
        # Calculate size and expiry
        size = self._estimate_size(value)
        expiry = None
        if ttl is not None or self.default_ttl is not None:
            expiry = time() + (ttl or self.default_ttl)

        # If key exists, update memory tracking
        if key in self._cache:
            self._current_memory -= self._cache[key].size
            del self._cache[key]

        # Ensure we have space
        self._evict_if_needed(size)

        # Add new entry
        entry = CacheEntry(value, expiry, size)
        self._cache[key] = entry
        self._current_memory += size
        self._cache.move_to_end(key)

    @property
    def stats(self):
        """Get cache statistics."""
        total_requests = self.hits + self.misses
        hit_rate = (self.hits / total_requests * 100) if total_requests > 0 else 0
        
        return {
            'size': len(self._cache),
            'memory_usage': self._current_memory / (1024 * 1024),  # MB
            'hits': self.hits,
            'misses': self.misses,
            'hit_rate': f"{hit_rate:.1f}%",
            'evictions': self.evictions
        }
```

This implementation includes several production-ready features:

1. **Generic Type Support**: Using TypeVar allows for type checking with any key/value types
2. **Memory Management**: Tracks and limits memory usage
3. **Expiration**: Supports both global and per-item TTL
4. **Statistics**: Tracks hits, misses, and evictions
5. **Memory Estimation**: Attempts to track actual memory usage

Let's see how to use it:

```python
# Create a cache with 1000 items max, 100MB memory limit, 1 hour default TTL
cache = AdvancedLRUCache[str, dict](
    max_size=1000,
    max_memory_mb=100,
    default_ttl=3600
)

# Store some user data
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {"theme": "dark", "notifications": True}
}

# Cache with 5-minute TTL
cache.put("user:123", user_data, ttl=300)

# Later...
if data := cache.get("user:123"):
    print(f"Found user: {data['name']}")
else:
    print("User data not found or expired")

# Check cache statistics
print(cache.stats)
```

### Understanding the Implementation

Let's break down the key features:

1. **Memory Management**
   The cache tracks memory usage using Python's `sys.getsizeof()`. While this isn't perfect (it doesn't track nested object sizes accurately), it provides a reasonable approximation for many use cases.

2. **Eviction Strategy**
   We use an OrderedDict to maintain item order, making it efficient to:
   - Find the least recently used item (first item)
   - Move recently accessed items to the end
   - Remove items in O(1) time

3. **Type Safety**
   Using generics allows for type checking:
   ```python
   # This will type check correctly
   cache: AdvancedLRUCache[str, dict] = AdvancedLRUCache()
   cache.put("key", {"value": 1})  # OK
   cache.put(123, {"value": 1})    # Type error!
   ```

4. **Statistics and Monitoring**
   The cache tracks important metrics:
   - Hit rate
   - Memory usage
   - Number of evictions
   - Cache size

### Handling Edge Cases

Our implementation handles several edge cases that you'll encounter in production:

1. **Memory Pressure**
   ```python
   # What if we try to cache something larger than our memory limit?
   huge_data = "x" * (200 * 1024 * 1024)  # 200MB
   cache = AdvancedLRUCache(max_memory_mb=100)
   
   try:
       cache.put("huge", huge_data)
   except ValueError as e:
       print("Can't cache item larger than memory limit")
   ```

2. **Concurrent Access**
   Our current implementation isn't thread-safe. We'll address this in the next section, but here's a preview of the issues:
   ```python
   # In thread 1
   data = cache.get("key")  # Cache miss
   
   # In thread 2 (simultaneously)
   data = cache.get("key")  # Also a cache miss
   
   # Both threads might try to fetch and cache the data
   ```

3. **Expiration Edge Cases**
   ```python
   # Item expires exactly as we're accessing it
   cache.put("key", "value", ttl=0.1)  # 100ms TTL
   time.sleep(0.1)
   # This could return None or the value, depending on timing
   value = cache.get("key")
   ```

## Moving to Thread Safety: The Concurrent Cache

Now that we have a solid LRU cache implementation, let's make it thread-safe. The main challenges are:

1. Preventing race conditions during get/put operations
2. Ensuring atomic updates to statistics
3. Handling concurrent evictions
4. Maintaining performance under contention

Here's how we'll modify our cache to handle concurrent access:

```python
from threading import Lock
from typing import Optional, TypeVar, Generic
from collections import OrderedDict
import threading
import time

KT = TypeVar('KT')
VT = TypeVar('VT')

class ThreadSafeLRUCache(Generic[KT, VT]):
    def __init__(
        self,
        max_size: int = 1000,
        max_memory_mb: float = 100,
        default_ttl: Optional[float] = None
    ):
        self._cache = OrderedDict()
        self._lock = Lock()
        
        # Use separate locks for statistics to reduce contention
        self._stats_lock = Lock()
        self._hits = 0
        self._misses = 0
        self._evictions = 0
        
        # Rest of initialization same as before
        ...

    def get(self, key: KT) -> Optional[VT]:
        """Thread-safe get operation."""
        with self._lock:
            if key not in self._cache:
                with self._stats_lock:
                    self._misses += 1
                return None

            entry = self._cache[key]
            
            # Check expiration
            if self._is_expired(entry):
                del self._cache[key]
                self._current_memory -= entry.size
                with self._stats_lock:
                    self._misses += 1
                return None

            # Move to end (most recently used)
            self._cache.move_to_end(key)
            with self._stats_lock:
                self._hits += 1
            return entry.value

    def put(
        self,
        key: KT,
        value: VT,
        ttl: Optional[float] = None
    ) -> None:
        """Thread-safe put operation."""
        size = self._estimate_size(value)
        expiry = None
        if ttl is not None or self.default_ttl is not None:
            expiry = time.time() + (ttl or self.default_ttl)

        with self._lock:
            # If key exists, update memory tracking
            if key in self._cache:
                self._current_memory -= self._cache[key].size
                del self._cache[key]

            # Ensure we have space
            self._evict_if_needed(size)

            # Add new entry
            entry = CacheEntry(value, expiry, size)
            self._cache[key] = entry
            self._current_memory += size
            self._cache.move_to_end(key)

    def _evict_if_needed(self, needed_space: int = 0):
        """Thread-safe eviction."""
        # Lock already acquired from put()
        while (
            len(self._cache) >= self.max_size or
            (self._current_memory + needed_space) > self.max_memory
        ):
            if not self._cache:
                raise ValueError("Can't evict from empty cache")
            
            _, entry = self._cache.popitem(last=False)
            self._current_memory -= entry.size
            with self._stats_lock:
                self._evictions += 1
```

### Understanding Thread Safety

Let's analyze the key aspects of our thread-safe implementation:

1. **Lock Granularity**
   We use two types of locks:
   - Main cache lock for get/put operations
   - Separate statistics lock to reduce contention

2. **Atomic Operations**
   All critical sections are protected:
   - Cache access and modification
   - Statistics updates
   - Memory accounting
   - Entry eviction

3. **Lock Contention**
   We minimize lock hold times by:
   - Using separate locks for different concerns
   - Preparing data outside of locked sections
   - Keeping critical sections as small as possible

Let's test our thread-safe cache with concurrent access:

```python
import threading
import random
import time

def test_concurrent_access():
    cache = ThreadSafeLRUCache[str, int](max_size=100)
    
    def worker(worker_id: int, iterations: int):
        for i in range(iterations):
            key = f"key:{random.randint(1, 50)}"
            operation = random.random()
            
            if operation < 0.7:  # 70% reads
                value = cache.get(key)
            else:  # 30% writes
                cache.put(key, random.randint(1, 1000))
            
            # Simulate some work
            time.sleep(0.001)
    
    # Create and start threads
    threads = []
    for i in range(10):
        t = threading.Thread(
            target=worker,
            args=(i, 1000)
        )
        threads.append(t)
        t.start()
    
    # Wait for all threads to complete
    for t in threads:
        t.join()
    
    # Print final statistics
    print(cache.stats)

# Run the test
test_concurrent_access()
```

### Common Threading Issues and Solution: Implement a "request coalescing" pattern:

Here are some common threading issues you might encounter and how to handle them:

1. **The Stampeding Herd Problem**
When a cached item expires, multiple threads might try to regenerate it simultaneously.

Solution: Implement a "request coalescing" pattern:

```python
from threading import Lock, Event
from typing import Dict, Optional, Tuple
from time import time

class CoalescingCache(ThreadSafeLRUCache[KT, VT]):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._pending_requests: Dict[KT, Tuple[Event, Optional[VT]]] = {}
        self._pending_lock = Lock()

    def get_or_compute(self, key: KT, compute_func) -> VT:
        """Get value from cache or compute it, preventing duplicate computation."""
        # First, try normal cache get
        if value := self.get(key):
            return value

        with self._pending_lock:
            # Check if someone is already computing this value
            if key in self._pending_requests:
                # Wait for the other thread to finish computing
                event, value = self._pending_requests[key]
                event.wait()
                return value

            # We'll be the one computing the value
            event = Event()
            self._pending_requests[key] = (event, None)

        try:
            # Compute the value
            value = compute_func()
            # Store in cache
            self.put(key, value)
            
            with self._pending_lock:
                # Update pending request with result
                self._pending_requests[key] = (event, value)
                # Signal waiting threads
                event.set()
                return value
        finally:
            with self._pending_lock:
                # Clean up after computation (success or failure)
                if event.is_set():
                    del self._pending_requests[key]
```

This solution ensures that only one thread computes a missing value while others wait for the result.

2. **Dead Locks**
When using multiple locks, deadlocks can occur if locks are acquired in different orders.

Solution: Always acquire locks in a consistent order:

```python
class SafeOrderingCache(ThreadSafeLRUCache[KT, VT]):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Define lock order explicitly
        self._lock_order = [
            self._lock,
            self._stats_lock
        ]
    
    def _acquire_all_locks(self):
        """Acquire all locks in consistent order."""
        for lock in self._lock_order:
            lock.acquire()
    
    def _release_all_locks(self):
        """Release all locks in reverse order."""
        for lock in reversed(self._lock_order):
            lock.release()
```

3. **Cache Consistency**
When multiple threads modify the cache, maintaining consistency becomes crucial.

Solution: Implement versioning for cached values:

```python
@dataclass
class VersionedEntry(CacheEntry[VT]):
    version: int = 0

class VersionedCache(ThreadSafeLRUCache[KT, VT]):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._versions: Dict[KT, int] = {}
        self._version_lock = Lock()

    def put(
        self,
        key: KT,
        value: VT,
        ttl: Optional[float] = None
    ) -> None:
        with self._version_lock:
            current_version = self._versions.get(key, 0) + 1
            self._versions[key] = current_version

        with self._lock:
            super().put(key, value, ttl)
            entry = self._cache[key]
            entry.version = current_version

    def get_with_version(
        self,
        key: KT,
        min_version: Optional[int] = None
    ) -> Tuple[Optional[VT], int]:
        """Get value only if it's at least at min_version."""
        with self._lock:
            entry = self._cache.get(key)
            if not entry:
                return None, 0
            
            if min_version and entry.version < min_version:
                return None, entry.version
                
            return entry.value, entry.version
```

## Cache Invalidation: Strategies for Maintaining Consistency

Now let's tackle what Phil Karlton famously called one of the "two hard things in Computer Science." Cache invalidation requires careful consideration of:

1. When to invalidate
2. How to handle race conditions
3. How to maintain consistency with the source of truth
4. How to prevent cascading failures

Let's implement a robust invalidation system:

```python
from enum import Enum, auto
from typing import Callable, Set, Pattern
import re

class InvalidationStrategy(Enum):
    IMMEDIATE = auto()  # Remove immediately
    LAZY = auto()       # Remove on next access
    TIMED = auto()      # Remove after delay

class InvalidationPattern(Enum):
    EXACT = auto()      # Exact key match
    PREFIX = auto()     # Key prefix match
    REGEX = auto()      # Regex pattern match

class InvalidationCache(ThreadSafeLRUCache[KT, VT]):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._invalid_keys: Set[KT] = set()
        self._pattern_invalidations: List[Tuple[Pattern, float]] = []
        self._invalidation_lock = Lock()
        
    def invalidate(
        self,
        key: Optional[KT] = None,
        pattern: Optional[str] = None,
        strategy: InvalidationStrategy = InvalidationStrategy.IMMEDIATE,
        delay: Optional[float] = None
    ) -> int:
        """
        Invalidate cache entries matching key or pattern.
        Returns number of items invalidated.
        """
        invalidated = 0
        
        with self._invalidation_lock:
            if key is not None:
                if strategy == InvalidationStrategy.IMMEDIATE:
                    with self._lock:
                        if key in self._cache:
                            del self._cache[key]
                            invalidated += 1
                else:
                    self._invalid_keys.add(key)
                    invalidated += 1
            
            if pattern is not None:
                regex = re.compile(pattern)
                if strategy == InvalidationStrategy.IMMEDIATE:
                    with self._lock:
                        keys_to_remove = [
                            k for k in self._cache.keys()
                            if regex.match(str(k))
                        ]
                        for k in keys_to_remove:
                            del self._cache[k]
                            invalidated += 1
                else:
                    expiry = time() + (delay or 0)
                    self._pattern_invalidations.append((regex, expiry))
                    # Count potential invalidations
                    with self._lock:
                        invalidated += sum(
                            1 for k in self._cache.keys()
                            if regex.match(str(k))
                        )
        
        return invalidated

    def get(self, key: KT) -> Optional[VT]:
        """Get value, checking invalidation status."""
        with self._invalidation_lock:
            # Check direct invalidation
            if key in self._invalid_keys:
                with self._lock:
                    if key in self._cache:
                        del self._cache[key]
                self._invalid_keys.remove(key)
                return None
            
            # Check pattern invalidations
            current_time = time()
            active_patterns = []
            for pattern, expiry in self._pattern_invalidations:
                if current_time < expiry:
                    active_patterns.append((pattern, expiry))
                    if pattern.match(str(key)):
                        with self._lock:
                            if key in self._cache:
                                del self._cache[key]
                        return None
            
            self._pattern_invalidations = active_patterns
        
        return super().get(key)
```

### Using the Invalidation System

Here's how to use our invalidation system effectively:

```python
# Create cache with invalidation support
cache = InvalidationCache[str, dict]()

# Store some user data
cache.put("user:123", {"name": "John"})
cache.put("user:124", {"name": "Jane"})
cache.put("config:db", {"host": "localhost"})

# Invalidate single key immediately
cache.invalidate(key="user:123")

# Invalidate all user entries with pattern
cache.invalidate(
    pattern="user:.*",
    strategy=InvalidationStrategy.LAZY
)

# Invalidate configuration after 5 minutes
cache.invalidate(
    pattern="config:.*",
    strategy=InvalidationStrategy.TIMED,
    delay=300
)
```

### Advanced Invalidation Patterns

Let's look at some advanced invalidation scenarios:

1. **Hierarchical Invalidation**
Sometimes you need to invalidate related items in a hierarchy:

```python
class HierarchicalCache(InvalidationCache[str, VT]):
    def _get_parent_keys(self, key: str) -> List[str]:
        """Get all parent keys in hierarchy."""
        parts = key.split(':')
        parents = []
        for i in range(len(parts)):
            parents.append(':'.join(parts[:i]))
        return parents
    
    def invalidate_with_children(self, key: str) -> int:
        """Invalidate key and all its children."""
        pattern = f"^{re.escape(key)}:.*"
        return self.invalidate(key=key) + self.invalidate(pattern=pattern)
```

2. **Time-Based Invalidation with Jitter**
To prevent thundering herd problems during mass invalidation:

```python
import random

class JitteredCache(InvalidationCache[KT, VT]):
    def invalidate_with_jitter(
        self,
        pattern: str,
        base_delay: float,
        jitter_range: float
    ) -> int:
        """Invalidate with randomized delay to prevent thundering herds."""
        delay = base_delay + random.uniform(0, jitter_range)
        return self.invalidate(
            pattern=pattern,
            strategy=InvalidationStrategy.TIMED,
            delay=delay
        )
```

3. **Conditional Invalidation**
Sometimes you want to invalidate based on the value:

```python
class ConditionalCache(InvalidationCache[KT, VT]):
    def invalidate_if(
        self,
        predicate: Callable[[VT], bool],
        pattern: Optional[str] = None
    ) -> int:
        """Invalidate entries where predicate(value) is True."""
        with self._lock:
            keys_to_invalidate = []
            for key, entry in self._cache.items():
                if pattern and not re.match(pattern, str(key)):
                    continue
                if predicate(entry.value):
                    keys_to_invalidate.append(key)
            
            return sum(
                self.invalidate(key=k)
                for k in keys_to_invalidate
            )
```

## Conclusion

We've covered three critical aspects of production-ready caching:

1. **Advanced Local Caching**
   - Memory-aware LRU implementation
   - Type-safe generics
   - Performance monitoring

2. **Thread Safety**
   - Lock granularity and ordering
   - Request coalescing
   - Version control

3. **Cache Invalidation**
   - Pattern-based invalidation
   - Time-based expiry with jitter
   - Hierarchical relationships

Remember these key principles:

1. **Monitor Everything**
   - Cache hit rates
   - Memory usage
   - Invalidation patterns
   - Thread contention

2. **Plan for Failure**
   - Handle race conditions
   - Implement timeouts
   - Use fallback mechanisms

3. **Choose the Right Patterns**
   - Match invalidation strategy to use case
   - Consider consistency requirements
   - Balance complexity vs. benefits

The code provided here is production-ready but remember to adapt it to your specific needs. Cache invalidation strategies, in particular, should be tailored to your application's consistency requirements and performance goals.
