import React, { useState } from 'react';
import type { ICategory } from '../../types/category';
import CategoryCard from './CategoryCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from '../../hooks/useAxios';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import CategoryForm from './CategoryForm';
import { uploadImage } from '../../utils/uploadImage';

interface CategoryItemProps {
  initialValues: ICategory;
  mutate?: () => void;
  onDelete?: () => void;
}
const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'ชื่อประเภทต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(100, 'ชื่อประเภทต้องไม่เกิน 100 ตัวอักษร')
    .required('กรุณากรอกชื่อประเภท'),
  description: Yup.string()
    .min(4, 'รายละเอียดต้องมีอย่างน้อย 4 ตัวอักษร')
    .max(1000, 'รายละเอียดต้องไม่เกิน 1000 ตัวอักษร')
    .required('กรุณากรอกรายละเอียด'),
  imageUrl: Yup.string().url('URL ไม่ถูกต้อง').required('กรุณากรอก URL รูปภาพ'),
  isOpen: Yup.boolean().required('กรุณาระบุสถานะการเปิดใช้งาน'),
  imagesWarningUrl: Yup.array()
    .of(Yup.string().url('URL ไม่ถูกต้อง'))
    .optional()
    .default([]),
  sortOrder: Yup.number().required('กรุณาระบุลำดับการแสดงผล'),
});

const CategoryItem: React.FC<CategoryItemProps> = ({
  initialValues,
  mutate,
  onDelete,
}) => {
  const isUpdate = onDelete ? false : true;
  const [selected, setSelected] = useState<boolean>(isUpdate ? false : true);
  const [isEdit, setIsEdit] = useState<boolean>(isUpdate ? false : true);

  const categoryForm = useFormik<ICategory>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.request({
          method: isUpdate ? 'patch' : 'post',
          url: isUpdate
            ? `/categories/${initialValues._id}`
            : '/categories/create',
          data: values,
        });
        if (mutate) mutate();
        Swal.fire('Success', 'Category updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  return (
    <div>
      <CategoryCard
        preview={!isUpdate}
        data={categoryForm.values}
        isEdit={isEdit}
        onClickImage={async () => {
          const url = await uploadImage('common');
          categoryForm.setFieldValue('imageUrl', url);
        }}
        onClickCard={() => {
          setSelected((prev) => !prev);
          setIsEdit(false);
        }}
        onClickChangeStatus={async () => {
          if (isUpdate) {
            const isCurrentlyOpen = categoryForm.values.isOpen;
            const result = await Swal.fire({
              title: `ยืนยันการ${isCurrentlyOpen ? 'ปิด' : 'เปิด'}หมวดหมู่?`,
              text: `คุณแน่ใจว่าต้องการ${isCurrentlyOpen ? 'ปิด' : 'เปิด'}ใช้งานหมวดหมู่นี้?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: isCurrentlyOpen ? '#FE5C73' : '#3085d6',
              cancelButtonColor: '#aaa',
              confirmButtonText: isCurrentlyOpen ? 'ปิด' : 'เปิด',
              cancelButtonText: 'ยกเลิก',
            });

            if (result.isConfirmed) {
              try {
                await axiosInstance.patch(`/categories/${initialValues._id}`, {
                  ...categoryForm.values,
                  isOpen: !isCurrentlyOpen,
                });
                if (mutate) mutate();

                Swal.fire(
                  'สำเร็จ!',
                  `${isCurrentlyOpen ? 'ปิด' : 'เปิด'}ใช้งานหมวดหมู่เรียบร้อยแล้ว`,
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
            categoryForm.setFieldValue('isOpen', !categoryForm.values.isOpen);
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
        {selected && isEdit && <CategoryForm categoryForm={categoryForm} />}
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
                  await categoryForm.submitForm();
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
                  text: 'คุณแน่ใจว่าต้องการลบหมวดหมู่นี้?',
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
                        `/categories/${initialValues._id}`,
                      );
                      if (mutate) mutate();
                    } else {
                      if (onDelete) onDelete();
                    }
                    Swal.fire('Deleted!', 'ลบหมวดหมู่สำเร็จ', 'success');
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

export default CategoryItem;
