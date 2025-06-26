import React, { useState } from 'react';
import type { IProduct } from '../../types/product';
import ProductCard from './ProductCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from '../../hooks/useAxios';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import ProductForm from './ProductForm';
import ProductProviderForm from './ProductProviderForm/ProductProviderForm';

interface ProductItemProps {
  initialValues: IProduct;
  mutate?: () => void;
  onDelete?: () => void;
}
const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'ชื่อสินค้าต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(100, 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร')
    .required('กรุณากรอกชื่อสินค้า'),
  price: Yup.number().typeError('ราคาต้องเป็นตัวเลข').required('กรุณากรอกราคา'),
  expirationDays: Yup.number()
    .typeError('วันหมดอายุต้องเป็นตัวเลข')
    .required('กรุณากรอกวันหมดอายุ'),
  imageUrl: Yup.string().url('URL ไม่ถูกต้อง').notRequired(),
  providers: Yup.array().of(
    Yup.object({
      providerId: Yup.string().required('กรุณากรอก Provider ID'),
      id: Yup.string().required('กรุณากรอก ID'),
      isOpen: Yup.boolean().required('กรุณาระบุ isOpen'),
      name: Yup.string().required('กรุณาระบุชื่อสินค้า'),
      price: Yup.number().min(0, 'ราคาต้องไม่ติดลบ').required('กรุณาระบุราคา'),
    }),
  ),
  isOpen: Yup.boolean().required('กรุณาระบุสถานะการเปิดใช้งาน'),
});

const ProductItem: React.FC<ProductItemProps> = ({
  initialValues,
  mutate,
  onDelete,
}) => {
  const isUpdate = onDelete ? false : true;
  const [selected, setSelected] = useState<boolean>(isUpdate ? false : true);
  const [isEdit, setIsEdit] = useState<boolean>(isUpdate ? false : true);

  const productForm = useFormik<IProduct>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.request({
          method: isUpdate ? 'patch' : 'post',
          url: isUpdate ? `/products/${initialValues._id}` : '/products/create',
          data: values,
        });
        if (mutate) mutate();
        Swal.fire('Success', 'Product updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  return (
    <div>
      <ProductCard
        data={productForm.values}
        isEdit={isEdit}
        onClickCard={() => {
          setSelected((prev) => !prev);
          setIsEdit(false);
        }}
        onClickChangeStatus={async () => {
          if (isUpdate) {
            const isCurrentlyOpen = productForm.values.isOpen;
            const result = await Swal.fire({
              title: `ยืนยันการ${isCurrentlyOpen ? 'ปิด' : 'เปิด'}สินค้า?`,
              text: `คุณแน่ใจว่าต้องการ${isCurrentlyOpen ? 'ปิด' : 'เปิด'}ใช้งานสินค้านี้?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: isCurrentlyOpen ? '#FE5C73' : '#3085d6',
              cancelButtonColor: '#aaa',
              confirmButtonText: isCurrentlyOpen ? 'ปิด' : 'เปิด',
              cancelButtonText: 'ยกเลิก',
            });

            if (result.isConfirmed) {
              try {
                await axiosInstance.patch(`/products/${initialValues._id}`, {
                  ...productForm.values,
                  isOpen: !isCurrentlyOpen,
                });
                if (mutate) mutate();

                Swal.fire(
                  'สำเร็จ!',
                  `${isCurrentlyOpen ? 'ปิด' : 'เปิด'}ใช้งานสินค้าเรียบร้อยแล้ว`,
                  'success',
                );
              } catch (error) {
                const axiosError = error as AxiosError;
                Swal.fire(
                  'เกิดข้อผิดพลาด',
                  axiosError.message || 'ไม่สามารถเปลี่ยนสถานะได้',
                  'error',
                );
              }
            }
          } else {
            productForm.setFieldValue('isOpen', !productForm.values.isOpen);
          }
        }}
      />
      <div
        className={`animated-buttons ${selected && isEdit ? 'slide-down' : ''}`}
        style={{
          maxHeight: selected && isEdit ? '100%' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        {selected && isEdit && (
          <>
            <ProductForm productForm={productForm} />
            <ProductProviderForm productForm={productForm} />
          </>
        )}
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
                backgroundColor: isEdit ? '#16DBCC' : '#FFBB38',
                height: '5vh',
                width: '50%',
                color: 'white',
              }}
              onClick={async () => {
                if (isEdit) {
                  await productForm.submitForm();
                }
                setIsEdit(!isEdit);
              }}
            >
              {isEdit ? 'ยืนยัน' : 'แก้ไข'}
            </button>
            <button
              className="rounded-bottom-4 border-0 fw-bold"
              style={{
                backgroundColor: '#FE5C73',
                height: '5vh',
                width: '50%',
                color: 'white',
              }}
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'ยืนยันการลบ?',
                  text: 'คุณแน่ใจว่าต้องการลบสินค้านี้?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#FE5C73',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'ลบ',
                  cancelButtonText: 'ยกเลิก',
                });

                if (result.isConfirmed) {
                  try {
                    if (isUpdate) {
                      await axiosInstance.delete(
                        `/products/${initialValues._id}`,
                      );
                      if (mutate) mutate();
                    } else {
                      if (onDelete) onDelete();
                    }
                    Swal.fire('Deleted!', 'ลบสินค้าสำเร็จ', 'success');
                  } catch (error) {
                    const axiosError = error as AxiosError;
                    Swal.fire(
                      'Error',
                      axiosError.message || 'ไม่สามารถลบได้',
                      'error',
                    );
                  }
                }
              }}
            >
              ลบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
