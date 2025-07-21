import React from 'react';
import lineImage from '../../../assets/images/line-logo.png';

interface LineCardProps {
  isEdit: boolean;
  onClickCard: () => void;
}

const LineCard: React.FC<LineCardProps> = ({ isEdit, onClickCard }) => {
  return (
    <div
      className={`card border-0 ${isEdit ? 'rounded-top-4' : 'rounded-4'} overflow-hidden w-100 bg-white`}
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
      onClick={onClickCard}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={lineImage}
          alt={'Line Logo'}
          className="card-img-top"
          style={{
            height: '160px',
            objectFit: 'contain',
          }}
        />
      </div>
      <div className="card-body text-primary">
        <h5 className="card-title fw-bolder">LINE</h5>
      </div>
    </div>
  );
};

export default LineCard;
