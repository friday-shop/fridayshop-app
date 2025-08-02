import React, { useState } from 'react';
import type { ILineCustomer } from '../../types/line-customer';
import LineCustomerCard from './LineCustomerCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from '../../hooks/useAxios';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import LineCustomerForm from './LineCustomerForm';

interface LineCustomerItemProps {
  initialValues: ILineCustomer;
  mutate?: () => void;
  onDelete?: () => void;
}
const validationSchema = Yup.object({
  name: Yup.string()
    .min(1, 'ชื่อประเภทต้องมีอย่างน้อย 1 ตัวอักษร')
    .required('กรุณากรอกชื่อประเภท'),
  point: Yup.number().required('กรุณาระบุแต้ม'),
  userId: Yup.string().optional(),
});

const LineCustomerItem: React.FC<LineCustomerItemProps> = ({
  initialValues,
  mutate,
  onDelete,
}) => {
  const isUpdate = onDelete ? false : true;
  const [selected, setSelected] = useState<boolean>(isUpdate ? false : true);
  const [isEdit, setIsEdit] = useState<boolean>(isUpdate ? false : true);

  const lineCustomerForm = useFormik<ILineCustomer>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.request({
          method: isUpdate ? 'patch' : 'post',
          url: isUpdate
            ? `/line-customers/${initialValues._id}`
            : '/line-customers/create',
          data: values,
        });
        if (mutate) mutate();
        Swal.fire('Success', 'LineCustomer updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  return (
    <div>
      <LineCustomerCard
        data={lineCustomerForm.values}
        isEdit={isEdit}
        onClickCard={() => {
          setSelected((prev) => !prev);
          setIsEdit(false);
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
          <LineCustomerForm lineCustomerForm={lineCustomerForm} />
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
                width: '100%',
                color: 'white',
              }}
              onClick={async () => {
                if (isEdit) {
                  await lineCustomerForm.submitForm();
                }
                setIsEdit(!isEdit);
              }}
            >
              {isEdit ? 'ยืนยัน' : 'แก้ไข'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineCustomerItem;
