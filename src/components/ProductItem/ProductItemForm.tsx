import { useFormik } from 'formik';
import type { IProductItem } from '../../types/product-item';
import ImagesForm from '../ImagesForm/ImagesForm';

interface ProductItemFormProps {
  productItemForm: ReturnType<typeof useFormik<IProductItem>>;
}

export default function ProductItemForm({
  productItemForm,
}: ProductItemFormProps) {
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
          className={`form-control${productItemForm.touched.sortOrder && productItemForm.errors.sortOrder ? ' is-invalid' : ''}`}
          value={productItemForm.values.sortOrder}
          onChange={productItemForm.handleChange}
          onBlur={productItemForm.handleBlur}
        />
        {productItemForm.touched.sortOrder &&
        productItemForm.errors.sortOrder ? (
          <div className="invalid-feedback">
            {productItemForm.errors.sortOrder}
          </div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="name">ชื่อสินค้า</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control${productItemForm.touched.name && productItemForm.errors.name ? ' is-invalid' : ''}`}
          value={productItemForm.values.name}
          onChange={productItemForm.handleChange}
          onBlur={productItemForm.handleBlur}
        />
        {productItemForm.touched.name && productItemForm.errors.name ? (
          <div className="invalid-feedback">{productItemForm.errors.name}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="price">ราคา</label>
        <input
          id="price"
          name="price"
          type="number"
          className={`form-control${productItemForm.touched.price && productItemForm.errors.price ? ' is-invalid' : ''}`}
          value={productItemForm.values.price}
          onChange={productItemForm.handleChange}
          onBlur={productItemForm.handleBlur}
        />
        {productItemForm.touched.price && productItemForm.errors.price ? (
          <div className="invalid-feedback">{productItemForm.errors.price}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="expirationDays">วันหมดอายุ</label>
        <input
          id="expirationDays"
          name="expirationDays"
          type="number"
          className={`form-control${productItemForm.touched.expirationDays && productItemForm.errors.expirationDays ? ' is-invalid' : ''}`}
          value={productItemForm.values.expirationDays}
          onChange={productItemForm.handleChange}
          onBlur={productItemForm.handleBlur}
        />
        {productItemForm.touched.expirationDays &&
        productItemForm.errors.expirationDays ? (
          <div className="invalid-feedback">
            {productItemForm.errors.expirationDays}
          </div>
        ) : null}
      </div>
      <div className="form-group form-check">
        <input
          id="isDiscount"
          name="isDiscount"
          type="checkbox"
          className={`form-check-input${productItemForm.touched.isDiscount && productItemForm.errors.isDiscount ? ' is-invalid' : ''}`}
          checked={productItemForm.values.isDiscount}
          onChange={productItemForm.handleChange}
          onBlur={productItemForm.handleBlur}
        />
        <label htmlFor="isDiscount" className="form-check-label">
          เปิด/ปิดส่วนลด
        </label>
        {productItemForm.touched.isDiscount &&
        productItemForm.errors.isDiscount ? (
          <div className="invalid-feedback d-block">
            {productItemForm.errors.isDiscount}
          </div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="discount">ส่วนลด (บาท)</label>
        <input
          id="discount"
          name="discount"
          type="number"
          className={`form-control${productItemForm.touched.discount && productItemForm.errors.discount ? ' is-invalid' : ''}`}
          value={productItemForm.values.discount}
          onChange={productItemForm.handleChange}
          onBlur={productItemForm.handleBlur}
        />
        {productItemForm.touched.discount && productItemForm.errors.discount ? (
          <div className="invalid-feedback">
            {productItemForm.errors.discount}
          </div>
        ) : null}
      </div>

      <ImagesForm
        label="รูปภาพเตือน"
        formik={productItemForm}
        fieldName="imagesWarningUrl"
      />
    </div>
  );
}
