'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function LocationPicker({ onLocationSelect }) {
    const [isClient, setIsClient] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const onLocationSelectRef = useRef(onLocationSelect);

    // Torino center coordinates
    const torinoCenter = [45.0703, 7.6869];

    // Keep the callback ref updated
    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect;
    }, [onLocationSelect]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        if (mapInstanceRef.current) return; // Already initialized

        // Dynamically import Leaflet
        const initMap = async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            // Fix marker icon
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            if (mapRef.current && !mapInstanceRef.current) {
                const newMap = L.map(mapRef.current).setView(torinoCenter, 13);
                mapInstanceRef.current = newMap;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(newMap);

                newMap.on('click', async (e) => {
                    const { lat, lng } = e.latlng;
                    const L = (await import('leaflet')).default;

                    // Remove old marker if exists
                    if (markerRef.current) {
                        markerRef.current.remove();
                    }

                    // Add new marker
                    const newMarker = L.marker([lat, lng]).addTo(newMap);
                    markerRef.current = newMarker;

                    // Reverse geocode
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                            { headers: { 'User-Agent': 'LahoriGrill/1.0' } }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            const addr = data.address || {};
                            const parts = [];

                            if (addr.road) {
                                parts.push(addr.road + (addr.house_number ? ', ' + addr.house_number : ''));
                            }
                            if (addr.postcode) parts.push(addr.postcode);
                            if (addr.city || addr.town || addr.village) {
                                parts.push(addr.city || addr.town || addr.village);
                            }

                            const address = parts.join(', ') || data.display_name.split(',').slice(0, 3).join(',');

                            // Use ref to call callback (avoids re-render issues)
                            if (onLocationSelectRef.current) {
                                onLocationSelectRef.current(address);
                            }
                        }
                    } catch (error) {
                        console.error('Reverse geocoding error:', error);
                    }
                });
            }
        };

        initMap();

        // Cleanup on unmount only
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [isClient]); // Only depends on isClient

    if (!isClient) {
        return (
            <div style={{
                width: '100%',
                height: '200px',
                background: 'rgba(30, 30, 50, 0.5)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                marginTop: '1rem',
            }}>
                🗺️ Caricamento mappa...
            </div>
        );
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <p style={{
                marginBottom: '0.5rem',
                fontSize: '14px',
                color: 'var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                📍 Oppure clicca sulla mappa per selezionare la posizione
            </p>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(212, 164, 55, 0.3)',
                }}
            />
        </div>
    );
}
