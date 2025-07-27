import React from 'react';
import unknownImage from '../../assets/images/unknown.png';
import Toggle from '../Toggle';
import type { IProductItem } from '../../types/product-item';

interface ProductItemCardProps {
  data: IProductItem;
  isEdit: boolean;
  onClickImage: () => void;
  onClickCard: () => void;
  onClickChangeStatus: () => void;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  data,
  isEdit,
  onClickImage,
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
          onClick={(event) => {
            if (!isEdit) return;
            event.stopPropagation();
            onClickImage();
          }}
          src={imageUrl || unknownImage}
          alt={name}
          onError={(error) => {
            error.currentTarget.onerror = null;
            error.currentTarget.src = unknownImage;
          }}
          className="card-img-top"
          style={{
            height: '160px',
            objectFit: 'cover',
            cursor: isEdit ? 'pointer' : 'default',
            filter: isEdit ? 'brightness(0.7)' : 'none',
            transition: 'filter 0.2s ease-in-out',
          }}
        />
        {isEdit && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 'bold',
              pointerEvents: 'none',
            }}
          >
            แก้ไขรูป
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <p className="card-title fw-bolder text-white mb-0">
              ลำดับ {data.sortOrder}
            </p>
          </div>
        </div>
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

export default ProductItemCard;
