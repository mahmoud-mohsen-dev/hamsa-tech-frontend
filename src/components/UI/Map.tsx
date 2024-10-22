'use client';

//Map component Component from library
import { GoogleMap, Marker } from '@react-google-maps/api';

//Map's styling
export const defaultMapContainerStyle = {
  maxWidth: '500px',
  width: '100%',
  height: '50vh',
  maxHeight: '300px',
  borderRadius: '15px'
};

// const defaultMapCenter = {
//   lat: 30.045832668653425,
//   lng: 31.23879151697493
// };

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  // gestureHandling: 'auto',
  // mapTypeId: 'satellite'
  // mapTypeId: 'terrian',
  gestureHandling: 'greedy',
  disableDefaultUI: true
};

const MapComponent = ({
  lat,
  lng,
  zoom
}: {
  lat: number;
  lng: number;
  zoom: number;
}) => {
  return (
    <div className='w-full'>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={{
          lat,
          lng
        }}
        zoom={zoom}
        options={defaultMapOptions}
      >
        <Marker
          position={{
            lat,
            lng
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
