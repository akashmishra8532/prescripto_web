// Performance monitoring utility
export const performanceMonitor = {
  // Track page load time
  trackPageLoad: () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'page_load_time', {
            value: Math.round(loadTime),
            custom_parameter: 'load_time_ms'
          });
        }
      });
    }
  },

  // Track API response time
  trackApiCall: (url, startTime) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`API call to ${url} took ${duration.toFixed(2)}ms`);
    
    // Send to analytics if needed
    if (window.gtag) {
      window.gtag('event', 'api_call_time', {
        value: Math.round(duration),
        custom_parameter: 'api_url',
        custom_parameter_value: url
      });
    }
  },

  // Track image load time
  trackImageLoad: (src, startTime) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Image ${src} loaded in ${duration.toFixed(2)}ms`);
  },

  // Get current memory usage
  getMemoryUsage: () => {
    if (performance.memory) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
      };
    }
    return null;
  },

  // Monitor for memory leaks
  monitorMemory: () => {
    if (typeof window !== 'undefined' && performance.memory) {
      setInterval(() => {
        const memory = performanceMonitor.getMemoryUsage();
        if (memory && memory.used > memory.limit * 0.8) {
          console.warn('High memory usage detected:', memory);
        }
      }, 30000); // Check every 30 seconds
    }
  }
};

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
