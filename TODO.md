# TODO

## Features to Implement

1. **Persistence**: Add functionality to persist the cache to disk. This would allow the cache to survive application restarts.

2. **LRU (Least Recently Used) Eviction Policy**: If the cache reaches its maximum size, implement an LRU policy to remove the least recently used items first.

3. **Time-To-Live (TTL) for individual items**: Currently, there is a global expiry time. Add a TTL for individual items in the cache.

4. **Statistics**: Add methods to retrieve statistics about the cache, such as the current size, hit rate, miss rate, etc.

5. **Multi-level Cache**: Implement a multi-level cache (e.g., memory, disk) to improve performance.

6. **Cache Warming**: Add a feature to "warm" the cache by preloading it with data on startup.

7. **Bulk Operations**: Add methods to set/get multiple items at once.

8. **Event Emission**: Emit events when certain actions occur in the cache, such as an item being added, removed, or updated.

## Planning

Remember to carefully plan and design these features before implementing them, considering the potential impact on performance and complexity.