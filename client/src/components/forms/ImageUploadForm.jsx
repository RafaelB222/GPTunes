import { useState, useEffect } from 'react';

export default function ImageUploadForm({ selectedFile, handleFileInputChange, currentImage }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    handlePreview();
  }, [selectedFile]);

  useEffect(() => {
    if (currentImage) {
      setPreviewUrl(currentImage);
    }
  }, [currentImage]);

  const handlePreview = () => {
    if (!selectedFile) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  return (
    <>
      <div className='w-full bg-white p-3 rounded-lg border-2 border-gray-200'>
        <input type='file' name='image' accept='image/*' onChange={handleFileInputChange} />
      </div>
      {previewUrl ? (
        <div className='flex justify-center items-center'>
          {selectedFile ? 'Preview:' : 'Current image:'}
          {previewUrl && <img src={previewUrl} alt='preview' className='max-h-32 p-4' />}
        </div>
      ) : null}
    </>
  );
}
