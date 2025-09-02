'use client';

export function initCounterAnimation() {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') return;

  // Function to animate counting up
  const animateCounter = (element, target, duration = 2000, prefix = '', suffix = '') => {
    if (!element) return;
    
    // If the target ends with a plus sign, remove it for calculation but keep it for display
    let displaySuffix = suffix;
    let numericTarget = target;
    
    if (typeof target === 'string' && target.endsWith('+')) {
      numericTarget = parseInt(target.slice(0, -1));
      displaySuffix = '+' + suffix;
    } else if (target === '24/7') {
      // Special case for 24/7, don't animate
      element.textContent = target;
      return;
    } else {
      numericTarget = parseInt(target);
    }
    
    // Start from 0
    let startValue = 0;
    let startTime = null;
    
    // Animation function
    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (numericTarget - startValue) + startValue);
      
      element.textContent = `${prefix}${currentValue}${displaySuffix}`;
      
      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        // Ensure we end with the exact target value
        element.textContent = `${prefix}${numericTarget}${displaySuffix}`;
      }
    };
    
    window.requestAnimationFrame(updateCounter);
  };

  // Function to check if an element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Set up Intersection Observer
  const setupObserver = () => {
    const counterElements = {
      'customer-counter': '1000+',
      'flights-counter': '500+',
      'destinations-counter': '15+',
      'support-counter': '24/7'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const id = element.id;
          
          if (counterElements[id]) {
            animateCounter(element, counterElements[id]);
            // Unobserve after animation starts
            observer.unobserve(element);
          }
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all counter elements
    Object.keys(counterElements).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
  };

  // Initialize on page load
  if (document.readyState === 'complete') {
    setupObserver();
  } else {
    window.addEventListener('load', setupObserver);
  }

  // Also initialize when the component mounts (for SPA navigation)
  setupObserver();

  // Return cleanup function
  return () => {
    window.removeEventListener('load', setupObserver);
  };
}