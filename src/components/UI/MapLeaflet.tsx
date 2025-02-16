'use client';
import { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer
} from 'react-leaflet';
import { Icon } from 'leaflet';
import OpenMapInNewWindow from './map/OpenMapInNewWindow';

const hamsaIcon = new Icon({
  iconUrl: '/icons/pin-map-icon.png', // Path to the custom marker
  iconSize: [34, 48], // [width, height] in pixels
  iconAnchor: [17, 48], // Center-bottom anchor (half width, full height)
  popupAnchor: [0, -48], // Popup opens above the marker
  shadowUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC', // Optional: Add shadow effect
  shadowSize: [41, 41], // Adjust based on the shadow image size
  shadowAnchor: [17, 41], // Align shadow with the icon
  iconRetinaUrl: '/icons/pin-map-icon.png', // Retina display support
  tooltipAnchor: [0, -35] // Position tooltips above the marker
});

const defaultIcon = new Icon({
  iconUrl: '/icons/blue-marker.png',
  iconSize: [25, 41],
  shadowUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC',
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  popupAnchor: [1, -34],
  shadowAnchor: [12, 41],
  iconRetinaUrl: '/icons/blue-marker.png',
  tooltipAnchor: [0, 0]
});

function MapLeaflet({
  position = { lat: 30.033333, lng: 31.233334 }, // [latitude, longitude]
  // position = [31.233334,30.033333], // [latitude, longitude]
  zoom = 13,
  scrollWheelZoom = false,
  branchName = ''
}: {
  position?: LatLngLiteral;
  zoom?: number;
  scrollWheelZoom?: boolean;
  branchName?: string;
}) {
  return (
    <div className='h-[280px] overflow-hidden rounded-md border border-gray-300 shadow-featured'>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        className='z-10 h-full w-full'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          // url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          // url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          // url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' //4
          // url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png' //3
          // url='http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' //2
          // url='http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}' //1
        />

        <Marker position={position} icon={hamsaIcon}>
          <Popup>{branchName}</Popup>
        </Marker>
        <OpenMapInNewWindow
          branchName={branchName}
          lat={position.lat}
          lng={position.lng}
        />
      </MapContainer>
    </div>
  );
}

export default MapLeaflet;
