import { useFormik } from 'formik';
import type { ILine } from '../../../types/line';
import TagInput from '../../TagInput/TagInput';
import PointsForm from '../../PointsForm/PointsForm';

interface LineFormProps {
  lineForm: ReturnType<typeof useFormik<ILine>>;
}

export default function LineForm({ lineForm }: LineFormProps) {
  return (
    <div
      className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card "
      style={{
        boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
      }}
    >
      <div className="form-group">
        <label htmlFor="channelSecret">channelSecret</label>
        <input
          id="channelSecret"
          name="channelSecret"
          type="text"
          className={`form-control${lineForm.touched.channelSecret && lineForm.errors.channelSecret ? ' is-invalid' : ''}`}
          value={lineForm.values.channelSecret}
          onChange={lineForm.handleChange}
          onBlur={lineForm.handleBlur}
        />
        {lineForm.touched.channelSecret && lineForm.errors.channelSecret ? (
          <div className="invalid-feedback">
            {lineForm.errors.channelSecret}
          </div>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="channelAccessToken">channelAccessToken</label>
        <input
          id="channelAccessToken"
          name="channelAccessToken"
          type="text"
          className={`form-control${lineForm.touched.channelAccessToken && lineForm.errors.channelAccessToken ? ' is-invalid' : ''}`}
          value={lineForm.values.channelAccessToken}
          onChange={lineForm.handleChange}
          onBlur={lineForm.handleBlur}
        />
        {lineForm.touched.channelAccessToken &&
        lineForm.errors.channelAccessToken ? (
          <div className="invalid-feedback">
            {lineForm.errors.channelAccessToken}
          </div>
        ) : null}
      </div>
      <TagInput
        label="id ของผู้ซื้อฟรี"
        name="freePurchaseUserIds"
        formik={lineForm}
        placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม"
      />
      <PointsForm
        label="รูปภาพสำหรับการสะสมแต้ม"
        formik={lineForm}
        fieldName="pointsImageUrl"
      />
    </div>
  );
}
