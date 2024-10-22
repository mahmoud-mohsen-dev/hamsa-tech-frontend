'use client';

import { mapOptions } from '@/lib/MapProvider';
import MarkerWithInfoWindow from '@/components/UI/map/MarkerWithInfoWindow';
//Map component Component from library
import { GoogleMap, Marker } from '@react-google-maps/api';
import ChangeMapStyle from './map/ChangeMapStyle';
import { useEffect, useRef, useState } from 'react';
import OpenMapInNewWindow from './map/OpenMapInNewWindow';

//Map's styling
export const defaultMapContainerStyle = {
  width: '100%',
  // maxWidth: '350px',
  height: '280px',
  // maxHeight: '200px',
  borderRadius: '15px'
};

// const defaultMapCenter = {
//   lat: 30.045832668653425,
//   lng: 31.23879151697493
// };

const defaultMapOptions = {
  zoomControl: true,
  controlSize: 26,
  tilt: 0,
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  // mapTypeId: 'satellite'
  // gestureHandling: 'auto',
  gestureHandling: 'greedy',
  styles: mapOptions.mapTheme
  // disableDefaultUI: true
};

const MapType = {
  roadmap: 'roadmap',
  satellite: 'satellite',
  hybrid: 'hybrid',
  terrain: 'terrain'
};

const MapComponent = ({
  lat,
  lng,
  zoom,
  branchName,
  address
}: {
  lat: number;
  lng: number;
  zoom: number;
  branchName: string;
  address: string;
}) => {
  const [changeMyTypeID, setToggleChangeMyTypeID] = useState(1);
  const mapRef = useRef<null | google.maps.Map>(null);

  const onMapLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
  };

  const handleMapToggle = () => {
    if (changeMyTypeID === 0) {
      setToggleChangeMyTypeID(1);
    } else if (changeMyTypeID === 1) {
      setToggleChangeMyTypeID(2);
    } else if (changeMyTypeID === 2) {
      setToggleChangeMyTypeID(3);
    } else if (changeMyTypeID === 3) {
      setToggleChangeMyTypeID(1);
    }
    // else if (changeMyTypeID === 4) {
    //   setToggleChangeMyTypeID(1);
    // }
    else {
      setToggleChangeMyTypeID(1);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      if (changeMyTypeID === 1) {
        mapRef.current.setMapTypeId(MapType.roadmap);
      } else if (changeMyTypeID === 2) {
        mapRef.current.setMapTypeId(MapType.satellite);
      } else if (changeMyTypeID === 3) {
        mapRef.current.setMapTypeId(MapType.hybrid);
      }
      //  else if (changeMyTypeID === 4) {
      //   mapRef.current.setMapTypeId(MapType.terrain);
      // }
    }
  }, [changeMyTypeID]);

  return (
    <div className='relative w-full'>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={{
          lat,
          lng
        }}
        zoom={zoom}
        options={defaultMapOptions}
        onLoad={onMapLoad}
      >
        <OpenMapInNewWindow
          branchName={branchName}
          lat={lat}
          lng={lng}
        />
        {/* <Marker
          position={{
            lat,
            lng
          }}
          icon={{
            // url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            url: '/icons/pin-map-icon.png'
          }}
        /> */}
        <MarkerWithInfoWindow
          title={branchName}
          body={address}
          lat={lat}
          lng={lng}
        />
        <ChangeMapStyle handleToggle={handleMapToggle} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
