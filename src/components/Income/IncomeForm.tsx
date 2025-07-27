import { useFormik } from 'formik';
import type { IIncome } from '../../types/income';
import { ImageUpload } from '../ImageUpload';

interface IncomeFormProps {
  incomeForm: ReturnType<typeof useFormik<IIncome>>;
}

export default function IncomeForm({ incomeForm }: IncomeFormProps) {
  return (
    <div className="p-4 gap-3 d-flex flex-column">
      <div className="form-group">
        <label htmlFor="date">วันที่</label>
        <input
          id="date"
          name="date"
          type="date"
          className={`form-control${incomeForm.touched.date && incomeForm.errors.date ? ' is-invalid' : ''}`}
          value={incomeForm.values.date?.toString().split('T')[0]}
          onChange={incomeForm.handleChange}
          onBlur={incomeForm.handleBlur}
        />
        {incomeForm.touched.date && incomeForm.errors.date && (
          <div className="invalid-feedback">
            {incomeForm.errors.date as string}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="item">รายการ</label>
        <input
          id="item"
          name="item"
          type="text"
          className={`form-control${incomeForm.touched.item && incomeForm.errors.item ? ' is-invalid' : ''}`}
          value={incomeForm.values.item}
          onChange={incomeForm.handleChange}
          onBlur={incomeForm.handleBlur}
        />
        {incomeForm.touched.item && incomeForm.errors.item && (
          <div className="invalid-feedback">{incomeForm.errors.item}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="income">รายรับ (บาท)</label>
        <input
          id="income"
          name="income"
          type="number"
          className="form-control"
          value={incomeForm.values.income}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cost">ต้นทุน (บาท)</label>
        <input
          id="cost"
          name="cost"
          type="number"
          className="form-control"
          value={incomeForm.values.cost}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="profit">กำไร (บาท)</label>
        <input
          id="profit"
          name="profit"
          type="number"
          className="form-control"
          value={incomeForm.values.profit}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="note">หมายเหตุ</label>
        <textarea
          id="note"
          name="note"
          className="form-control"
          value={incomeForm.values.note}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sales_channel">ช่องทางขาย</label>
        <input
          id="sales_channel"
          name="sales_channel"
          type="text"
          className="form-control"
          value={incomeForm.values.sales_channel}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sales_type">ประเภทการขาย</label>
        <input
          id="sales_type"
          name="sales_type"
          type="text"
          className="form-control"
          value={incomeForm.values.sales_type}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bank">ธนาคาร</label>
        <input
          id="bank"
          name="bank"
          type="text"
          className="form-control"
          value={incomeForm.values.bank}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="supplier">ซัพพลายเออร์</label>
        <input
          id="supplier"
          name="supplier"
          type="text"
          className="form-control"
          value={incomeForm.values.supplier}
          onChange={incomeForm.handleChange}
        />
      </div>

      <ImageUpload<IIncome>
        label="สลิปการโอน"
        name="slip_image"
        formik={incomeForm}
      />

      <div className="form-group">
        <label htmlFor="customer">ลูกค้า</label>
        <input
          id="customer"
          name="customer"
          type="text"
          className="form-control"
          value={incomeForm.values.customer}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reference">อ้างอิง</label>
        <input
          id="reference"
          name="reference"
          type="text"
          className="form-control"
          value={incomeForm.values.reference}
          onChange={incomeForm.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="fee">ค่าธรรมเนียม (ถ้ามี)</label>
        <input
          id="fee"
          name="fee"
          type="number"
          className="form-control"
          value={incomeForm.values.fee}
          onChange={incomeForm.handleChange}
        />
      </div>
      <div className="form-group">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => incomeForm.handleSubmit()}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}
