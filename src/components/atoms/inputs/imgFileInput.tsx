import { Button } from '@mui/material';
import { useRef } from 'react';

interface FileData {
  name: string | null;
  src: string | null;
}

interface ImgFileInputProps {
  onFileChange: (file: { name: string; src: string }) => void;
  file: FileData;
}

const ImgFileInput = ({ onFileChange, file }: ImgFileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileName = file?.name;

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileData = {
        name: file.name,
        src: reader.result as string,
      };
      onFileChange(fileData);
    };
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        variant="contained"
        onClick={handleButtonClick}
        sx={{
          width: '15rem',
          backgroundColor: '#f29134',
          color: 'white',
          fontWeight: '600',
        }}
      >
        Escolher arquivo
      </Button>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      {selectedFileName && <p style={{ marginTop: '8px' }}>Arquivo selecionado: {selectedFileName}</p>}
    </div>
  );
};

export default ImgFileInput;
