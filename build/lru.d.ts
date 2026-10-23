export declare class LRUCache<K, V> {
    private maxSize;
    private map;
    constructor(maxSize: number);
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): void;
    delete(key: K): boolean;
    clear(): void;
    get size(): number;
    setMaxSize(n: number): void;
}
//# sourceMappingURL=lru.d.ts.map