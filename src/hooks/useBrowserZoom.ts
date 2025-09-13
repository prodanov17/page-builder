import { useState, useEffect, useCallback } from "react";

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export const useBrowserZoom = (initialLevel: number = 1) => {
  const [zoom, setZoom] = useState(initialLevel);

  useEffect(() => {
    // Apply the zoom to the body element
    document.body.style.zoom = String(zoom);

    // Cleanup function to reset zoom when the component unmounts
    return () => {
      document.body.style.zoom = "1";
    };
  }, [zoom]);

  const findClosestZoomIndex = (level: number) => {
    return ZOOM_LEVELS.reduce((prev, curr, index) => {
      return Math.abs(curr - level) < Math.abs(ZOOM_LEVELS[prev] - level)
        ? index
        : prev;
    }, 0);
  };

  const zoomIn = useCallback(() => {
    const currentIndex = findClosestZoomIndex(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1]);
    }
  }, [zoom]);

  const zoomOut = useCallback(() => {
    const currentIndex = findClosestZoomIndex(zoom);
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1]);
    }
  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  };
};
