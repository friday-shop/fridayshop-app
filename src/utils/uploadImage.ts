import { axiosInstance } from '../hooks/useAxios';

export const uploadImage = async (type: 'slip' | 'common'): Promise<string> => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();
  const file = await new Promise<File | null>((resolve) => {
    fileInput.onchange = () => {
      resolve(fileInput.files ? fileInput.files[0] : null);
    };
  });
  if (!file) {
    throw new Error('No file selected');
  }
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post(`/files/upload/${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.status !== 201) {
    throw new Error('Failed to upload image');
  }
  return response.data;
};

export const uploadImageMultiple = async (
  type: 'slip' | 'common',
): Promise<string[]> => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.click();
  const files = await new Promise<FileList | null>((resolve) => {
    fileInput.onchange = () => {
      resolve(fileInput.files);
    };
  });
  if (!files || files.length === 0) {
    throw new Error('No files selected');
  }
  const uploadedUrls: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      `/files/upload/${type}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (response.status !== 200) {
      throw new Error('Failed to upload image');
    }
    uploadedUrls.push(response.data);
  }
  return uploadedUrls;
};
