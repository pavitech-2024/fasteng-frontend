import ModalBase from '@/components/molecules/modals/modal';
import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import Api from '@/api';

export interface IReportErrorProps {
  openModalProp: boolean;
}

export default function ReportError({ openModalProp }: IReportErrorProps) {
  const [openModal, setOpenModal] = useState(openModalProp);
  const [emailStatusMessage, setEmailStatusMessage] = useState('');

  const [modalValues, setModalValues] = useState({
    subject: '',
    contact: '',
    body: '',
    sender: '',
  });

  const getModalInput = () => {
    const modalInputs = [
      {
        label: 'assunto',
        key: 'subject',
        value: modalValues.subject,
      },
      {
        label: 'contato',
        key: 'contact',
        value: modalValues.contact,
      },
      {
        label: 'nome',
        key: 'sender',
        value: modalValues.sender,
      },
      {
        label: 'texto',
        key: 'body',
        value: modalValues.body,
      },
    ];
    return modalInputs;
  };

  useEffect(() => {
    setOpenModal(openModalProp);
  }, [openModalProp]);

  const handleReportErrorChange = (event: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    event.preventDefault();
    const input = event.target.value;
    setModalValues({ ...modalValues, [key]: input });
  };

  const handleSubmit = async () => {
    setEmailStatusMessage('Enviando...');

    try {
      const response = await Api.post('/report-error', modalValues);

      if (response.status === 201) {
        setEmailStatusMessage('Email enviado com sucesso');
        setModalValues({
          subject: '',
          contact: '',
          sender: '',
          body: '',
        });

        

        setTimeout(() => setOpenModal(false), 3000);
        setTimeout(() => setEmailStatusMessage(''));
      } else {
        setEmailStatusMessage('Ocorreu um erro ao enviar o email');
      }
    } catch (error) {
      setEmailStatusMessage(`Ocorreu um erro ao enviar o email: ${error.message}`);
    }
  };

  return (
    <ModalBase
      title={'Reportar Erro'}
      leftButtonTitle={'cancelar'}
      rightButtonTitle={'enviar'}
      onCancel={() => {
        setOpenModal(false);
        setModalValues({
          subject: '',
          contact: '',
          sender: '',
          body: '',
        });
      }}
      open={openModal}
      size={'medium'}
      onSubmit={handleSubmit}
      disableSubmit={
        modalValues.contact === '' || modalValues.body === '' || modalValues.sender === '' || modalValues.subject === ''
      }
    >
      <Box sx={{ mb: '1rem' }}>
        <Grid container spacing={2}>
          <Grid container item spacing={2}>
            {getModalInput().map((input) =>
              input.label !== 'texto' ? (
                <Grid item key={input.label} component="div" width={'inherit'}>
                  <TextField
                    label={input.label}
                    variant="standard"
                    value={input.value}
                    required
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleReportErrorChange(event, input.key)}
                    fullWidth
                  />
                </Grid>
              ) : null
            )}
          </Grid>
          <Grid container item>
            {getModalInput().map((input) =>
              input.label === 'texto' ? (
                <Grid item key={input.label} component="div" width={'inherit'}>
                  <TextField
                    label={input.label}
                    variant="standard"
                    value={input.value}
                    required
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleReportErrorChange(event, input.key)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
              ) : null
            )}
          </Grid>
        </Grid>

        {emailStatusMessage.length > 0 && (
          <Typography
            sx={{
              fontSize: '.9125rem',
              fontWeight: 700,
              lineHeight: '.9375rem',
              letterSpacing: '.03em',
              whiteSpace: 'nowrap',
              color: 'black',
              transition: 'color .5s ease-in-out',
              marginY: '.9125rem',
            }}
          >
            {emailStatusMessage}
          </Typography>
        )}
      </Box>
    </ModalBase>
  );
}
