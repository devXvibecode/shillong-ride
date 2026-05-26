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
    Promise.all([getPlaces(), getHubs(), getDistanceMatrix(), getCircuits()])
      .then(([p, h, d, c]) => {
        if (cancelled) return;
        setPlaces(p);
        setHubs(h);
        setDistanceMatrix(d);
        setCircuits(c);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
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
