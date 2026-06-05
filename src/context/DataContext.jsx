import { createContext, useContext, useState, useEffect } from 'react';
import { getPlaces, getHubs, getDistanceMatrix, getCircuits } from '../engines/dataService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [distanceMatrix, setDistanceMatrix] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function initData() {
      try {
        const [p, h, d, c] = await Promise.all([
          getPlaces(), 
          getHubs(), 
          getDistanceMatrix(), 
          getCircuits()
        ]);
        
        if (cancelled) return;
        
        setPlaces(p || []);
        setHubs(h || []);
        setDistanceMatrix(d);
        setCircuits(c || []);
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
    <DataContext.Provider value={{ places, hubs, circuits, distanceMatrix, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
