import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { getEffectiveImage } from '../engines/imageService';

const placeImages = {
  umiam_lake: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  elephant_falls: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
  laitlum_canyon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  shillong_peak: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
  wards_lake: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  don_bosco_museum: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400&h=300&fit=crop',
  sweet_falls: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop',
  beadon_falls: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  crinoline_falls: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  mawphlang_sacred_forest: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
  sohpetbneng_peak: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  mawlynnong_village: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  dawki_river: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  nohkalikai_falls: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
  seven_sisters_falls: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop',
  mawsmai_caves: 'https://images.unsplash.com/photo-1462690419189-5f4e7e1b5c9b?w=400&h=300&fit=crop',
  air_force_museum: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400&h=300&fit=crop',
  rhino_museum: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400&h=300&fit=crop',
  golf_course: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop',
  cathedral_church: 'https://images.unsplash.com/photo-1516565061399-2dc8762a2adc?w=400&h=300&fit=crop',
  spread_eagle_falls: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop',
  lyngksiar_falls: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  bishop_falls: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  shillong_hati: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
  cherrapunji_viewpoint: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  mawsmai_village: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  dawki_viewpoint: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  krem_labiit: 'https://images.unsplash.com/photo-1462690419189-5f4e7e1b5c9b?w=400&h=300&fit=crop',
  krem_phyllut: 'https://images.unsplash.com/photo-1462690419189-5f4e7e1b5c9b?w=400&h=300&fit=crop',
  lakshmi_llorin_peak: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
  ramble_lake: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  umsiuh_river: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  thangkharang_park: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
  krang_suri_falls: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
  lady_hydari_park: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
};

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop';

const cardRotations = [-0.5, 0.3, -0.8, 0.6, -0.3, 0.5, -0.7, 0.4, -0.6, 0.8, -0.4, 0.7];

export default function PlaceCard({ place, index }) {
  const { selectedSpots, addSpot } = useBooking();
  const isSelected = selectedSpots.includes(place.id);
  const isMaxedOut = selectedSpots.length >= 3 && !isSelected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
      layout
      style={{ transform: `rotate(${cardRotations[index % cardRotations.length]}deg)` }}
      className={`group border-2 transition-all duration-300 ${
        isSelected
          ? 'bg-orange-500/[0.08] border-orange-500/50 shadow-[4px_4px_0_0_rgba(230,81,0,0.3)]'
          : isMaxedOut
          ? 'bg-[#1a1a1a]/50 border-white/5 opacity-30 cursor-not-allowed'
          : 'bg-[#1a1a1a] border-white/10 cursor-pointer hover:border-orange-500/40 hover:shadow-[3px_3px_0_0_rgba(230,81,0,0.15)]'
      }`}
      onClick={() => !isMaxedOut && addSpot(place.id)}
    >
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <motion.div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${getEffectiveImage(place.id)})` }}
          whileHover={!isMaxedOut ? { scale: 1.05 } : {}}
          transition={{ duration: 0.5 }}
        />

        <span className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-black/80 border border-white/15 text-white/80 text-[11px] font-['Anton'] uppercase tracking-wider">
          {place.category}
        </span>

        {isSelected && (
          <div className="absolute top-3 left-3 z-20">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-7 h-7 bg-orange-500 border-2 border-black flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-white/5">
        <h3 className="font-['Bebas_Neue'] text-white text-xl tracking-wider mb-1.5">{place.name}</h3>
        <p className="text-white/45 text-sm leading-[1.4] line-clamp-2 mb-2">{place.description}</p>
      </div>
    </motion.div>
  );
}
