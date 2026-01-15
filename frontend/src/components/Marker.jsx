import React from 'react';
import styled from 'styled-components';
import { Car, User, MapPin } from 'lucide-react';

const Wrapper = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transform: translate(-50%, -50%); /* Center the icon on the point */
  transition: all 0.5s ease-in-out; /* Smooth movement animation */
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconBox = styled.div`
  background: ${props => props.color};
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 2px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.span`
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-top: 4px;
  white-space: nowrap;
`;

const Marker = ({ x, y, type, label }) => {
  let icon;
  let color;

  if (type === 'driver') {
    icon = <Car size={16} color="white" />;
    color = '#2563eb'; // Blue
  } else if (type === 'rider') {
    icon = <User size={16} color="white" />;
    color = '#16a34a'; // Green
  } else if (type === 'destination') {
    icon = <MapPin size={16} color="white" />;
    color = '#dc2626'; // Red
  }

  return (
    <Wrapper x={x} y={y}>
      <IconBox color={color}>{icon}</IconBox>
      {label && <Label>{label}</Label>}
    </Wrapper>
  );
};

export default Marker;