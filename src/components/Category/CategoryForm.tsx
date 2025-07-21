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
        <label htmlFor="sortOrder">ลำดับ</label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          className={`form-control${categoryForm.touched.sortOrder && categoryForm.errors.sortOrder ? ' is-invalid' : ''}`}
          value={categoryForm.values.sortOrder}
          onChange={categoryForm.handleChange}
          onBlur={categoryForm.handleBlur}
        />
        {categoryForm.touched.sortOrder && categoryForm.errors.sortOrder ? (
          <div className="invalid-feedback">
            {categoryForm.errors.sortOrder}
          </div>
        ) : null}
      </div>
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
      <ImagesForm
        label="รูปภาพเตือน"
        formik={categoryForm}
        fieldName="imagesWarningUrl"
      />
    </div>
  );
}
