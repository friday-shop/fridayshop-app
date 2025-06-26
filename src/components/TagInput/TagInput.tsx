import React, { useState } from 'react';
import type { FormikProps } from 'formik';
import './TagInput.css';

interface TagInputProps {
  label: string;
  name: string;
  formik: FormikProps<any>;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  name,
  formik,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const tags: string[] = formik.values[name] || [];

  const addTags = (newTags: string[]) => {
    const validNewTags = newTags
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag)); // กรอง tag ที่ไม่ซ้ำและไม่ว่าง

    if (validNewTags.length > 0) {
      formik.setFieldValue(name, [...tags, ...validNewTags]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // เพิ่ม Tag เมื่อกด Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (newTag) {
        if (tags.includes(newTag)) {
          // ถ้าซ้ำ ให้สั่น
          setIsDuplicate(true);
          setTimeout(() => setIsDuplicate(false), 600);
        } else {
          addTags([newTag]);
          setInputValue('');
        }
      }
    }

    // ลบ Tag สุดท้ายเมื่อกด Backspace ในช่อง input ที่ว่างอยู่
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault();
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    // เรียกใช้ onBlur ของ Formik เพื่อให้ validation ทำงาน
    formik.handleBlur({ target: { name } });

    // เพิ่ม Tag ที่ค้างอยู่ใน input เมื่อ focus หายไป
    const newTag = inputValue.trim();
    if (newTag) {
      addTags([newTag]);
      setInputValue('');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    // รองรับการวางแบบ comma-separated
    const pastedTags = pasteData.split(',').map((tag) => tag.trim());
    addTags(pastedTags);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    formik.setFieldValue(name, updatedTags);
  };

  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="form-group mb-3">
      <label htmlFor={name} className="form-label fw-bold">
        {label}
      </label>
      <div
        className={`tag-input-container form-control d-flex flex-wrap align-items-center gap-2 p-2 ${hasError ? 'is-invalid' : ''} ${isDuplicate ? 'shake' : ''}`}
        onClick={() => document.getElementById(name)?.focus()}
        style={{ minHeight: '40px' }} // ปรับความสูงขั้นต่ำให้สวยงาม
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="tag-badge badge rounded-pill d-flex align-items-center"
          >
            {tag}
            <button
              type="button"
              className="btn-close ms-2"
              aria-label={`Remove ${tag}`}
              onClick={(e) => {
                e.stopPropagation(); // ป้องกันไม่ให้ container's onClick ทำงาน
                handleRemoveTag(tag);
              }}
            ></button>
          </span>
        ))}
        <input
          id={name}
          name={name}
          type="text"
          value={inputValue}
          className="tag-input-field flex-grow-1"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>
      {hasError ? (
        <div className="invalid-feedback d-block">
          {formik.errors[name] as string}
        </div>
      ) : null}
    </div>
  );
};

export default TagInput;
