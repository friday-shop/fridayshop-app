import { useEffect, useState } from 'react';
import LineCard from './LineCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';
import LineForm from './LineForm';
import type { ILine } from '../../../types/line';
import { axiosInstance } from '../../../hooks/useAxios';

const validationSchema = Yup.object({
  channelSecret: Yup.string().required('กรุณากรอก Channel Secret'),
  channelAccessToken: Yup.string().required('กรุณากรอก Channel Access Token'),
  freePurchaseUserIds: Yup.array().of(Yup.string()).optional().default([]),
  pointsImageUrl: Yup.array().of(Yup.string()).optional().default([]),
});

const LineItem = () => {
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    const fetchLineData = async () => {
      try {
        const response = await axiosInstance.get<ILine>('/line');
        lineForm.setValues(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire(
          'Error',
          axiosError.message || 'ไม่สามารถโหลดข้อมูลได้',
          'error',
        );
      }
    };

    fetchLineData();
  }, []);

  const lineForm = useFormik<ILine>({
    enableReinitialize: true,
    initialValues: {
      channelSecret: '',
      channelAccessToken: '',
      freePurchaseUserIds: [],
      pointsImageUrl: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.request({
          method: 'patch',
          url: '/line',
          data: values,
        });
        Swal.fire('Success', 'Line updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  return (
    <div>
      <LineCard
        isEdit={selected}
        onClickCard={() => {
          setSelected((prev) => !prev);
        }}
      />
      <div
        className={`animated-buttons ${selected && selected ? 'slide-down' : ''}`}
        style={{
          maxHeight: '100%',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        {selected && selected && <LineForm lineForm={lineForm} />}
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
                backgroundColor: selected ? '#16DBCC' : '#FFBB38',
                height: '5vh',
                width: '50%',
                color: 'white',
              }}
              onClick={async () => {
                if (selected) {
                  await lineForm.submitForm();
                }
                setSelected(!selected);
              }}
            >
              {selected ? 'ยืนยัน' : 'แก้ไข'}
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
                    const fetchLineData = async () => {
                      try {
                        const response =
                          await axiosInstance.get<ILine>('/line');
                        lineForm.setValues(response.data);
                      } catch (error) {
                        const axiosError = error as AxiosError;
                        Swal.fire(
                          'Error',
                          axiosError.message || 'ไม่สามารถโหลดข้อมูลได้',
                          'error',
                        );
                      }
                    };

                    fetchLineData();
                    Swal.fire(
                      'สำเร็จ',
                      'ยกเลิกการแก้ไขเรียบร้อยแล้ว',
                      'success',
                    );
                  } catch (error) {
                    const axiosError = error as AxiosError;
                    Swal.fire(
                      'Error',
                      axiosError.message || 'ยกเลิกการแก้ไขไม่สำเร็จ',
                      'error',
                    );
                  }
                }
              }}
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineItem;
