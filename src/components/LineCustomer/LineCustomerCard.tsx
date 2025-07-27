import React from 'react';
import type { ILineCustomer } from '../../types/line-customer';
import { FaUser, FaAward } from 'react-icons/fa';

interface LineCustomerCardProps {
  data: ILineCustomer;
  isEdit: boolean;
  onClickCard: () => void;
}

const LineCustomerCard: React.FC<LineCustomerCardProps> = ({
  data,
  isEdit,
  onClickCard,
}) => {
  const { name, point } = data;

  return (
    <div
      onClick={onClickCard}
      className={`d-flex align-items-center p-3 w-100 bg-white ${
        isEdit ? 'rounded-top-4' : 'rounded-4'
      }`}
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div
        className="d-flex justify-content-center align-items-center me-3"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#E9F5FF',
        }}
      >
        <FaUser size={24} color="#007BFF" />
      </div>
      <div className="flex-grow-1">
        <h5 className="fw-bolder mb-1" style={{ color: '#212529' }}>
          {name}
        </h5>
      </div>
      <div className="d-flex align-items-center">
        <FaAward size={20} color="#FFC107" className="me-2" />
        <span className="fw-bold fs-5" style={{ color: '#28a745' }}>
          {point}
        </span>
      </div>
    </div>
  );
};

export default LineCustomerCard;
