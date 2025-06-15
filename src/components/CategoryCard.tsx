import React from 'react';
import truncateText from '../utils/truncateText';

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <div>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden w-100 bg-white">
        <img
          src={imageUrl}
          alt={title}
          className="card-img-top"
          style={{ height: '160px', objectFit: 'cover' }}
        />
        <div className="card-body text-primary">
          <h5 className="card-title fw-bolder">{title}</h5>
          <p className="card-text text-muted">
            {truncateText(description, 75)}
          </p>
          <button
            className="btn fw-bold rounded px-4 border-0 w-100"
            style={{ backgroundColor: '#876DFD', color: 'white' }}
            onClick={onClick}
          >
            ดูรายการสินค้า
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between px-3 gap-4 align-content-center">
        <div
          className="rounded-bottom-4"
          style={{ backgroundColor: '#FFBB38', height: '5vh', width: '50%' }}
        ></div>
        <div
          className="rounded-bottom-4"
          style={{ backgroundColor: '#FE5C73', height: '5vh', width: '50%' }}
        ></div>
      </div>
      <div className="d-flex justify-content-around px-3 gap-4 align-content-center">
        <div
          className="rounded-bottom-4"
          style={{ backgroundColor: '#16DBCC', height: '5vh', width: '65%' }}
        ></div>
        <div
          className="rounded-bottom-4"
          style={{ backgroundColor: '#FE5C73', height: '5vh', width: '35%' }}
        ></div>
      </div>
    </div>
  );
};

export default CategoryCard;
