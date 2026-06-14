import { createContext, useContext, useState, useEffect } from 'react';
import { getPlaces, getHubs, getDistanceMatrix, getCircuits, getHomestays } from '../engines/dataService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [distanceMatrix, setDistanceMatrix] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function initData() {
      try {
        const [p, h, d, c, hs] = await Promise.all([
          getPlaces(), 
          getHubs(), 
          getDistanceMatrix(), 
          getCircuits(),
          getHomestays(),
        ]);
        
        if (cancelled) return;
        
        setPlaces(p || []);
        setHubs(h || []);
        setDistanceMatrix(d);
        setCircuits(c || []);
        setHomestays(hs || []);
      } catch (err) {
        console.error('Data initialization failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initData();
    return () => { cancelled = true; };
  }, []);

  return (
    <DataContext.Provider value={{ places, hubs, circuits, homestays, distanceMatrix, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
