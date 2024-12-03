---
title: "The Beginners Guide to Caching in Python: From Basics to Advanced Patterns"
author: Joel M.
date: 2024/9/27
description: "A guide to understanding and implementing introductionary caching in Python. Includes code examples, best practices, and common pitfalls to avoid."
thumbnail: blogs/caching/uses-of-caching.webp
readTime: 10 minutes
---

Imagine you're working on a weather application that needs to fetch temperature data for different cities. Each time a user requests the temperature for New York, your application makes an API call to a weather service, waits for the response, and then displays the result. This works fine when you have a few users, but what happens when thousands of people check New York's temperature within the same minute?

Your application would make thousands of identical API calls, each one:
- Consuming bandwidth
- Taking time to complete
- Potentially costing you money (if the API has usage limits)
- Creating unnecessary load on the weather service

This is where caching comes in.

## What is Caching?

Caching is like having a notepad next to your desk. Instead of calculating something or fetching data repeatedly, you write down the result the first time and then just glance at your notepad when you need that information again. As long as the information is still valid (more on this later), you save time and resources by reusing the previous result.

Let's see this in action with our weather app example:

```python
import requests
from datetime import datetime

def get_temperature(city):
    # Make an API call every time the function is called
    api_key = "your_api_key"
    url = f"https://api.weather.service/{city}?key={api_key}"
    response = requests.get(url)
    return response.json()["temperature"]

# Every call makes a new API request
print(get_temperature("New York"))  # API call
print(get_temperature("New York"))  # Another API call
print(get_temperature("New York"))  # Yet another API call
```

In this code, every time someone checks New York's temperature, we make a new API call. That's like calling the weather service every time someone asks you about the weather, even if someone else asked you the same question just seconds ago!

Let's improve this with a simple cache:

```python
# A dictionary to store our results
temperature_cache = {}

def get_temperature_cached(city):
    # Check if we already have the temperature in our cache
    if city in temperature_cache:
        cached_temp, timestamp = temperature_cache[city]
        # Assume data is valid for 30 minutes
        if (datetime.now() - timestamp).total_seconds() < 1800:
            print(f"Cache hit! Returning stored temperature for {city}")
            return cached_temp
    
    # If we don't have it in cache or it's too old, make the API call
    api_key = "your_api_key"
    url = f"https://api.weather.service/{city}?key={api_key}"
    response = requests.get(url)
    temperature = response.json()["temperature"]
    
    # Store in cache with current timestamp
    temperature_cache[city] = (temperature, datetime.now())
    print(f"Cache miss! Fetched new temperature for {city}")
    return temperature
```

Let's break down what's happening here:

1. We create a dictionary called `temperature_cache` to store our temperatures
2. When someone requests a city's temperature, we first check if it's in our cache
3. If it is, and it's less than 30 minutes old, we return the cached value
4. If it's not in the cache (or too old), we fetch a new value and store it

When we use this function:
```python
print(get_temperature_cached("New York"))  # API call (cache miss)
print(get_temperature_cached("New York"))  # Uses cached value (cache hit)
print(get_temperature_cached("New York"))  # Uses cached value (cache hit)
```

The first call makes an API request, but the next two calls return the cached value instantly. This is the magic of caching!

## Understanding Cache Hits and Misses

In the caching world, we use two important terms:

- **Cache Hit**: When we look for something in the cache and find it (like finding the temperature in our cache)
- **Cache Miss**: When we look for something but don't find it (like when we have to make a new API call)

Think of it like looking for a book in a library:
- If you find the book on the shelf, that's a cache hit
- If you have to order the book from another library, that's a cache miss

## A More Complex Example: The Fibonacci Sequence

Let's look at another scenario where caching shines. The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones. It's a perfect example of where caching can help with expensive calculations.

