import React from 'react';
import type { IProduct } from '../../types/product';
import unknownImage from '../../assets/images/unknown.png';
import Toggle from '../Toggle';

interface ProductCardProps {
  data: IProduct;
  isEdit: boolean;
  onClickCard: () => void;
  onClickChangeStatus: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  isEdit,
  onClickCard,
  onClickChangeStatus,
}) => {
  const { name, purchasable, price, imageUrl, quantity } = data;

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
        <p className="card-text text-muted">
          ราคา {price} บาท <br />
          สินค้าคงเหลือ {quantity || 0} ชิ้น
          <br />
          สามารถซื้อได้ {purchasable || 0} ชิ้น
        </p>
        <button
          className="btn fw-bold rounded px-4 border-0 w-100"
          style={{ backgroundColor: '#876DFD', color: 'white' }}
        >
          ซื้อสินค้า
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
