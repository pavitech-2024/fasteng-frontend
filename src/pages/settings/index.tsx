import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useAuth from '@/contexts/auth';
import { Avatar, Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import Header from '@/components/organisms/header';
import i18next, { t } from 'i18next';
import ModalBase from '@/components/molecules/modals/modal';
import DropDown from '@/components/atoms/inputs/dropDown';
import { toBase64 } from '../../utils/format';
import { toast } from 'react-toastify';
import Api from '../../api';
import { DeleteIcon } from '../../assets';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import UploadIcon from '@mui/icons-material/Upload';
import { TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import { nameMask } from '@/utils/masks/nameMask/nameMask.mask';
import { phoneMask } from '@/utils/masks/phoneMask/phoneMask.mask';
import { validateEmail } from '@/utils/validators/emailValidator';
import { validateName } from '@/utils/validators/nameValidator';
import { validatePhone } from '@/utils/validators/phoneValidator';
import { fontGrid } from '@mui/material/styles/cssUtils';
import Cookies from 'js-cookie';

export const getStaticProps = async () => {
  const avatares: string[] = [
    //'https://thumbs.dreamstime.com/z/vetor-de-%C3%ADcone-perfil-do-avatar-padr%C3%A3o-foto-usu%C3%A1rio-m%C3%ADdia-social-183042379.jpg',
  ];

  return {
    props: {
      avatares,
    },
  };
};

interface SettingsProps {
  avatares: string[];
}

const Settings: NextPage = ({ avatares }: SettingsProps) => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
  });

  useEffect(() => {
    if (user?.dob) {
      setDob(user.dob);
    }
  }, [user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  const onSaveUser = async () => {
    setErrors({ name: '', email: '', phone: '', dob: '' });

    const newErrors = {
      name: '',
      email: '',
      phone: '',
      dob: '',
    };

    if (!name) {
      newErrors.name = t('settings.errors.emptyName');
    } else if (!validateName(name)) {
      newErrors.name = t('settings.errors.invalidName');
    }

    if (!email) {
      newErrors.email = t('settings.errors.emptyEmail');
    } else if (!validateEmail(email)) {
      newErrors.email = t('settings.errors.invalidEmail');
    }

    if (!phone) {
      newErrors.phone = t('settings.errors.emptyPhone');
    } else if (!validatePhone(phone)) {
      newErrors.phone = t('settings.errors.invalidPhone');
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error(t('settings.toast.submitError'));
      return;
    }

    try {
      const updatedUser = { ...user, name, email, phone, dob };
      const response = await Api.put(`users/${user._id}`, updatedUser);

      setUser({ ...user, ...response.data });
      toast.success(t('settings.toast.success'));
    } catch (error) {
      toast.error(t('settings.toast.error'));
    }
  };

  const onDeleteUser = async () => {
    try {
      await Api.delete(`users/${user._id}`);
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const [open, setOpen] = useState(false);
  const [oldPhoto, setOldPhoto] = useState<string | null>(user?.photo);

  const LanguageOptions = [
    { label: t('settings.language.en'), value: 'en' },
    { label: t('settings.language.ptbr'), value: 'ptbr' },
  ];

  const DecimalOptions = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];

  const onSubmitPhoto = async (avatar: string | File | null) => {
    try {
      if (typeof avatar === 'string') return setUser({ ...user, photo: avatar });

      if (avatar === null) return setUser({ ...user, photo: null });
      else
        await toBase64(avatar).then((res) => {
          if (typeof res === 'string') setUser({ ...user, photo: res });
        });
    } catch (error) {}
  };

  const onSavePreferences = async () => {
    try {
      const response = await Api.put(`users/${user._id}`, user);

      await setOldPhoto(response.data.photo);
      await setUser({ ...user, photo: response.data.photo, preferences: response.data.preferences });
    } catch (error) {
      throw error;
    }
  };

  return (
    <Container>
      <ModalBase
        open={open}
        title={t('settings.changeAvatar')}
        leftButtonTitle={t('cancel')}
        rightButtonTitle={t('submit')}
        onCancel={() => {
          setUser({ ...user, photo: oldPhoto });
          setOpen(false);
        }}
        onSubmit={() => setOpen(false)}
        size="small"
      >
        <Box
          sx={{
            width: '99%',
            height: '200px',
            border: '1px solid #121212',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 100px)',
            gridTemplateRows: 'repeat(auto-fill, 100px)',
            gap: '1px',
            p: '1rem 0',
            overflow: 'auto',
            placeContent: 'start center',
          }}
        >
          <IconButton
            sx={{ p: 0, ':hover': { opacity: 0.8, cursor: 'pointer' } }}
            onClick={() => {
              setOldPhoto(user?.photo);
              onSubmitPhoto(null);
            }}
            size="large"
          >
            <DeleteIcon color="error" sx={{ width: '80px', height: '80px' }} />
          </IconButton>
          {avatares.map((avatar: string) => {
            return (
              <IconButton
                key={avatar}
                sx={{ p: 0, ':hover': { opacity: 0.8, cursor: 'pointer' } }}
                onClick={() => onSubmitPhoto(avatar)}
                size="large"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="avatar" src={avatar} width={98} height={98} />
              </IconButton>
            );
          })}
        </Box>
        <Button
          component="label"
          sx={{ mt: '1rem', color: 'secondaryTons.red' }}
          startIcon={<DeleteIcon />}
          onClick={() => {
            setOldPhoto(user?.photo);
            onSubmitPhoto(null);
          }}
        >
          Apagar foto atual
        </Button>
        <Button component="label" sx={{ mt: '1rem' }} startIcon={<UploadIcon />}>
          {t('settings.upload')}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              toast.promise(async () => await onSubmitPhoto(e.target.files[0]), {
                pending: t('settings.toast loading'),
                success: t('settings.toast success'),
                error: t('settings.toast error'),
              })
            }
          />
        </Button>
      </ModalBase>
      <Header title={t('settings')} />
      <Box
        sx={{
          width: { mobile: '100%', notebook: '80%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '4vh',
        }}
      >
        <Typography
          sx={{
            width: { mobile: '85%', notebook: '100%' },
            fontSize: { mobile: '1.25rem', notebook: '1.75rem' },
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'primaryTons.lightGray',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {t('settings.account')}
        </Typography>
        <Box
          sx={{
            width: { mobile: '70%', notebook: '80%' },
            display: 'flex',
            m: '2vh 0 4vh',
          }}
        >
          <Tooltip title={t('settings.changeAvatar')}>
            <IconButton sx={{ p: 0, ml: '60px' }} onClick={() => setOpen(true)} size="large">
              <Avatar
                alt="user photo"
                src={user?.photo}
                sx={{
                  height: '90px',
                  width: '90px',
                  transition: 'all .3s ease-in-out',
                  zIndex: 3,
                  ':hover': { opacity: 0.8 },
                }}
              />
              <Box
                sx={{
                  height: '100px',
                  width: '100px',
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  position: 'absolute',
                  zIndex: 2,
                }}
              />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              p: '0 24px 0 64px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'primaryTons.lightGray',
              borderRadius: '10px',
              transform: 'translateX(-50px)',
              zIndex: 1,
              height: 'calc(100px - 2rem)',
              minWidth: '220px',
              marginTop: '10px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontSize: { mobile: '14px', notebook: '20px' },
              }}
            >
              {user?.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'white', fontSize: { mobile: '12px', notebook: '16px' } }}>
              {user?.planName}
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            width: { mobile: '85%', notebook: '100%' },
            fontSize: { mobile: '1.25rem', notebook: '1.75rem' },
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'primaryTons.lightGray',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {t('settings.personal')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: { mobile: '85%', notebook: '70%' },
          }}
        >
          <Box>
            <TextField
              label="Nome"
              variant="standard"
              fullWidth
              required
              type="text"
              value={nameMask(name)}
              onChange={(e) => setName(e.target.value)}
              sx={{
                height: '50px',
              }}
            />
            {errors.name && (
              <Box component="span" sx={{ color: 'red', fontSize: '12px' }}>
                {errors.name}
              </Box>
            )}
          </Box>

          <Box>
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                height: '50px',
              }}
            />
            {errors.email && (
              <Box component="span" sx={{ color: 'red', fontSize: '12px' }}>
                {errors.email}
              </Box>
            )}
          </Box>

          <Box>
            <TextField
              label="Telefone"
              variant="standard"
              fullWidth
              value={phoneMask(phone)}
              onChange={handlePhoneChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{
                height: '60px',
              }}
            />
            {errors.phone && (
              <Box component="span" sx={{ color: 'red', fontSize: '12px' }}>
                {errors.phone}
              </Box>
            )}
          </Box>

          <TextField
            label="Data de Nascimento"
            variant="standard"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            error={!!errors.dob}
            helperText={errors.dob}
          />
        </Box>

        <Typography
          sx={{
            width: { mobile: '85%', notebook: '100%' },
            fontSize: { mobile: '1.25rem', notebook: '1.75rem' },
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'primaryTons.lightGray',
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '2rem',
            paddingBottom: '1rem',
          }}
        >
          {t('settings.preferences')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            width: { mobile: '70%', notebook: '80%' },
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            m: '2vh 0 4vh',
          }}
        >
          <DropDown
            label={t('settings.language.label')}
            options={LanguageOptions}
            size="medium"
            sx={{ minWidth: '150px', width: '30%', bgcolor: 'primaryTons.white', ml: 5 }}
            value={user?.preferences.language === 'en' ? LanguageOptions[0] : LanguageOptions[1]}
            callback={(value: string) => {
              i18next.changeLanguage(value);
              setUser({ ...user, preferences: { ...user.preferences, language: value } });
            }}
          />
          <DropDown
            label={t('settings.decimal.label')}
            options={DecimalOptions}
            size="medium"
            sx={{ minWidth: '150px', width: '30%', bgcolor: 'primaryTons.white', ml: 5 }}
            value={DecimalOptions[user?.preferences.decimal - 1]}
            callback={(value: number) => {
              setUser({ ...user, preferences: { ...user.preferences, decimal: value } });
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '80%' }}>
          <Button variant="contained" color="primary" onClick={onSaveUser} sx={{}}>
            Salvar Alterações
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={onDeleteUser}
            sx={{
              backgroundColor: '#b22222',
              color: 'white',
              position: 'relative',
              left: 'auto',
              width: 'auto',
              marginLeft: 'auto',
            }}
          >
            Excluir Usuário
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
export default Settings;
