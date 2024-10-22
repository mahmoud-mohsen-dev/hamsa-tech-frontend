import { InfoWindow, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

const MarkerWithInfoWindow = ({
  lat,
  lng,
  title,
  body
}: {
  lat: number;
  lng: number;

  title: string;
  body: string;
}) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Function to set the header text
  const onLoad = (infoWindow: google.maps.InfoWindow) => {
    infoWindow.setHeaderContent(title);
  };

  return (
    <>
      <Marker
        onClick={() => setInfoWindowOpen(true)}
        position={{
          lat,
          lng
        }}
        icon={{
          url: '/icons/pin-map-icon.png'
        }}
      />
      {infoWindowOpen && (
        <InfoWindow
          position={{ lat, lng }}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
            disableAutoPan: true // Prevent map from auto-panning when opening InfoWindow
          }}
          onCloseClick={() => setInfoWindowOpen(false)}
          onLoad={onLoad} // Call the onLoad function when InfoWindow loads
        >
          <div style={{ maxWidth: '200px' }}>
            <div>{body}</div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MarkerWithInfoWindow;
