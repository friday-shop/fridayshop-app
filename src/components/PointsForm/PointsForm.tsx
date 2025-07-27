import { useFormik } from 'formik';
import unknownImage from '../../assets/images/unknown.png';
import './PointsForm.css';
import { uploadImage } from '../../utils/uploadImage';

interface PointItemProps {
  imageUrl: string;
  index: number;
  fieldName: string;
  formik: ReturnType<typeof useFormik<any>>;
}

function PointItem({ imageUrl, index, fieldName, formik }: PointItemProps) {
  return (
    <div className="sortable-image-item">
      <div style={{ position: 'relative' }}>
        <img
          onClick={async (event) => {
            event.stopPropagation();
            const url = await uploadImage('common');
            formik.setFieldValue(`${fieldName}[${index}]`, url);
          }}
          src={imageUrl || unknownImage}
          alt={`Preview ${index + 1}`}
          onError={(error) => {
            error.currentTarget.onerror = null;
            error.currentTarget.src = unknownImage;
          }}
          className="image-preview"
          style={{
            cursor: 'pointer',
            filter: 'brightness(0.7)',
            transition: 'filter 0.2s ease-in-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            borderRadius: '6px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            fontSize: '10px',
            whiteSpace: 'nowrap',
          }}
        >
          เลือกรูปภาพ
        </div>
      </div>

      {/* Image URL Input */}
      <div className="image-input-group">
        <label htmlFor={`${fieldName}[${index}]`} className="form-label-sm">
          {index} แต้ม
        </label>
        <input
          id={`${fieldName}[${index}]`}
          name={`${fieldName}[${index}]`}
          type="text"
          className="form-control"
          value={imageUrl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
}

// --- Main PointsForm Component ---
interface PointsFormProps {
  label: string;
  formik: ReturnType<typeof useFormik<any>>;
  fieldName: string;
}

export default function PointsForm({
  formik,
  fieldName,
  label,
}: PointsFormProps) {
  const images: string[] = formik.values[fieldName] || [];

  return (
    <div className="form-group">
      <label className="form-label fw-bold mb-3">{label}</label>

      <div className="image-list">
        {images.map((image, index) => (
          <PointItem
            key={`${fieldName}-${index}`}
            imageUrl={image}
            index={index}
            fieldName={fieldName}
            formik={formik}
          />
        ))}
      </div>
    </div>
  );
}
