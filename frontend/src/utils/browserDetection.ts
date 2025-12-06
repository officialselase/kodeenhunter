// Browser detection and compatibility utilities

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  warnings: string[];
}

export const detectBrowser = (): BrowserInfo => {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  const warnings: string[] = [];

  // Detect browser
  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  }

  // Check support
  const isSupported = checkBrowserSupport(name, version);

  // Add warnings for older browsers
  if (!isSupported) {
    warnings.push('Your browser version may not support all features. Please update to the latest version.');
  }

  return { name, version, isSupported, warnings };
};

const checkBrowserSupport = (name: string, version: string): boolean => {
  const versionNum = parseInt(version);
  
  const minVersions: Record<string, number> = {
    Chrome: 90,
    Firefox: 88,
    Safari: 14,
    Edge: 90,
  };

  return versionNum >= (minVersions[name] || 0);
};

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTablet = (): boolean => {
  return /iPad|Android/i.test(navigator.userAgent) && !isMobile();
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

export const getViewportSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const getOrientation = (): 'portrait' | 'landscape' => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// Feature detection
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const supportsIntersectionObserver = (): boolean => {
  return 'IntersectionObserver' in window;
};

export const supportsServiceWorker = (): boolean => {
  return 'serviceWorker' in navigator;
};