First, let's see how we might calculate Fibonacci numbers without caching:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Let's calculate fibonacci(5)
result = fibonacci(5)
print(f"The 5th Fibonacci number is: {result}")
```

This works, but there's a problem. Let's visualize what happens when we calculate fibonacci(5):

```
fibonacci(5)
├── fibonacci(4)
│   ├── fibonacci(3)
│   │   ├── fibonacci(2)
│   │   │   ├── fibonacci(1)
│   │   │   └── fibonacci(0)
│   │   └── fibonacci(1)
│   └── fibonacci(2)
│       ├── fibonacci(1)
│       └── fibonacci(0)
└── fibonacci(3)
    ├── fibonacci(2)
    │   ├── fibonacci(1)
    │   └── fibonacci(0)
    └── fibonacci(1)
```

Notice how we calculate fibonacci(2) three times! As the numbers get bigger, this redundancy becomes a huge problem. For fibonacci(50), we'd be recalculating the same values millions of times!

Let's add caching:

```python
def fibonacci_cached(n, cache={}):
    # Check if we've already calculated this number
    if n in cache:
        return cache[n]
    
    # Base cases
    if n <= 1:
        return n
    
    # Calculate and store in cache
    cache[n] = fibonacci_cached(n-1, cache) + fibonacci_cached(n-2, cache)
    return cache[n]
```

Now, when we calculate fibonacci(5), each number is calculated only once and stored in the cache. Any future requests for the same number use the cached value instead of recalculating it.

## Python's Built-in Caching Solution

After seeing these examples, you might be thinking: "This seems useful enough that Python should have a built-in way to do it." And you'd be right! Python provides a decorator called `@functools.lru_cache` that can automatically cache function results for us.

Here's a sneak peek:

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci_lru(n):
    if n <= 1:
        return n
    return fibonacci_lru(n-1) + fibonacci_lru(n-2)
```

This simple addition of `@lru_cache` automatically caches our function's results! We'll dive deeper into how this works and what "lru" means in the next section.

## When Should You Use Caching?

Before we go further, let's understand when caching makes sense and when it doesn't. Caching is like having a good assistant - it's fantastic in the right situation but can sometimes create more problems than it solves.

Good candidates for caching:
1. **Expensive Calculations**
   - Complex mathematical computations (like our Fibonacci example)
   - Heavy database queries
   - Data processing that takes significant time

2. **Repeated API Calls**
   - External service requests (like our weather example)
   - Database queries that return the same results
   - Any operation where you fetch the same data multiple times

3. **Static or Slowly-Changing Data**
   - User preferences
   - Configuration settings
   - Reference data that rarely changes

When to avoid caching:
1. **Rapidly Changing Data**
   - Real-time stock prices
   - Live sports scores
   - Current user location

2. **Unique Requests**
   - Random number generation
   - Time-sensitive operations
   - User-specific security tokens

## Looking Ahead: Advanced Caching

Now that you understand the basics of caching, you might be wondering about more complex scenarios:
- How do we handle cache expiration more elegantly?
- What if we need to cache data across multiple servers?
- How do we prevent memory from growing too large?
- What happens in multi-threaded applications?

We'll explore these advanced topics in Part 2 of this guide. But first, try implementing some simple caching in your own code using the patterns we've discussed. Start with the basic dictionary cache or `@lru_cache` decorator, and see how it improves your application's performance.

Remember: Start simple, measure the impact, and only add complexity when needed!

## Conclusion (Part 1)

We've covered the fundamentals of caching in Python:
- What caching is and why it's useful
- Basic caching implementation with dictionaries
- The power of caching for expensive calculations
- When to use (and not use) caching
- A preview of Python's built-in caching tools

In Part 2, we'll explore more advanced topics like:
- Different caching strategies
- Cache invalidation
- Thread-safe caching
- Distributed caching
- Best practices and common pitfalls

But for now, try implementing these basic caching patterns in your own code. Start with simple problems like our weather or Fibonacci examples, and see how caching can improve your application's performance!
