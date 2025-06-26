import { useFormik } from 'formik';
import type { IProduct } from '../../types/product';

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
        <label htmlFor="name">ชื่อสินค้า</label>
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
        <label htmlFor="price">ราคา</label>
        <input
          id="price"
          name="price"
          type="number"
          className={`form-control${productForm.touched.price && productForm.errors.price ? ' is-invalid' : ''}`}
          value={productForm.values.price}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        {productForm.touched.price && productForm.errors.price ? (
          <div className="invalid-feedback">{productForm.errors.price}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="expirationDays">วันหมดอายุ</label>
        <input
          id="expirationDays"
          name="expirationDays"
          type="number"
          className={`form-control${productForm.touched.expirationDays && productForm.errors.expirationDays ? ' is-invalid' : ''}`}
          value={productForm.values.expirationDays}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        {productForm.touched.expirationDays &&
        productForm.errors.expirationDays ? (
          <div className="invalid-feedback">
            {productForm.errors.expirationDays}
          </div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">URL รูปภาพ</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          className={`form-control${productForm.touched.imageUrl && productForm.errors.imageUrl ? ' is-invalid' : ''}`}
          value={productForm.values.imageUrl || ''}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        {productForm.touched.imageUrl && productForm.errors.imageUrl ? (
          <div className="invalid-feedback">{productForm.errors.imageUrl}</div>
        ) : null}
      </div>

      <div className="form-group form-check">
        <input
          id="isOpen"
          name="isOpen"
          type="checkbox"
          className={`form-check-input${productForm.touched.isOpen && productForm.errors.isOpen ? ' is-invalid' : ''}`}
          checked={productForm.values.isOpen}
          onChange={productForm.handleChange}
          onBlur={productForm.handleBlur}
        />
        <label htmlFor="isOpen" className="form-check-label">
          เปิดใช้งาน
        </label>
        {productForm.touched.isOpen && productForm.errors.isOpen ? (
          <div className="invalid-feedback d-block">
            {productForm.errors.isOpen}
          </div>
        ) : null}
      </div>
    </div>
  );
}
