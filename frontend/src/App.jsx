import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { socket } from './services/socket';
import GridMap from './components/GridMap';
import ControlPanel from './components/ControlPanel';
import { moveTowards } from './utils/movement';
import { v4 as uuidv4 } from 'uuid';

const AppContainer = styled.div`
  display: flex; height: 100vh; width: 100vw; font-family: 'Inter', sans-serif;
`;

function App() {
  const [role, setRole] = useState(null); 
  const [myId] = useState(uuidv4().slice(0, 4)); // Generate a random ID (e.g., 'a1b2')
  
  const [myLoc, setMyLoc] = useState(null);       // My current location
  const [targetLoc, setTargetLoc] = useState(null); // Where am I going? (Rider Loc)
  const [drivers, setDrivers] = useState({});     // All drivers on map
  
  // Rider specific state
  const [status, setStatus] = useState('IDLE');   // IDLE, REQUESTING, ON_TRIP

  useEffect(() => {
    socket.connect();

    // 1. Listen for ANY driver moving (Visualization)
    socket.on('driver_moved', (data) => {
      // Update the drivers list, replacing the specific driver who moved
      setDrivers(prev => ({ ...prev, [data.id]: data }));
    });

    // 2. Listen for "Nearby Drivers" result (For Rider)
    socket.on('nearby_drivers', (list) => {
      const driverMap = {};
      list.forEach(d => driverMap[d.id] = d);
      setDrivers(driverMap); // Overwrite map with only nearby ones
    });

    // 3. Driver: Listen for a Ride Request
    socket.on('ride_requested', ({ driverId, riderLoc }) => {
      if (myId === driverId) {
        alert("NEW RIDE REQUEST! Pickup Location set.");
        setTargetLoc(riderLoc); // Set the vector target
        setStatus('JOB_RECEIVED');
      }
    });

    return () => socket.disconnect();
  }, [myId]);

  // --- ACTIONS ---

  const handleSetLocation = (loc) => {
    setMyLoc(loc);
    
    if (role === 'driver') {
      // Tell backend "I am here"
      socket.emit('driver_update', { id: myId, lat: loc.lat, lon: loc.lon });
    } else {
      // Tell backend "Find drivers near me"
      socket.emit('find_drivers', { lat: loc.lat, lon: loc.lon });
    }
  };

  const handleDriverClick = (driverId) => {
    if (role === 'rider') {
      const confirm = window.confirm("Request this driver?");
      if (confirm) {
        setStatus('REQUESTING');
        // Tell the specific driver to come to me
        socket.emit('request_ride', { 
          driverId, 
          riderLoc: myLoc 
        });
      }
    }
  };

  const handleDrive = () => {
    if (!myLoc) return;

    let newLoc;

    if (targetLoc) {
      // VECTOR MATH: Move towards the passenger
      newLoc = moveTowards(myLoc, targetLoc);
      
      // Check if arrived
      if (newLoc.lat === targetLoc.lat && newLoc.lon === targetLoc.lon) {
        alert("ARRIVED AT PASSENGER!");
        setTargetLoc(null); // Trip done (for demo)
        setStatus('IDLE');
      }
    } else {
      // Default: Just wander south if no job
      newLoc = { ...myLoc, lat: myLoc.lat - 0.002 };
    }

    setMyLoc(newLoc);
    
    // UPDATE BACKEND so the Rider sees me move
    socket.emit('driver_update', { id: myId, lat: newLoc.lat, lon: newLoc.lon });
  };

  return (
    <AppContainer>
      <ControlPanel 
        role={role} 
        setRole={setRole} 
        setLocation={handleSetLocation} 
        myLoc={myLoc}
        onDrive={handleDrive}
        status={status}
        hasTarget={!!targetLoc}
      />
      <GridMap 
        role={role} 
        myLoc={myLoc} 
        drivers={Object.values(drivers)} // Convert Map to Array
        onDriverClick={handleDriverClick}
         destination={targetLoc}
      />
      
    </AppContainer>
  );
}

export default App;