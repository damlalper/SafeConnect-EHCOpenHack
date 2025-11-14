import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function MapView({ peers = [], messages = [], currentLocation = null }) {
  const mapEl = useRef(null)
  const mapObj = useRef(null)
  const markersRef = useRef([])
  const currentLocationMarkerRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapEl.current || mapObj.current) return

    mapObj.current = new mapboxgl.Map({
      container: mapEl.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: [0, 0],
      zoom: 2,
      pitch: 60, // Set pitch for 3D view
      bearing: -17.6, // Rotate the map for a better perspective
    })

    mapObj.current.on('load', () => {
      setMapLoaded(true)
      
      // Add 3D buildings layer
      mapObj.current.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });

      // Try to get user's location and center map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords
            mapObj.current.flyTo({
              center: [longitude, latitude],
              zoom: 16, // Zoom in closer for 3D view
              pitch: 60,
              duration: 2000,
            })
          },
          (error) => {
            console.warn('Geolocation error:', error)
          }
        )
      }
    })

    // Add navigation controls
    mapObj.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      if (mapObj.current) {
        mapObj.current.remove()
        mapObj.current = null
      }
    }
  }, [])

  // Update current user location marker
  useEffect(() => {
    if (!mapObj.current || !mapLoaded || !currentLocation) return

    // Remove old current location marker
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.remove()
    }

    // Create pulsing current location marker
    const el = document.createElement('div')
    el.className = 'relative'
    el.innerHTML = `
      <div class="absolute inset-0 bg-blue-500 rounded-full opacity-50 animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
    `
    el.style.width = '20px'
    el.style.height = '20px'

    const marker = new mapboxgl.Marker(el)
      .setLngLat([currentLocation.lng, currentLocation.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<div class="text-sm font-semibold">Your Location</div>'
        )
      )
      .addTo(mapObj.current)

    currentLocationMarkerRef.current = marker
  }, [currentLocation, mapLoaded])

  // Update peer markers
  useEffect(() => {
    if (!mapObj.current || !mapLoaded) return

    // Remove all old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Get all locations from peers and status messages
    const locations = []

    // Add peer locations
    peers.forEach((peer) => {
      if (peer.location) {
        locations.push({
          ...peer,
          type: 'peer',
        })
      }
    })

    // Add status message locations
    messages
      .filter((msg) => msg.type === 'status' && msg.location)
      .forEach((msg) => {
        locations.push({
          id: msg.id,
          displayName: msg.from,
          status: msg.status,
          location: msg.location,
          timestamp: msg.timestamp,
          type: 'status',
        })
      })

    // Create markers for each location
    locations.forEach((item) => {
      const statusColor =
        item.status === 'help'
          ? '#ef4444' // red
          : item.status === 'water'
          ? '#3b82f6' // blue
          : '#22c55e' // green

      const statusIcon =
        item.status === 'help' ? '⚠' : item.status === 'water' ? '💧' : '✓'

      // Create marker element
      const el = document.createElement('div')
      el.className = 'relative cursor-pointer'
      el.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xl"
               style="background-color: ${statusColor}">
            ${statusIcon}
          </div>
          <div class="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent"
               style="border-top-color: ${statusColor}"></div>
        </div>
      `

      const popupContent = `
        <div class="text-sm">
          <div class="font-semibold mb-1">${item.displayName || 'Unknown'}</div>
          <div class="text-xs text-gray-600">
            Status: <span class="font-medium">${
              item.status === 'help'
                ? 'Needs Help'
                : item.status === 'water'
                ? 'Needs Water/Shelter'
                : 'Safe'
            }</span>
          </div>
          ${
            item.timestamp
              ? `<div class="text-xs text-gray-500 mt-1">${new Date(
                  item.timestamp
                ).toLocaleString()}</div>`
              : ''
          }
        </div>
      `

      const marker = new mapboxgl.Marker(el)
        .setLngLat([item.location.lng, item.location.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(mapObj.current)

      markersRef.current.push(marker)
    })

    // Fit map to show all markers if there are any
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      locations.forEach((item) => {
        bounds.extend([item.location.lng, item.location.lat])
      })
      if (currentLocation) {
        bounds.extend([currentLocation.lng, currentLocation.lat])
      }
      mapObj.current.fitBounds(bounds, { padding: 50, maxZoom: 15 })
    }
  }, [peers, messages, mapLoaded, currentLocation])

  // Update heatmap layer
  useEffect(() => {
    if (!mapObj.current || !mapLoaded) return;

    const statusLocations = messages
      .filter(msg => msg.type === 'status' && msg.location)
      .map(msg => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [msg.location.lng, msg.location.lat]
        },
        properties: {
          // Add a weight property, e.g., 'help' status is more intense
          weight: msg.status === 'help' ? 2 : 1
        }
      }));

    const heatmapSource = mapObj.current.getSource('status-heatmap');

    const geoJsonData = {
      type: 'FeatureCollection',
      features: statusLocations
    };

    if (heatmapSource) {
      heatmapSource.setData(geoJsonData);
    } else {
      mapObj.current.addSource('status-heatmap', {
        type: 'geojson',
        data: geoJsonData
      });

      mapObj.current.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'status-heatmap',
        maxzoom: 15,
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33, 102, 172, 0)',
            0.2, 'rgb(103, 169, 207)',
            0.4, 'rgb(209, 229, 240)',
            0.6, 'rgb(253, 219, 199)',
            0.8, 'rgb(239, 138, 98)',
            1, 'rgb(178, 24, 43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 30
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 1,
            15, 0
          ]
        }
      }, '3d-buildings'); // Add heatmap layer below the 3d buildings
    }
  }, [messages, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapEl} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
