import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPlaces, getHubs, getDistanceMatrix, getCircuits, getHomestays, clearCache, getStoredDataVersion } from '../engines/dataService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [distanceMatrix, setDistanceMatrix] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dataVersion, setDataVersion] = useState(() => getStoredDataVersion())

  const initData = useCallback(async () => {
    const storedVersion = getStoredDataVersion()
    if (storedVersion && storedVersion !== dataVersion) {
      clearCache()
      setDataVersion(storedVersion)
    }
    try {
      const [p, h, d, c, hs] = await Promise.all([
        getPlaces(),
        getHubs(),
        getDistanceMatrix(),
        getCircuits(),
        getHomestays(),
      ])
      setPlaces(p || [])
      setHubs(h || [])
      setDistanceMatrix(d)
      setCircuits(c || [])
      setHomestays(hs || [])
    } catch (err) {
      console.error('Data initialization failed:', err)
    } finally {
      setLoading(false)
    }
  }, [dataVersion])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      await initData()
      if (cancelled) return
    }
    run()
    return () => { cancelled = true }
  }, [initData])

  useEffect(() => {
    const interval = setInterval(() => {
      const v = getStoredDataVersion()
      if (v && v !== dataVersion) {
        setDataVersion(v)
        clearCache()
        initData()
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [dataVersion, initData])

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
