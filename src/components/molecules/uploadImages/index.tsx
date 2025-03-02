import TrashIcon from '@/components/atoms/icons/trashIcon';
import { AddAPhoto } from '@mui/icons-material';
import { Box, Button, CardMedia } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

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

  const handleAddImage = async (event: any) => {
    const files = event.target.files;

    if (files.length === 0) {
      toast.error(t('upload.error.noFileSelected'));
      return;
    }

    if (files.length > 1 || images) {
      toast.error(t('upload.error.maxImages'));
      return;
    }

    if (images) {
      toast.error(t('upload.error.alreadyUploaded'));
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(files[0].type)) {
      toast.error(t('upload.error.invalid-type'));
      return;
    }

    const file = files[0];

    const maxSizeMB = 3;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t('upload.error.fileTooLarge', { maxSizeMB }));
      return;
    }

    // Compression configuration
    const options = {
      maxSizeMB: 3,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(reader.result);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error(t('upload.error.compression-error'));
    }
  };

  const handleRemoveImage = () => {
    setImages(null);

    const fileInput = document.getElementById('uploadImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '4rem',
        gap: '2rem',
        justifyContent: 'center',
        placeItems: 'center',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}
      >
        {images && (
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              width: '45%',
            }}
          >
            <CardMedia
              component="img"
              image={images}
              alt=""
              sx={{
                maxWidth: '100%',
                border: '5px solid',
                borderColor: 'primary.main',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              }}
            />
            <Box
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                cursor: 'pointer',
                zIndex: 9,
                '&:hover': {
                  transform: 'scale(1.2)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <TrashIcon />
            </Box>
          </Box>
        )}
      </Box>
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
            id="uploadImages"
          />
        </Button>
      </label>
    </div>
  );
};

export default UploadImages;
