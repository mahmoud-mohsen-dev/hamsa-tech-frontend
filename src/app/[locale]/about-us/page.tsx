import Map from '@/components/UI/Map';
import { MapProvider } from '@/lib/MapProvider';

function AboutUsPage() {
  return (
    <div>
      <MapProvider>
        <Map />
      </MapProvider>
    </div>
  );
}

export default AboutUsPage;
