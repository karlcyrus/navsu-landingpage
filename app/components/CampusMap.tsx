"use client";

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function CampusMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'esri-satellite': {
              type: 'raster',
              tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
          },
          layers: [
            {
              id: 'satellite',
              type: 'raster',
              source: 'esri-satellite',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        } as maplibregl.StyleSpecification,
        center: [120.8660, 14.4030],
        zoom: 17,
        pitch: 0,
        bearing: 0,
        dragPan: true,
        scrollZoom: true
      });

      map.current.on('error', (e) => {
        console.error("MapLibre Error:", e);
        setError(e.error?.message || "Map failed to load tiles or style");
      });

      map.current.on('load', () => {
        if (!map.current) return;

        map.current.addSource('campus-data', {
          type: 'geojson',
          data: '/map.geojson'
        });

        // Campus Boundary Fill
        map.current.addLayer({
          id: 'campus-boundary-fill',
          type: 'fill',
          source: 'campus-data',
          filter: ['has', 'amenity'],
          paint: {
            'fill-color': '#0ea5e9',
            'fill-opacity': 0.1
          }
        });

        // Campus Boundary Outline
        map.current.addLayer({
          id: 'campus-boundary-outline',
          type: 'line',
          source: 'campus-data',
          filter: ['has', 'amenity'],
          paint: {
            'line-color': '#38bdf8',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        });

        // Buildings
        map.current.addLayer({
          id: 'buildings',
          type: 'fill',
          source: 'campus-data',
          filter: ['has', 'building'],
          paint: {
            'fill-color': '#0ea5e9',
            'fill-opacity': 0.7,
            'fill-outline-color': '#38bdf8'
          }
        });

        map.current.addLayer({
          id: 'paths',
          type: 'line',
          source: 'campus-data',
          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });

        map.current.addLayer({
          id: 'labels',
          type: 'symbol',
          source: 'campus-data',
          filter: ['==', '$type', 'Point'],
          layout: {
            'text-field': [
              'coalesce',
              ['get', 'Building'],
              ['get', 'Offices'],
              ['get', 'Office'],
              ''
            ],
            'text-size': 12,
            'text-anchor': 'top',
            'text-offset': [0, 1]
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#020617',
            'text-halo-width': 2
          }
        });
      });
    } catch (e: any) {
      setError(e.message || "Failed to initialize MapLibre");
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-900 rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 z-50 text-white p-4 text-center">
          Error: {error}
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%', position: 'absolute' }} />
    </div>
  );
}
