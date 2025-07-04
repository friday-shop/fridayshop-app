import { useFormik } from 'formik';
import './ImagesForm.css';
import {
  BsTrash,
  BsFillCaretDownFill,
  BsFillCaretUpFill,
} from 'react-icons/bs';
import unknownImage from '../../assets/images/unknown.png';

interface ImagesFormProps {
  formik: ReturnType<typeof useFormik<any>>;
  fieldName: string;
}

export default function ImagesForm({ formik, fieldName }: ImagesFormProps) {
  const images: any[] = formik.values[fieldName] || [];

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    formik.setFieldValue(fieldName, updatedImages);
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const updatedImages = [...images];
    [updatedImages[index - 1], updatedImages[index]] = [
      updatedImages[index],
      updatedImages[index - 1],
    ];
    formik.setFieldValue(fieldName, updatedImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    const updatedImages = [...images];
    [updatedImages[index], updatedImages[index + 1]] = [
      updatedImages[index + 1],
      updatedImages[index],
    ];
    formik.setFieldValue(fieldName, updatedImages);
  };

  return (
    <div
      className="card flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold"
      style={{
        boxShadow: '0 4px 12px rgba(220, 220, 220, 0.4)',
      }}
    >
      <div className="form-group">
        <label className="mb-2">Product Images</label>
        <div className="image-list-container">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <div className="image-header">
                {/* Controls */}
                <div className="image-controls">
                  <div className="d-flex flex-column">
                    <button
                      type="button"
                      className="btn btn-light btn-sm p-0"
                      onClick={() => moveImageUp(index)}
                      disabled={index === 0}
                    >
                      <BsFillCaretUpFill size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-sm p-0"
                      onClick={() => moveImageDown(index)}
                      disabled={index === images.length - 1}
                    >
                      <BsFillCaretDownFill size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn-delete-image"
                    onClick={() => removeImage(index)}
                  >
                    <BsTrash size={16} />
                  </button>
                </div>
                {/* URL input */}
                <div className="flex-grow-1">
                  <label
                    htmlFor={`${fieldName}[${index}]`}
                    className="form-label-sm"
                  >
                    Image URL #{index + 1}
                  </label>
                  <input
                    id={`${fieldName}[${index}]`}
                    type="text"
                    name={`${fieldName}[${index}]`}
                    className="form-control"
                    value={image}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              {/* Image preview */}
              {image && (
                <div className="image-preview-container">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="image-preview"
                    onError={(error) => {
                      error.currentTarget.onerror = null;
                      error.currentTarget.src = unknownImage;
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-add-image"
          onClick={() => formik.setFieldValue(fieldName, [...images, ''])}
        >
          Add Image
        </button>
      </div>
    </div>
  );
}
