import { useFormik } from 'formik';
import type { IProvider } from '../../types/provider';
import TagInput from '../TagInput/TagInput';
import { providersSubDomainList } from '../../constants/provider';

interface ProviderFormProps {
  providerForm: ReturnType<typeof useFormik<IProvider>>;
}

export default function ProviderForm({ providerForm }: ProviderFormProps) {
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="name">ชื่อผู้ให้บริการ</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`form-control${providerForm.touched.name && providerForm.errors.name ? ' is-invalid' : ''}`}
          value={providerForm.values.name}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        />
        {providerForm.touched.name && providerForm.errors.name ? (
          <div className="invalid-feedback">{providerForm.errors.name}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">ลิงก์รูปภาพ</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          className={`form-control${providerForm.touched.imageUrl && providerForm.errors.imageUrl ? ' is-invalid' : ''}`}
          value={providerForm.values.imageUrl}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        />
        {providerForm.touched.imageUrl && providerForm.errors.imageUrl ? (
          <div className="invalid-feedback">{providerForm.errors.imageUrl}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="url">url</label>
        <input
          id="url"
          name="url"
          type="text"
          className={`form-control${providerForm.touched.url && providerForm.errors.url ? ' is-invalid' : ''}`}
          value={providerForm.values.url}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        />
        {providerForm.touched.url && providerForm.errors.url ? (
          <div className="invalid-feedback">{providerForm.errors.url}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="cookie">คุกกี้</label>
        <input
          id="cookie"
          name="cookie"
          type="text"
          className={`form-control${providerForm.touched.cookie && providerForm.errors.cookie ? ' is-invalid' : ''}`}
          value={providerForm.values.cookie}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        />
        {providerForm.touched.cookie && providerForm.errors.cookie ? (
          <div className="invalid-feedback">{providerForm.errors.cookie}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="marker">marker</label>
        <input
          id="marker"
          name="marker"
          type="text"
          className={`form-control${providerForm.touched.marker && providerForm.errors.marker ? ' is-invalid' : ''}`}
          value={providerForm.values.marker}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        />
        {providerForm.touched.marker && providerForm.errors.marker ? (
          <div className="invalid-feedback">{providerForm.errors.marker}</div>
        ) : null}
      </div>
      <div className="form-group">
        <label>ซับโดเมน</label>
        <select
          name={'subDomain'}
          className="form-select"
          value={providerForm.values.subDomain}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        >
          <option value="" disabled>
            เลือก Sub-domain
          </option>
          {providersSubDomainList?.map((ps) => (
            <option key={ps} value={ps}>
              {ps}
            </option>
          ))}
        </select>
      </div>
      <TagInput
        label="ตัวกรองรหัสผ่าน"
        name="filterPasswords"
        formik={providerForm}
        placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม"
      />

      <div className="form-group form-check">
        <input
          id="isOpen"
          name="isOpen"
          type="checkbox"
          className={`form-check-input${providerForm.touched.isOpen && providerForm.errors.isOpen ? ' is-invalid' : ''}`}
          checked={providerForm.values.isOpen}
          onChange={providerForm.handleChange}
          onBlur={providerForm.handleBlur}
        />
        <label htmlFor="isOpen" className="form-check-label">
          เปิดใช้งาน
        </label>
        {providerForm.touched.isOpen && providerForm.errors.isOpen ? (
          <div className="invalid-feedback d-block">
            {providerForm.errors.isOpen}
          </div>
        ) : null}
      </div>
    </div>
  );
}
