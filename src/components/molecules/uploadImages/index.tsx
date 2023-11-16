/* eslint-disable @next/next/no-img-element */
import CameraIcon from '@/components/atoms/icons/cameraIcon';
import TrashIcon from '@/components/atoms/icons/trashIcon';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IImages {
  editarImages?: string[];
  onImagesUpdate: (updatedImages: string[]) => void;
}

const UploadImages = ({ editarImages, onImagesUpdate }: IImages) => {
  const [images, setImages] = useState<any[]>(editarImages || []);

  useEffect(() => {
    onImagesUpdate(images.map((image) => image.src));
  }, [images, onImagesUpdate]);

  useEffect(() => {
    if (editarImages) {
      setImages(editarImages.map((src) => ({ src, id: uuidv4() })));
    }
  }, [editarImages]);

  const handleAddImage = (event: any) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 20) {
      alert('Você pode adicionar no máximo 20 imagens');
      return;
    }

    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, { src: reader.result, id: uuidv4() }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
      <label
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.2rem' }}
        htmlFor="uploadImages"
      >
        <CameraIcon />
        <span style={{ fontFamily: 'roboto', fontSize: 'bold' }}>Adicionar Fotos</span>
      </label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webm"
        multiple
        onChange={handleAddImage}
        style={{ display: 'hidden' }}
        id="uploadImages"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        {images.map((image, index) => (
          <Image
            key={image.id ? image.id : `${image}-${index}`}
            id={image.id}
            src={image.src}
            index={index}
            onRemove={handleRemoveImage}
            alt={''}
          />
        ))}
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
      <div
        style={{ display: 'absolute', top: '0', right: '0', cursor: 'pointer' }}
        onClick={() => onRemove(id)}
      >
        <TrashIcon />
      </div>
    </div>
  );
};

export default UploadImages;
