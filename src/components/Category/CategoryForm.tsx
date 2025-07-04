import { useFormik } from 'formik';
import type { ICategory } from '../../types/category';
import ImagesForm from '../ImagesForm/ImagesForm';

interface CategoryFormProps {
  categoryForm: ReturnType<typeof useFormik<ICategory>>;
}

export default function CategoryForm({ categoryForm }: CategoryFormProps) {
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="name">ชื่อประเภท</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control${categoryForm.touched.name && categoryForm.errors.name ? ' is-invalid' : ''}`}
          value={categoryForm.values.name}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
        />
        {categoryForm.touched.name && categoryForm.errors.name ? (
          <div className="invalid-feedback">{categoryForm.errors.name}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="description">รายละเอียด</label>
        <textarea
          id="description"
          name="description"
          className={`form-control${categoryForm.touched.description && categoryForm.errors.description ? ' is-invalid' : ''}`}
          value={categoryForm.values.description}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
          rows={3}
        />
        {categoryForm.touched.description && categoryForm.errors.description ? (
          <div className="invalid-feedback">
            {categoryForm.errors.description}
          </div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">URL รูปภาพ</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          className={`form-control${categoryForm.touched.imageUrl && categoryForm.errors.imageUrl ? ' is-invalid' : ''}`}
          value={categoryForm.values.imageUrl}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
        />
        {categoryForm.touched.imageUrl && categoryForm.errors.imageUrl ? (
          <div className="invalid-feedback">{categoryForm.errors.imageUrl}</div>
        ) : null}
      </div>

      <div className="form-group form-check">
        <input
          id="isOpen"
          name="isOpen"
          type="checkbox"
          className={`form-check-input${categoryForm.touched.isOpen && categoryForm.errors.isOpen ? ' is-invalid' : ''}`}
          checked={categoryForm.values.isOpen}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
        />
        <label htmlFor="isOpen" className="form-check-label">
          เปิดใช้งาน
        </label>
        {categoryForm.touched.isOpen && categoryForm.errors.isOpen ? (
          <div className="invalid-feedback d-block">
            {categoryForm.errors.isOpen}
          </div>
        ) : null}
      </div>

      <div className="form-group form-check">
        <input
          id="isUseForm"
          name="isUseForm"
          type="checkbox"
          className={`form-check-input${categoryForm.touched.isUseForm && categoryForm.errors.isUseForm ? ' is-invalid' : ''}`}
          checked={categoryForm.values.isUseForm}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
        />
        <label htmlFor="isUseForm" className="form-check-label">
          ใช้งานฟอร์ม
        </label>
        {categoryForm.touched.isUseForm && categoryForm.errors.isUseForm ? (
          <div className="invalid-feedback d-block">
            {categoryForm.errors.isUseForm}
          </div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="formFormat">รูปแบบฟอร์ม</label>
        <textarea
          id="formFormat"
          name="formFormat"
          className={`form-control${categoryForm.touched.formFormat && categoryForm.errors.formFormat ? ' is-invalid' : ''}`}
          value={categoryForm.values.formFormat || ''}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
          rows={
            (categoryForm.values.formFormat?.split('\n').length || 1) < 4
              ? 4
              : categoryForm.values.formFormat?.split('\n').length
          }
        />
        {categoryForm.touched.formFormat && categoryForm.errors.formFormat ? (
          <div className="invalid-feedback">
            {categoryForm.errors.formFormat}
          </div>
        ) : null}
      </div>
      <ImagesForm formik={categoryForm} fieldName="imagesWarrningUrl" />
    </div>
  );
}
