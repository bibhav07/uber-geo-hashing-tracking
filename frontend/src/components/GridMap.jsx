import React from 'react';
import styled from 'styled-components';
import Marker from './Marker';
import { getPosition } from '../utils/mapHelpers';

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  background-color: #1a1a1a;
  overflow: hidden;
  background-image: 
    linear-gradient(#333 1px, transparent 1px),
    linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 80px 80px; 
`;

const GridLabel = styled.div`
  position: absolute; top: 10px; right: 10px; color: #666; font-family: monospace;
`;

// ADD 'destination' to props
const GridMap = ({ myLoc, role, drivers, onDriverClick, destination }) => {
  return (
    <MapContainer>
      <GridLabel>Geohash Grid (Precision 6)</GridLabel>

      {/* 1. Render Myself */}
      {myLoc && (
        <Marker 
          {...getPosition(myLoc.lat, myLoc.lon)} 
          type={role} 
          label="You" 
        />
      )}

      {/* 2. Render The Destination (The Rider) - ONLY FOR DRIVER */}
      {destination && (
        <Marker 
          {...getPosition(destination.lat, destination.lon)} 
          type="destination" // Use the 'destination' type we defined earlier (Red Pin)
          label="Rider" 
        />
      )}

      {/* 3. Render Other Drivers */}
      {drivers.map(driver => (
        <div 
          key={driver.id} 
          onClick={() => onDriverClick(driver.id)}
          style={{cursor: 'pointer'}}
        >
          <Marker
            {...getPosition(driver.lat, driver.lon)}
            type="driver"
            label={`Driver ${driver.id.substr(0,4)}`}
          />
        </div>
      ))}
    </MapContainer>
  );
};

export default GridMap;