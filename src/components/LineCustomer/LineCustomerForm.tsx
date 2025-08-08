import { useFormik } from 'formik';
import type { ILineCustomer } from '../../types/line-customer';
import { useState } from 'react';

interface LineCustomerFormProps {
  lineCustomerForm: ReturnType<typeof useFormik<ILineCustomer>>;
}

export default function LineCustomerForm({
  lineCustomerForm,
}: LineCustomerFormProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (lineCustomerForm.values.userId) {
      navigator.clipboard.writeText(lineCustomerForm.values.userId).then(
        () => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        },
        (err) => {
          console.error('ไม่สามารถคัดลอกได้: ', err);
        },
      );
    }
  };
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="name">ชื่อลูกค้า</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control${lineCustomerForm.touched.name && lineCustomerForm.errors.name ? ' is-invalid' : ''}`}
          value={lineCustomerForm.values.name}
          onChange={lineCustomerForm.handleChange}
          onBlur={lineCustomerForm.handleBlur}
        />
        {lineCustomerForm.touched.name && lineCustomerForm.errors.name ? (
          <div className="invalid-feedback">{lineCustomerForm.errors.name}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="userId">User ID</label>
        <div className="input-group">
          <input
            id="userId"
            name="userId"
            type="text"
            className="form-control"
            value={lineCustomerForm.values.userId}
            readOnly
            style={{ backgroundColor: '#e9ecef' }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleCopy}
          >
            {isCopied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
          </button>
        </div>
        {lineCustomerForm.touched.userId && lineCustomerForm.errors.userId ? (
          <div className="invalid-feedback d-block">
            {lineCustomerForm.errors.userId}
          </div>
        ) : null}
      </div>
      <div className="form-group form-check">
        <input
          id="isBan"
          name="isBan"
          type="checkbox"
          className={`form-check-input${lineCustomerForm.touched.isBan && lineCustomerForm.errors.isBan ? ' is-invalid' : ''}`}
          checked={lineCustomerForm.values.isBan}
          onChange={lineCustomerForm.handleChange}
          onBlur={lineCustomerForm.handleBlur}
        />
        <label htmlFor="isBan" className="form-check-label">
          ลูกค้าถูกแบน
        </label>
        {lineCustomerForm.touched.isBan && lineCustomerForm.errors.isBan ? (
          <div className="invalid-feedback d-block">
            {lineCustomerForm.errors.isBan}
          </div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="point">แต้ม</label>
        <input
          id="point"
          name="point"
          type="number"
          className={`form-control${lineCustomerForm.touched.point && lineCustomerForm.errors.point ? ' is-invalid' : ''}`}
          value={lineCustomerForm.values.point}
          onChange={lineCustomerForm.handleChange}
          onBlur={lineCustomerForm.handleBlur}
        />
        {lineCustomerForm.touched.point && lineCustomerForm.errors.point ? (
          <div className="invalid-feedback">
            {lineCustomerForm.errors.point}
          </div>
        ) : null}
      </div>
    </div>
  );
}
