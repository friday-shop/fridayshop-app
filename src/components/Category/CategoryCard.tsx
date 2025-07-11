import React from 'react';
import truncateText from '../../utils/truncateText';
import type { ICategory } from '../../types/category';
import unknownImage from '../../assets/images/unknown.png';
import Toggle from '../Toggle';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  data: ICategory;
  isEdit: boolean;
  onClickCard: () => void;
  onClickChangeStatus: () => void;
  preview?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  data,
  isEdit,
  onClickCard,
  onClickChangeStatus,
  preview = false,
}) => {
  const { _id, name, description, imageUrl } = data;
  const navigate = useNavigate();

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
          src={imageUrl || unknownImage}
          alt={name}
          onError={(error) => {
            error.currentTarget.onerror = null;
            error.currentTarget.src = unknownImage;
          }}
          className="card-img-top"
          style={{ height: '160px', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <Toggle
            status={data.isOpen}
            onClick={(event) => {
              event.stopPropagation();
              onClickChangeStatus();
            }}
          />
        </div>
      </div>
      <div className="card-body text-primary">
        <h5 className="card-title fw-bolder">{name}</h5>
        <p className="card-text text-muted">{truncateText(description, 75)}</p>
        <button
          className="btn fw-bold rounded px-4 border-0 w-100"
          style={{ backgroundColor: '#876DFD', color: 'white' }}
          onClick={(event) => {
            if (!preview) {
              event.stopPropagation();
              navigate(`/products/${_id}`);
            }
          }}
        >
          ดูรายการสินค้า
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
