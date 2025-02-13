/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import CameraIcon from '@/components/atoms/icons/cameraIcon';
import TrashIcon from '@/components/atoms/icons/trashIcon';
import { AddAPhoto } from '@mui/icons-material';
import { Button, Input } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';

interface IImages {
  editarImages?: string;
  onImagesUpdate: (updatedImages: string) => void;
}

const UploadImages = ({ editarImages, onImagesUpdate }: IImages) => {
  const [images, setImages] = useState<any>(editarImages || '');

  useEffect(() => {
    onImagesUpdate(images);
  }, [images, onImagesUpdate]);

  useEffect(() => {
    if (editarImages) {
      setImages(editarImages);
    }
  }, [editarImages]);

  const handleAddImage = (event: any) => {
    const files = event.target.files;

    if (files.length === 0) {
      return;
    }

    if (files.length > 1 || images) {
      alert('Você só pode adicionar uma imagem');
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImages(null);

    const fileInput = document.getElementById('uploadImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4rem' }}>
      <label
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem' }}
        htmlFor="uploadImages"
      >
        <Button variant="contained" component="label" startIcon={<AddAPhoto />}>
          {' '}
          {t('upload.images')}
          <input
            type="file"
            onChange={handleAddImage}
            multiple={false}
            hidden
            accept=".jpg,.jpeg,.png,.webm"
            id='uploadImages'
          />
        </Button>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {images && (
          <Image
            key={images.id ? images.id : `${images}`}
            id={images.id}
            src={images}
            index={0}
            onRemove={handleRemoveImage}
            alt={''}
          />
        )}
      </div>
    </div>
  );
};
interface ImageProps {
  id: string;
  src: string;
  index: number;
  onRemove: (id: string) => void;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ id, src, onRemove, alt }) => {
  return (
    <div style={{ display: 'relative', padding: '1rem', marginTop: '1rem' }}>
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '10rem', height: '12rem', objectFit: 'cover' }}
        width={'260px'}
        height={'100px'}
      />
      <div style={{ display: 'absolute', top: '0', right: '0', cursor: 'pointer' }} onClick={() => onRemove(id)}>
        <TrashIcon />
      </div>
    </div>
  );
};

export default UploadImages;
