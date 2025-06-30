import React, { useState, useCallback } from 'react';
import type { IProvider } from '../../types/provider';
import unknownImage from '../../assets/images/unknown.png';
import Toggle from '../Toggle';
import type { useFormik } from 'formik';
import { BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { axiosInstance } from '../../hooks/useAxios';

interface ProviderCardProps {
  isEdit: boolean;
  onClickCard: () => void;
  onClickChangeStatus: () => void;
  providerForm: ReturnType<typeof useFormik<IProvider>>;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  providerForm,
  isEdit,
  onClickCard,
  onClickChangeStatus,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const { name, imageUrl, verify, isOpen, point, marker } = providerForm.values;
  const { errors } = providerForm;

  // Memoized validation check
  const hasErrors = Boolean(errors && Object.keys(errors).length > 0);
  const errorFields = hasErrors ? Object.keys(errors) : [];

  const handleCheckProvider = useCallback(async () => {
    const { url, name, cookie, subDomain } = providerForm.values;

    // Validate required fields
    const requiredFields = { url, name, cookie, subDomain };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: `กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการยืนยัน: ${missingFields.join(', ')}`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsChecking(true);

    try {
      const response = await axiosInstance.post<IProvider>(
        '/providers/check-provider',
        { url, name, cookie, subDomain },
      );

      const data = response.data;
      providerForm.setFieldValue('verify', Boolean(data.verify));

      // Success feedback
      if (data.verify) {
        await Swal.fire({
          icon: 'success',
          title: 'ยืนยันสำเร็จ',
          text: 'ข้อมูลผู้ให้บริการได้รับการยืนยันแล้ว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error checking provider:', error);

      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยืนยันข้อมูลผู้ให้บริการได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsChecking(false);
    }
  }, [providerForm]);

  const handleImageError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const target = event.currentTarget;
      target.onerror = null;
      target.src = unknownImage;
    },
    [],
  );

  const getStatusInfo = () => {
    if (hasErrors) {
      return {
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        text: `กรุณากรอกข้อมูล: ${errorFields.join(', ')}`,
        icon: <BsExclamationTriangleFill className="text-red-500" size={16} />,
      };
    }

    if (verify) {
      return {
        color: '#10b981',
        bgColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        text: 'พร้อมใช้งาน',
        icon: <BsCheckCircleFill style={{ color: '#10b981' }} size={16} />,
      };
    }

    return {
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fed7aa',
      text: 'ไม่สามารถใช้งาน cookie ได้',
      icon: <BsExclamationTriangleFill className="text-yellow-500" size={16} />,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`position-relative overflow-hidden bg-white ${
        isEdit ? 'rounded-top-4' : 'rounded-4'
      } transition-all duration-300 hover:shadow-lg cursor-pointer`}
      style={{
        boxShadow: '0 4px 20px rgba(139, 69, 219, 0.1)',
        border: '1px solid rgba(139, 69, 219, 0.1)',
        transition: 'all 0.3s ease',
      }}
      onClick={onClickCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 69, 219, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 69, 219, 0.1)';
      }}
    >
      {/* Status indicator stripe */}
      <div
        className="position-absolute top-0 start-0 w-100"
        style={{
          height: '4px',
          background: `linear-gradient(90deg, ${statusInfo.color}, ${statusInfo.color}90)`,
        }}
      />

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          {/* Left side - Provider info */}
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <div className="position-relative">
              <img
                src={imageUrl || unknownImage}
                alt={name || 'Provider'}
                onError={handleImageError}
                className="rounded-4"
                style={{
                  height: '73px',
                  width: '73px',
                  objectFit: 'cover',
                }}
              />
              {/* Verification badge */}
              {verify && (
                <div
                  className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    bottom: '-4px',
                    right: '-4px',
                    border: '2px solid white',
                  }}
                >
                  <BsCheckCircleFill size={12} color="white" />
                </div>
              )}
            </div>

            <div className="flex-grow-1">
              <h5 className="fw-bold text-dark mb-1 lh-sm">
                {name || 'ไม่ระบุชื่อ'} ({marker})
              </h5>

              <p className="text-muted mb-2 fw-medium">
                <span className="fs-6">{point || 0}</span>
                <span className="fs-7 ms-1">บาท</span>
              </p>

              {/* Status indicator */}
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: statusInfo.bgColor,
                  border: `1px solid ${statusInfo.borderColor}`,
                  fontSize: '0.85rem',
                }}
              >
                {statusInfo.icon}
                <span style={{ color: statusInfo.color, fontWeight: '500' }}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="d-flex flex-column align-items-end gap-3 ms-3">
            <Toggle
              status={isOpen}
              onClick={(event) => {
                event.stopPropagation();
                onClickChangeStatus();
              }}
            />

            <button
              type="button"
              className="btn btn-link p-0 border-0 bg-transparent position-relative"
              onClick={(e) => {
                e.stopPropagation();
                handleCheckProvider();
              }}
              disabled={isChecking}
              style={{
                transition: 'all 0.2s ease',
                transform: isChecking ? 'scale(0.95)' : 'scale(1)',
              }}
              title={verify ? 'ยืนยันแล้ว' : 'คลิกเพื่อยืนยัน'}
            >
              {isChecking ? (
                <div
                  className="spinner-border spinner-border-sm"
                  style={{ width: '28px', height: '28px', color: '#6366f1' }}
                />
              ) : (
                <BsCheckCircleFill
                  size={28}
                  color={verify ? '#10b981' : '#d1d5db'}
                  style={{
                    filter: verify
                      ? 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
                      : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
