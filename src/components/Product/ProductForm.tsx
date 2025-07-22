import { useFormik } from 'formik';
import type { IProduct } from '../../types/product';
import ImagesForm from '../ImagesForm/ImagesForm';
import TagInput from '../TagInput/TagInput';

interface ProductFormProps {
  productForm: ReturnType<typeof useFormik<IProduct>>;
}

export default function ProductForm({ productForm }: ProductFormProps) {
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="sortOrder">ลำดับ</label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          className={`form-control${productForm.touched.sortOrder && productForm.errors.sortOrder ? ' is-invalid' : ''}`}
          value={productForm.values.sortOrder}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        {productForm.touched.sortOrder && productForm.errors.sortOrder ? (
          <div className="invalid-feedback">{productForm.errors.sortOrder}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="name">ชื่อรายการสินค้า</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control${productForm.touched.name && productForm.errors.name ? ' is-invalid' : ''}`}
          value={productForm.values.name}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        {productForm.touched.name && productForm.errors.name ? (
          <div className="invalid-feedback">{productForm.errors.name}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="description">รายละเอียด</label>
        <textarea
          id="description"
          name="description"
          className={`form-control${productForm.touched.description && productForm.errors.description ? ' is-invalid' : ''}`}
          value={productForm.values.description}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
          rows={3}
        />
        {productForm.touched.description && productForm.errors.description ? (
          <div className="invalid-feedback">
            {productForm.errors.description}
          </div>
        ) : null}
      </div>

      <div className="form-group form-check">
        <input
          id="isUseForm"
          name="isUseForm"
          type="checkbox"
          className={`form-check-input${productForm.touched.isUseForm && productForm.errors.isUseForm ? ' is-invalid' : ''}`}
          checked={productForm.values.isUseForm}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        <label htmlFor="isUseForm" className="form-check-label">
          ใช้งานฟอร์ม
        </label>
        {productForm.touched.isUseForm && productForm.errors.isUseForm ? (
          <div className="invalid-feedback d-block">
            {productForm.errors.isUseForm}
          </div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="formFormat">รูปแบบฟอร์ม</label>
        <textarea
          id="formFormat"
          name="formFormat"
          className={`form-control${productForm.touched.formFormat && productForm.errors.formFormat ? ' is-invalid' : ''}`}
          value={productForm.values.formFormat || ''}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
          rows={
            (productForm.values.formFormat?.split('\n').length || 1) < 4
              ? 4
              : productForm.values.formFormat?.split('\n').length
          }
        />
        {productForm.touched.formFormat && productForm.errors.formFormat ? (
          <div className="invalid-feedback">
            {productForm.errors.formFormat}
          </div>
        ) : null}
      </div>
      <ImagesForm
        label="รูปภาพเตือน"
        formik={productForm}
        fieldName="imagesWarningUrl"
      />
      <TagInput
        label="รายการคำที่เกี่ยวข้อง"
        name="matchList"
        formik={productForm}
        placeholder="เพิ่มรายการคำที่เกี่ยวข้อง"
      />
    </div>
  );
}
