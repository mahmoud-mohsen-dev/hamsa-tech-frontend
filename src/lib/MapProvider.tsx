'use client';
import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { Spin } from 'antd';
import { ReactNode } from 'react';

// Define a list of libraries to load from the Google Maps API
const libraries = ['places', 'drawing', 'geometry'];

const mapTheme = [
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f7f1df'
      }
    ]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#d0e3b4'
      }
    ]
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fbd3da'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#bde6ab'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffe15f'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#efd151'
      }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff'
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: 'black'
      }
    ]
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#cfb2db'
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#a2daf2'
      }
    ]
  }
];

export const mapOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GMAK as string,
  mapTheme: mapTheme
};

// Define a function component called MapProvider that takes a children prop
export function MapProvider({ children }: { children: ReactNode }) {
  // Load the Google Maps JavaScript API asynchronously
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapOptions.googleMapsApiKey,
    libraries: libraries as Libraries
  });

  if (loadError)
    return <p>Encountered error while loading google maps</p>;

  if (!scriptLoaded)
    return (
      <div
        className='grid w-full place-content-center'
        style={{ minHeight: 'calc(100vh - 112px)' }}
      >
        <Spin size='large' />
      </div>
    );

  // Return the children prop wrapped by this MapProvider component
  return children;
}
