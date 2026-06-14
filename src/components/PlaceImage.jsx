import { useState, useCallback } from 'react';
import { getImageSourceList } from '../engines/imageService';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
];

function getFallback(placeId) {
  let hash = 0;
  if (placeId) {
    for (let i = 0; i < placeId.length; i++) {
      hash = ((hash << 5) - hash) + placeId.charCodeAt(i);
    }
  }
  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

export default function PlaceImage({ placeId, alt, className, onLoad, onAllFailed, ...props }) {
  const sources = getImageSourceList(placeId);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = failed ? getFallback(placeId) : (index < sources.length ? sources[index] : getFallback(placeId));

  const handleError = useCallback(() => {
    const next = index + 1;
    if (next < sources.length) {
      setIndex(next);
    } else {
      setFailed(true);
      if (onAllFailed) onAllFailed();
    }
  }, [index, sources.length, onAllFailed]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <div className={`relative ${className || ''}`}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={src}
        alt={alt || ''}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        style={{ position: 'absolute', inset: 0 }}
        {...props}
      />
    </div>
  );
}
