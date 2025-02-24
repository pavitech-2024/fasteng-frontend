import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';

const FileInput = ({ onFileChange }) => {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
    setSelectedFileName(file.name);
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
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {selectedFileName && <p style={{ marginTop: '8px' }}>Arquivo selecionado: {selectedFileName}</p>}
    </div>
  );
};

export default FileInput;
