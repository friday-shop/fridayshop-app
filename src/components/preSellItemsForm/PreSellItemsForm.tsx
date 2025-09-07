import { useFormik, getIn } from 'formik';
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsTrash3Fill,
} from 'react-icons/bs';
import './PreSellItemsForm.css';

// ---------------------- Item Component ----------------------
interface PreSellItemProps {
  index: number;
  preSellItem: string;
  formik: ReturnType<typeof useFormik<any>>;
  fieldPath: string; // e.g. "preSellItems[0]"
  onRemove: (index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function PreSellItem({
  index,
  preSellItem,
  formik,
  fieldPath,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: PreSellItemProps) {
  const isTouched = Boolean(getIn(formik.touched, fieldPath));
  const errorMsg = getIn(formik.errors, fieldPath) as string | undefined;

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

      <div className="form-group">
        <label htmlFor={`presell-${index}`}>ลำดับ {index + 1}</label>
        <textarea
          id={`presell-${index}`}
          name={fieldPath}
          className={`form-control${isTouched && errorMsg ? ' is-invalid' : ''}`}
          value={preSellItem}
          onChange={(e) => formik.setFieldValue(fieldPath, e.target.value)}
          onBlur={(e) => formik.handleBlur(e)}
          rows={3}
          placeholder="ใส่รายละเอียดพรีเซลล์/เงื่อนไข/ข้อความ..."
        />
        {isTouched && errorMsg ? (
          <div className="invalid-feedback">{errorMsg}</div>
        ) : null}
      </div>

      {/* Delete Button */}
      <button
        type="button"
        className="delete-btn"
        onClick={() => onRemove(index)}
        aria-label="ลบรายการพรีเซลล์"
      >
        <BsTrash3Fill size={18} />
      </button>
    </div>
  );
}

// ---------------------- Main Form List ----------------------
interface PreSellItemsFormProps {
  label: string;
  formik: ReturnType<typeof useFormik<any>>;
  fieldName: string; // e.g. "preSellItems"
}

export default function PreSellItemsForm({
  formik,
  fieldName,
  label,
}: PreSellItemsFormProps) {
  const preSellItems: string[] = formik.values[fieldName] || [];

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    const updated = [...preSellItems];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    formik.setFieldValue(fieldName, updated);
  };

  const moveItemDown = (index: number) => {
    if (index === preSellItems.length - 1) return;
    const updated = [...preSellItems];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    formik.setFieldValue(fieldName, updated);
  };

  const removeItem = (index: number) => {
    const updated = [...preSellItems];
    updated.splice(index, 1);
    formik.setFieldValue(fieldName, updated);
  };

  const addItem = () => {
    formik.setFieldValue(fieldName, [...preSellItems, '']);
  };

  return (
    <div className="form-group">
      <label className="form-label fw-bold mb-3">{label}</label>

      <div className="image-list">
        {preSellItems.length > 0 ? (
          preSellItems.map((item, index) => (
            <PreSellItem
              key={`${fieldName}-${index}`}
              index={index}
              preSellItem={item}
              formik={formik}
              fieldPath={`${fieldName}[${index}]`}
              onRemove={removeItem}
              onMoveUp={() => moveItemUp(index)}
              onMoveDown={() => moveItemDown(index)}
              isFirst={index === 0}
              isLast={index === preSellItems.length - 1}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>ยังไม่มีรายการพรีเซลล์</p>
            <p>คลิก "เพิ่มรายการ" เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn fw-bold rounded px-4 border-0 w-100 mt-3"
        style={{ backgroundColor: '#16DBCC', color: 'white' }}
        onClick={addItem}
      >
        เพิ่มรายการ
      </button>
    </div>
  );
}
