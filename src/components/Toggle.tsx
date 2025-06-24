import React from 'react';

interface ToggleProps {
  status: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Toggle: React.FC<ToggleProps> = ({ status, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '50px',
        height: '26px',
        borderRadius: '50px',
        backgroundColor: status ? '#16DBCC' : '#DFEAF2',
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          top: '2px',
          left: status ? '26px' : '2px',
          transition: 'left 0.3s ease',
        }}
      />
    </div>
  );
};

export default Toggle;
