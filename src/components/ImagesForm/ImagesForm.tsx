import { useFormik } from 'formik';
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsTrash3Fill,
} from 'react-icons/bs';
import unknownImage from '../../assets/images/unknown.png';
import './ImagesForm.css';
import { uploadImage } from '../../utils/uploadImage';

// --- ImageItem Component ---
interface ImageItemProps {
  imageUrl: string;
  index: number;
  fieldName: string;
  formik: ReturnType<typeof useFormik<any>>;
  onRemove: (index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function ImageItem({
  imageUrl,
  index,
  fieldName,
  formik,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ImageItemProps) {
  return (
    <div className="sortable-image-item">
      {/* Move Up/Down Buttons */}
      <div className="d-flex flex-column">
        <button
          type="button"
          className="btn btn-light btn-sm p-0"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <BsFillCaretUpFill size={20} />
        </button>
        <button
          type="button"
          className="btn btn-light btn-sm p-0"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <BsFillCaretDownFill size={20} />
        </button>
      </div>

      {/* Image Preview & Upload */}
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
          ลำดับ {index + 1}
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

      {/* Delete Button */}
      <button
        type="button"
        className="delete-btn"
        onClick={() => onRemove(index)}
      >
        <BsTrash3Fill size={18} />
      </button>
    </div>
  );
}

// --- Main ImagesForm Component ---
interface ImagesFormProps {
  label: string;
  formik: ReturnType<typeof useFormik<any>>;
  fieldName: string;
}

export default function ImagesForm({
  formik,
  fieldName,
  label,
}: ImagesFormProps) {
  const images: string[] = formik.values[fieldName] || [];

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const updatedImages = [...images];
    // Swap elements
    [updatedImages[index - 1], updatedImages[index]] = [
      updatedImages[index],
      updatedImages[index - 1],
    ];
    formik.setFieldValue(fieldName, updatedImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    const updatedImages = [...images];
    // Swap elements
    [updatedImages[index], updatedImages[index + 1]] = [
      updatedImages[index + 1],
      updatedImages[index],
    ];
    formik.setFieldValue(fieldName, updatedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    formik.setFieldValue(fieldName, updatedImages);
  };

  const addImage = () => {
    formik.setFieldValue(fieldName, [...images, '']);
  };

  return (
    <div className="form-group">
      <label className="form-label fw-bold mb-3">{label}</label>

      <div className="image-list">
        {images.length > 0 ? (
          images.map((image, index) => (
            <ImageItem
              key={`${fieldName}-${index}`}
              imageUrl={image}
              index={index}
              fieldName={fieldName}
              formik={formik}
              onRemove={removeImage}
              onMoveUp={() => moveImageUp(index)}
              onMoveDown={() => moveImageDown(index)}
              isFirst={index === 0}
              isLast={index === images.length - 1}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>ยังไม่ได้เพิ่มรูปภาพ</p>
            <p>คลิก "เพิ่มรูปภาพ" เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn fw-bold rounded px-4 border-0 w-100 mt-3"
        style={{ backgroundColor: '#16DBCC', color: 'white' }}
        onClick={addImage}
      >
        เพิ่มรูปภาพ
      </button>
    </div>
  );
}
