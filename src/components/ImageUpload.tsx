import type { FormikProps } from 'formik';
import { uploadImage } from '../utils/uploadImage';

interface ImageUploadProps<T> {
  label: string;
  name: keyof T & string;
  formik: FormikProps<T>;
}

export const ImageUpload = <T,>({
  label,
  name,
  formik,
}: ImageUploadProps<T>) => {
  const imageUrl = formik.values[name] as string;
  const error = formik.touched[name] && (formik.errors[name] as string);

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      <button
        className="btn fw-bold rounded px-4 border-0 w-100"
        style={{ backgroundColor: '#876DFD', color: 'white' }}
        onClick={async () => {
          const url = await uploadImage('common');
          formik.setFieldValue(name, url);
        }}
      >
        อัปโหลดรูปภาพ
      </button>

      {/* URL Input Field */}
      <input
        id={name}
        name={name}
        type="text"
        placeholder="หรือวาง URL รูปภาพที่นี่"
        className={`form-control mt-3 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        value={imageUrl || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      {/* Error Message */}
      {error ? <div className="mt-1 text-sm text-red-600">{error}</div> : null}
    </div>
  );
};
