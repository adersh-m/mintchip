import React from 'react';

/**
 * Performance monitoring utilities for the application
 */

export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  /**
   * Start measuring performance for a given operation
   */
  static startMeasure(name: string): void {
    if (typeof performance !== 'undefined') {
      this.measurements.set(name, performance.now());
    }
  }

  /**
   * End measuring and log the duration
   */
  static endMeasure(name: string): number | null {
    if (typeof performance !== 'undefined' && this.measurements.has(name)) {
      const startTime = this.measurements.get(name)!;
      const duration = performance.now() - startTime;
      
      if (import.meta.env.DEV) {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      }
      
      this.measurements.delete(name);
      return duration;
    }
    return null;
  }

  /**
   * Measure React component render time
   */
  static measureComponent(componentName: string) {
    return {
      start: () => this.startMeasure(`${componentName} render`),
      end: () => this.endMeasure(`${componentName} render`)
    };
  }

  /**
   * Log Core Web Vitals if available
   */
  static logWebVitals(): void {
    if (typeof performance !== 'undefined' && 'getEntriesByType' in performance) {
      // Largest Contentful Paint
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1] as PerformanceEntry & { startTime: number };
        console.log(`🎯 LCP: ${lcp.startTime.toFixed(2)}ms`);
      }

      // First Input Delay
      const fidEntries = performance.getEntriesByType('first-input');
      if (fidEntries.length > 0) {
        const fid = fidEntries[0] as PerformanceEntry & { processingStart: number; startTime: number };
        console.log(`⚡ FID: ${(fid.processingStart - fid.startTime).toFixed(2)}ms`);
      }

      // Cumulative Layout Shift
      const clsEntries = performance.getEntriesByType('layout-shift') as Array<PerformanceEntry & { value: number }>;
      if (clsEntries.length > 0) {
        const cls = clsEntries.reduce((sum, entry) => sum + entry.value, 0);
        console.log(`📐 CLS: ${cls.toFixed(4)}`);
      }
    }
  }
}

/**
 * Hook to measure component performance
 */
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.measureComponent(componentName);
  
  return {
    start: monitor.start,
    end: monitor.end
  };
}

/**
 * HOC to automatically measure component render time
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || Component.displayName || Component.name || 'Component';
  
  return function PerformanceMonitoredComponent(props: P) {
    const monitor = usePerformanceMonitor(name);
    
    monitor.start();
    
    // Use effect to measure after render
    React.useEffect(() => {
      monitor.end();
    });
    
    return React.createElement(Component, props);
  };
}

// Initialize web vitals logging in development
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => PerformanceMonitor.logWebVitals(), 1000);
  });
}
