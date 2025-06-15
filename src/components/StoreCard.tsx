import React from 'react';
import truncateText from '../utils/truncateText';
import Toggle from './Toggle';

interface StoreCardProps {
  title: string;
  description: string;
  imageUrl: string;
  status: boolean;
  id: string;
}

const StoreCard: React.FC<StoreCardProps> = ({
  title,
  description,
  imageUrl,
  status,
  id,
}) => {
  const [toggle, setToggle] = React.useState(true);
  return (
    <div
      className="card border-0 rounded-4 overflow-hidden w-100 bg-white p-2 d-flex flex-row justify-content-between align-items-start gap-3"
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="d-flex flex-row justify-content-start align-items-center gap-3">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-4"
          style={{ height: '73px', width: '73px', objectFit: 'cover' }}
        />
        <div className="text-primary">
          <h5 className="card-title fw-bolder">{title}</h5>
          <div className="d-flex flex-row align-items-center gap-2">
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#16DBCC',
              }}
            />
            <p
              className="mb-0"
              style={{
                color: '#16DBCC',
              }}
            >
              {truncateText(description, 75)}
            </p>
          </div>
        </div>
      </div>
      <Toggle status={toggle} onClick={() => setToggle(!toggle)} />
    </div>
  );
};

export default StoreCard;
