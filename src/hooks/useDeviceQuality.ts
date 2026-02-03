import { useState, useEffect } from 'react';

export type DeviceQuality = 'low' | 'medium' | 'high';

export function useDeviceQuality() {
  const [quality, setQuality] = useState<DeviceQuality>('high');

  useEffect(() => {
    // Mobile detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Screen size detection
    const screenWidth = window.innerWidth;

    // Performance detection (simple heuristic)
    const isLowPerformance = isMobile || screenWidth < 768;
    const isMediumPerformance = screenWidth < 1024 && !isMobile;

    if (isLowPerformance) {
      setQuality('low');
    } else if (isMediumPerformance) {
      setQuality('medium');
    } else {
      setQuality('high');
    }
  }, []);

  return {
    quality,
    // Quality-specific settings
    useShadows: quality !== 'low',
    useReflections: quality === 'high',
    usePostProcessing: quality === 'high',
    pixelRatio: quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2),
    antialias: quality !== 'low',
    maxPolygons: quality === 'low' ? 1000 : quality === 'medium' ? 5000 : 20000,
  };
}
