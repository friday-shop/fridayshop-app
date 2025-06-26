import React from 'react';
import truncateText from '../../utils/truncateText';
import type { IProvider } from '../../types/provider';
import unknownImage from '../../assets/images/unknown.png';
import Toggle from '../Toggle';
import type { FormikErrors } from 'formik';

interface ProviderCardProps {
  data: IProvider;
  isEdit: boolean;
  onClickCard: () => void;
  onClickChangeStatus: () => void;
  errors?: FormikErrors<IProvider>;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  data,
  isEdit,
  onClickCard,
  onClickChangeStatus,
  errors,
}) => {
  const { name, imageUrl } = data;

  return (
    <div
      className={`card border-0 ${isEdit ? 'rounded-top-4' : 'rounded-4'} overflow-hidden w-100 bg-white p-2 d-flex flex-row justify-content-between align-items-start gap-3`}
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
      onClick={onClickCard}
    >
      <div className="d-flex flex-row justify-content-start align-items-center gap-3">
        <img
          src={imageUrl || unknownImage}
          alt={name}
          onError={(error) => {
            error.currentTarget.onerror = null;
            error.currentTarget.src = unknownImage;
          }}
          className="rounded-4"
          style={{ height: '73px', width: '73px', objectFit: 'cover' }}
        />
        <div className="text-primary">
          <h5 className="card-title fw-bolder">{name}</h5>
          <div className="d-flex flex-row align-items-center gap-2">
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor:
                  errors && Object.keys(errors).length > 0
                    ? '#FE5C73'
                    : '#16DBCC',
              }}
            />
            <p
              className="mb-0"
              style={{
                color:
                  errors && Object.keys(errors).length > 0
                    ? '#FE5C73'
                    : '#16DBCC',
              }}
            >
              {errors && Object.keys(errors).length > 0
                ? `กรุณากรอกข้อมูล: ${Object.keys(errors)
                    .map((key) => key)
                    .join(', ')}`
                : truncateText('พร้อมใช้งาน', 75)}
            </p>
          </div>
        </div>
      </div>
      <Toggle
        status={data.isOpen}
        onClick={(event) => {
          event.stopPropagation();
          onClickChangeStatus();
        }}
      />
    </div>
  );
};

export default ProviderCard;
