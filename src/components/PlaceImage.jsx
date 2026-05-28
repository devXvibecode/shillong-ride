import { useState, useCallback } from 'react';
import { getImageSourceList } from '../engines/imageService';

const LAST_RESORT = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop';

export default function PlaceImage({ placeId, alt, className, onLoad, onAllFailed, ...props }) {
  const sources = getImageSourceList(placeId);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const src = index < sources.length ? sources[index] : LAST_RESORT;

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
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      loading="lazy"
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}
