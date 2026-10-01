import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Search, Navigation, Check, Loader2 } from 'lucide-react';
import type { InPostPoint } from '../types/api';
import 'leaflet/dist/leaflet.css';

interface InPostMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPoint: (point: InPostPoint) => void;
  lang: string;
  defaultCity?: string;
}

interface ShipXPoint {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    line1: string;
    line2: string;
  };
  address_details?: {
    city: string;
    street: string;
    building_number: string;
    post_code: string;
  };
  location_description?: string;
  opening_hours?: string;
}

export default function InPostMapModal({
  isOpen,
  onClose,
  onSelectPoint,
  lang,
  defaultCity = 'Warszawa',
}: InPostMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [points, setPoints] = useState<ShipXPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<ShipXPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch points around coordinates or by query
  const fetchPoints = async (lat?: number, lng?: number, query?: string) => {
    setIsLoading(true);
    setSearchError(null);
    try {
      let url = 'https://api-shipx-pl.easypack24.net/v1/points?type=parcel_locker&limit=35';
      if (query && query.trim().length > 0) {
        url += `&query=${encodeURIComponent(query.trim())}`;
      } else if (lat !== undefined && lng !== undefined) {
        url += `&relative_point=${lat},${lng}`;
      } else {
        url += '&city=Warszawa';
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Błąd pobierania punktów');
      const data = await res.json();
      const items: ShipXPoint[] = data.items || [];
      setPoints(items);

      if (items.length === 0) {
        setSearchError(lang === 'pl' ? 'Nie znaleziono Paczkomatów w tej lokalizacji.' : 'No parcel lockers found in this location.');
      } else if (!selectedPoint && items.length > 0) {
        setSelectedPoint(items[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch InPost points:', err);
      setSearchError(lang === 'pl' ? 'Wystąpił problem z połączeniem z bazą Paczkomatów.' : 'Could not fetch parcel lockers.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Leaflet map when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const defaultLat = 52.2297;
      const defaultLng = 21.0122;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([defaultLat, defaultLng], 13);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap clean free tiles (no tokens needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors | InPost',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // On pan/zoom end, update points around center
      map.on('moveend', () => {
        const center = map.getCenter();
        fetchPoints(center.lat, center.lng);
      });

      // Initial fetch based on defaultCity or coordinates
      if (defaultCity && defaultCity.trim().length > 1) {
        fetchPoints(undefined, undefined, defaultCity.trim());
      } else {
        fetchPoints(defaultLat, defaultLng);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update markers when points change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import('leaflet').then(({ default: L }) => {
      const layer = markersLayerRef.current;
      layer.clearLayers();

      points.forEach((point) => {
        const isSelected = selectedPoint?.name === point.name;
        const icon = L.divIcon({
          className: 'inpost-marker-icon',
          html: `<div style="
            background: ${isSelected ? '#1A140F' : '#FFD200'};
            color: ${isSelected ? '#F3EDE3' : '#111'};
            font-weight: 700;
            font-size: 11px;
            font-family: ui-monospace, SFMono-Regular, monospace;
            padding: 3px 7px;
            border-radius: 4px;
            border: 2px solid ${isSelected ? '#FFD200' : '#111'};
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
            transition: transform 0.15s ease;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          ">
            <span style="display:inline-block;width:6px;height:6px;background:${isSelected ? '#FFD200' : '#111'};border-radius:50%;"></span>
            ${point.name}
          </div>`,
          iconSize: [80, 26],
          iconAnchor: [40, 13],
        });

        const marker = L.marker([point.location.latitude, point.location.longitude], { icon });
        marker.on('click', () => {
          setSelectedPoint(point);
          mapInstanceRef.current?.panTo([point.location.latitude, point.location.longitude]);
        });
        layer.addLayer(marker);
      });

      // Pan to first point if available and searching
      if (searchQuery && points.length > 0) {
        const first = points[0];
        mapInstanceRef.current.setView([first.location.latitude, first.location.longitude], 14);
      }
    });
  }, [points, selectedPoint]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchPoints(undefined, undefined, searchQuery.trim());
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'pl' ? 'Twoja przeglądarka nie obsługuje geolokalizacji.' : 'Geolocation is not supported.');
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
        }
        fetchPoints(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLoading(false);
        alert(lang === 'pl' ? 'Nie udało się pobrać Twojej lokalizacji.' : 'Could not obtain location.');
      }
    );
  };

  const handleConfirmSelect = () => {
    if (!selectedPoint) return;
    const streetName = selectedPoint.address_details?.street || selectedPoint.address.line1 || '';
    const bld = selectedPoint.address_details?.building_number || '';
    const city = selectedPoint.address_details?.city || selectedPoint.address.line2 || '';
    const postal = selectedPoint.address_details?.post_code || '';

    onSelectPoint({
      id: selectedPoint.name,
      name: `Paczkomat ${selectedPoint.name}`,
      address: `${streetName} ${bld}`.trim(),
      city: city,
      postal_code: postal,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#2C2119] shadow-2xl z-10 flex flex-col overflow-hidden max-h-[88vh] mt-8 sm:mt-12"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6DCC9] bg-[#EBE2D3]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-[#FFD200] border border-[#111] rounded flex items-center justify-center text-[#111]">
                  <MapPin size={16} />
                </div>
                <h3 className="font-serif text-[#2C2119] text-base sm:text-lg font-semibold tracking-wide">
                  {lang === 'pl' ? 'Wybierz Paczkomat na mapie' : 'Select Parcel Locker'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-[#2C2119]/10 rounded-full transition-colors text-[#2C2119]"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 sm:p-4 bg-[#FAF7F2] border-b border-[#E6DCC9] flex flex-col sm:flex-row gap-2">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'pl' ? 'Wpisz miasto, ulicę lub kod (np. Mokotowska Warszawa, WAW123M)...' : 'Enter city, street or code...'}
                    className="w-full bg-white border border-[#E6DCC9] py-2 pl-9 pr-3 text-sm font-serif text-[#2C2119] focus:outline-none focus:border-[#2C2119]"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7C6D]" />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#2C2119] text-[#F3EDE3] text-xs uppercase tracking-widest font-semibold hover:bg-[#1A140F] transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : (lang === 'pl' ? 'Szukaj' : 'Search')}
                </button>
              </form>
              <button
                type="button"
                onClick={handleUseLocation}
                className="px-3 py-2 border border-[#2C2119] text-[#2C2119] text-xs uppercase tracking-wider font-semibold hover:bg-[#EBE2D3] transition-colors flex items-center justify-center space-x-1 whitespace-nowrap"
              >
                <Navigation size={14} />
                <span>{lang === 'pl' ? 'Moja lokalizacja' : 'My location'}</span>
              </button>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[360px] sm:h-[420px] bg-neutral-100">
              <div ref={mapContainerRef} className="w-full h-full" />
              {isLoading && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded border border-[#E6DCC9] text-xs font-serif text-[#2C2119] flex items-center space-x-2 shadow-sm z-[500]">
                  <Loader2 size={13} className="animate-spin text-[#2C2119]" />
                  <span>{lang === 'pl' ? 'Szukanie punktów...' : 'Searching...'}</span>
                </div>
              )}
              {searchError && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 px-4 py-2 rounded border border-rose-300 text-xs text-rose-800 font-serif shadow z-[500]">
                  {searchError}
                </div>
              )}
            </div>

            {/* Selected Locker Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E6DCC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {selectedPoint ? (
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-[#EBE2D3] text-[#2C2119] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    {selectedPoint.name.slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-[#2C2119] text-[#F3EDE3] px-2 py-0.5">
                        {selectedPoint.name}
                      </span>
                      {selectedPoint.location_description && (
                        <span className="text-xs text-[#8C7C6D] truncate max-w-[260px]">
                          {selectedPoint.location_description}
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-sm font-medium text-[#2C2119] mt-0.5 truncate">
                      {selectedPoint.address_details?.street || selectedPoint.address.line1}{' '}
                      {selectedPoint.address_details?.building_number},{' '}
                      {selectedPoint.address_details?.city || selectedPoint.address.line2}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#8C7C6D] font-serif">
                  {lang === 'pl' ? 'Kliknij znacznik Paczkomatu na mapie, aby go wybrać.' : 'Click a parcel locker pin on the map to select it.'}
                </p>
              )}

              <button
                type="button"
                onClick={handleConfirmSelect}
                disabled={!selectedPoint}
                className="w-full sm:w-auto px-6 py-3 bg-[#2C2119] text-[#F3EDE3] text-xs font-semibold uppercase tracking-widest hover:bg-[#1A140F] transition-colors disabled:opacity-40 flex items-center justify-center space-x-2 whitespace-nowrap self-stretch sm:self-auto"
              >
                <Check size={16} />
                <span>{lang === 'pl' ? 'Wybierz ten Paczkomat' : 'Select this locker'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
