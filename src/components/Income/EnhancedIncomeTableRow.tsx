import React, { useState } from 'react';
import {
  Badge,
  Button,
  Image as ImageIcon,
  Modal,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import type { IIncome } from '../../types/income';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import IncomeForm from './IncomeForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from '../../hooks/useAxios';
import Swal from 'sweetalert2';
import type { AxiosError } from 'axios';

interface EnhancedIncomeTableRowProps {
  initialValues: IIncome;
  mutate: () => void;
  onDelete: () => void;
}

const validationSchema = Yup.object({
  date: Yup.date().required('กรุณาเลือกวันที่'),
  item: Yup.string()
    .min(2, 'ชื่อรายการต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อรายการต้องไม่เกิน 100 ตัวอักษร')
    .required('กรุณากรอกชื่อรายการ'),
  income: Yup.number()
    .min(0, 'รายได้ต้องเป็นตัวเลขที่ไม่ติดลบ')
    .required('กรุณากรอกรายได้'),
  cost: Yup.number()
    .min(0, 'ต้นทุนต้องเป็นตัวเลขที่ไม่ติดลบ')
    .required('กรุณากรอกต้นทุน'),
  profit: Yup.number()
    .min(0, 'กำไรต้องเป็นตัวเลขที่ไม่ติดลบ')
    .required('กรุณากรอกกำไร'),
  note: Yup.string().max(500, 'หมายเหตุต้องไม่เกิน 500 ตัวอักษร').optional(),
  sales_channel: Yup.string()
    .max(50, 'ช่องทางการขายต้องไม่เกิน 50 ตัวอักษร')
    .optional(),
  sales_type: Yup.string()
    .max(50, 'ประเภทการขายต้องไม่เกิน 50 ตัวอักษร')
    .optional(),
  bank: Yup.string().max(50, 'ชื่อธนาคารต้องไม่เกิน 50 ตัวอักษร').optional(),
  supplier: Yup.string()
    .max(50, 'ชื่อซัพพลายเออร์ต้องไม่เกิน 50 ตัวอักษร')
    .optional(),
  slip_image: Yup.string().url('URL รูปภาพไม่ถูกต้อง').optional(),
  customer: Yup.string()
    .max(50, 'ชื่อลูกค้าต้องไม่เกิน 50 ตัวอักษร')
    .optional(),
  reference: Yup.string()
    .max(100, 'อ้างอิงต้องไม่เกิน 100 ตัวอักษร')
    .optional(),
  fee: Yup.number().min(0, 'ค่าธรรมเนียมต้องเป็นตัวเลขที่ไม่ติดลบ').optional(),
});

const EnhancedIncomeTableRow: React.FC<EnhancedIncomeTableRowProps> = ({
  initialValues,
  mutate,
  onDelete,
}) => {
  const incomeForm = useFormik<IIncome>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.request({
          method: 'patch',
          url: `/incomes/${initialValues._id}`,
          data: values,
        });
        if (mutate) mutate();
        Swal.fire('Success', 'Income updated successfully!', 'success');
      } catch (error) {
        const axiosError = error as AxiosError;
        Swal.fire('Error', axiosError.message || 'An error occurred.', 'error');
      }
    },
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatCurrency = (num: number) =>
    `฿${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const renderTooltip = (text: string) => (props: any) => (
    <Tooltip id={`tooltip-${incomeForm.values._id}`} {...props}>
      {text}
    </Tooltip>
  );

  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseImage = () => setShowImageModal(false);
  const handleCloseEdit = () => setShowEditModal(false);

  return (
    <>
      <tr>
        <td>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip(
              `วันที่: ${formatDate(incomeForm.values.date.toString())}`,
            )}
          >
            <span>{incomeForm.values.item}</span>
          </OverlayTrigger>
          <div className="text-muted small">
            ลูกค้า: {incomeForm.values.customer}
          </div>
        </td>
        <td className="text-success fw-bold fs-5">
          {formatCurrency(incomeForm.values.income)}
        </td>
        <td className="text-danger">
          {formatCurrency(incomeForm.values.cost)}
        </td>
        <td className="text-primary fw-bold">
          {formatCurrency(incomeForm.values.profit)}
        </td>
        <td>
          <Badge pill bg="info" text="dark" className="mb-1">
            {incomeForm.values.sales_channel}
          </Badge>
          <br />
          <Badge pill bg="light" text="dark">
            {incomeForm.values.sales_type}
          </Badge>
        </td>
        <td>
          <div>{incomeForm.values.bank}</div>
          <div className="text-muted small">
            โดย: {incomeForm.values.supplier}
          </div>
        </td>
        <td className="text-center">
          {incomeForm.values.slip_image && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                setShowImageModal(true);
              }}
            >
              <ImageIcon /> ดูสลิป
            </Button>
          )}
        </td>
        <td>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip('แก้ไขข้อมูล')}
          >
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              onClick={() => {
                setShowEditModal(true);
              }}
            >
              <BsPencilSquare />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderTooltip('ลบข้อมูล')}>
            <Button variant="outline-danger" size="sm" onClick={onDelete}>
              <BsTrash />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
      <Modal show={showImageModal} onHide={handleCloseImage} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>รูปภาพสลิป</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ImageIcon src={incomeForm.values.slip_image} fluid rounded />
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEdit} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูล</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <IncomeForm incomeForm={incomeForm} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EnhancedIncomeTableRow;
