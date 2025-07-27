import { useFormik } from 'formik';
import type { ITelegram } from '../../../types/telegram';
import TagInput from '../../TagInput/TagInput';

interface TelegramFormProps {
  telegramForm: ReturnType<typeof useFormik<ITelegram>>;
}

export default function TelegramForm({ telegramForm }: TelegramFormProps) {
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="accessToken">accessToken</label>
        <input
          id="accessToken"
          name="accessToken"
          type="text"
          className={`form-control${telegramForm.touched.accessToken && telegramForm.errors.accessToken ? ' is-invalid' : ''}`}
          value={telegramForm.values.accessToken}
          onChange={telegramForm.handleChange}
          onBlur={telegramForm.handleBlur}
        />
        {telegramForm.touched.accessToken && telegramForm.errors.accessToken ? (
          <div className="invalid-feedback">
            {telegramForm.errors.accessToken}
          </div>
        ) : null}
      </div>
      <TagInput
        label="id ของผู้รับ"
        name="recivers"
        formik={telegramForm}
        placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม"
      />
    </div>
  );
}
