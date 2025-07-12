import React from 'react';

// Утилиты для оптимизации производительности

// Дебаунс функция для оптимизации поиска
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Мемоизация для дорогих вычислений
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Ленивая загрузка компонентов
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Оптимизация для больших списков
export const virtualizeList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(window.scrollY / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight
  };
};

// Оптимизация изображений
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Кэширование API запросов
export class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) { // 5 минут по умолчанию
    this.ttl = ttl;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Оптимизация рендеринга
export const useRenderOptimization = () => {
  const [renderCount, setRenderCount] = React.useState(0);
  
  const forceUpdate = React.useCallback(() => {
    setRenderCount(prev => prev + 1);
  }, []);
  
  return { renderCount, forceUpdate };
}; 