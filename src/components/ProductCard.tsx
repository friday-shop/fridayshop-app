import React, { useState } from 'react';
import type { IProductResponse } from '../types/product';
import unknownImage from '../assets/images/unknown.png';
import Toggle from './Toggle';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../hooks/useAxios';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';

interface ProductCardProps {
  preview?: boolean;
  data: IProductResponse;
  mutate?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  mutate,
  preview = false,
}) => {
  const { name, purchasable, imageUrl } = data;
  const [selected, setSelected] = useState<boolean>();
  const navigate = useNavigate();

  const onUpdate = () => {
    mutate?.();
  };

  const handleChangeStatus = async () => {
    try {
      await axiosInstance.patch(`/products/${data._id}`, {
        ...data,
        isOpen: !data.isOpen,
      });
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'เปลี่ยนสถานะสินค้าสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
      onUpdate();
    } catch (error) {
      const errorAxios = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text:
          errorAxios.response?.data?.message ||
          'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/products/${data._id}`);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'ลบข้อมูลสินค้าสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
      onUpdate();
    } catch (error) {
      const errorAxios = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text:
          errorAxios.response?.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div>
      <div
        className="card border-0 rounded-4 overflow-hidden w-100 bg-white"
        style={{
          boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
        }}
        onClick={() => {
          setSelected(!selected);
        }}
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
          {!preview && (
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
              <Toggle
                status={data.isOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  handleChangeStatus();
                }}
              />
            </div>
          )}
        </div>
        <div className="card-body text-primary">
          <h5 className="card-title fw-bolder">{name}</h5>
          <p className="card-text text-muted">
            ราคา {data.price} บาท <br />
            สินค้าคงเหลือ {!preview ? purchasable : 0} ชิ้น
          </p>
          <button
            className="btn fw-bold rounded px-4 border-0 w-100"
            style={{ backgroundColor: '#876DFD', color: 'white' }}
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/product/${data._id}`);
            }}
          >
            ซื้อสินค้า
          </button>
        </div>
      </div>
      <div
        className={`animated-buttons ${selected ? 'slide-down' : ''}`}
        style={{
          maxHeight: selected ? '100px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        {selected && (
          <div className="d-flex justify-content-between px-3 gap-4 align-content-center">
            <button
              className="rounded-bottom-4 border-0 fw-bold"
              style={{
                backgroundColor: '#FE5C73',
                height: '5vh',
                width: '100%',
                color: 'white',
              }}
              onClick={handleDelete}
            >
              ลบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
