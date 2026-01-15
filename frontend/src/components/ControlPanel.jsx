import React from 'react';
import styled from 'styled-components';
import { PREDEFINED_LOCATIONS } from '../utils/mapHelpers';

const Panel = styled.div`
  width: 350px; background: #222; color: white; padding: 20px;
  display: flex; flex-direction: column; border-right: 1px solid #333; z-index: 20;
`;
const Button = styled.button`
  padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;
  background: ${props => props.active ? '#3b82f6' : '#333'};
  color: ${props => props.active ? 'white' : '#aaa'};
  &:hover { background: ${props => props.active ? '#2563eb' : '#444'}; }
`;
const LocationGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;
`;
const LocButton = styled.button`
  padding: 10px; background: #333; border: 1px solid #444; color: #ccc;
  border-radius: 4px; cursor: pointer; font-size: 12px;
  &:hover { background: #3a3a3a; }
`;
const StatusBox = styled.div`
  margin-top: auto; padding: 15px; background: #111; border-radius: 8px; border: 1px solid #333;
`;

const ControlPanel = ({ role, setRole, setLocation, myLoc, onDrive, status, hasTarget }) => {
  return (
    <Panel>
      <h1 style={{fontSize:'20px', marginBottom:'5px'}}>Uber System Design</h1>
      <p style={{fontSize:'12px', color:'#888', marginBottom:'30px'}}>Geohash Partitioning Demo</p>

      {/* Role Selection */}
      <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
        <Button active={role === 'rider'} onClick={() => setRole('rider')}>Rider</Button>
        <Button active={role === 'driver'} onClick={() => setRole('driver')}>Driver</Button>
      </div>

      {/* Location Selection */}
      <h3 style={{fontSize: '14px', color: '#aaa'}}>1. Set Location</h3>
      <LocationGrid>
        {PREDEFINED_LOCATIONS.map(loc => (
          <LocButton key={loc.name} onClick={() => setLocation(loc)}>{loc.name}</LocButton>
        ))}
      </LocationGrid>

      {/* Driver Controls */}
      {role === 'driver' && myLoc && (
        <StatusBox>
          <div style={{color: '#888', fontSize: '11px', marginBottom: '5px'}}>DRIVER CONSOLE</div>
          <div style={{fontSize: '14px', marginBottom:'10px'}}>
             Status: <span style={{color: hasTarget ? '#facc15' : '#4ade80'}}>
               {hasTarget ? 'ON JOB' : 'WAITING'}
             </span>
          </div>
          
          <Button 
            active={true} 
            style={{width:'100%', background: hasTarget ? '#facc15' : '#dc2626', color: hasTarget ? '#000' : '#fff'}}
            onClick={onDrive}
          >
            {hasTarget ? 'DRIVE TO RIDER (Click Repeatedly)' : 'DRIVE AROUND'}
          </Button>
        </StatusBox>
      )}

      {/* Rider Instructions */}
      {role === 'rider' && myLoc && (
        <StatusBox>
           <div style={{color: '#888', fontSize: '11px', marginBottom: '5px'}}>RIDER CONSOLE</div>
           <p style={{fontSize:'13px'}}>
             {status === 'REQUESTING' 
               ? 'Waiting for driver...' 
               : 'Click a car on the map to request a ride.'}
           </p>
        </StatusBox>
      )}
    </Panel>
  );
};

export default ControlPanel;