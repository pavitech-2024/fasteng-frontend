import { Button } from "@mui/material";
import { useRef } from "react";

const ImgFileInput = ({ onFileChange, file }) => {
  const fileInputRef = useRef(null);
  const selectedFileName = file.name;

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileData = {
        name: file.name,
        src: reader.result,
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
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {selectedFileName && <p style={{ marginTop: '8px' }}>Arquivo selecionado: {selectedFileName}</p>}
    </div>
  );
};

export default ImgFileInput;