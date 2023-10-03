import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useDuctilityStore from '@/stores/asphalt/ductility/ductility.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const Ductility_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
    const { step2Data: data, setData } = useDuctilityStore();

    if (
        nextDisabled &&
        (data.first_rupture_length ||
        data.second_rupture_length ||
        data.third_rupture_length)
    ) setNextDisabled(false);

    return (
        <Box>
            <Box
                key={'top'}
                sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
                    gap: '10px',
                    mt: '20px',
                }}
            >
                <InputEndAdornment
                    label={t('ductility.first_rupture_length')}
                    value={data.first_rupture_length}
                    onChange={(e) => {
                        if (e.target.value === null) return;
                        setData({ step: 1, key: 'first_rupture_length', value: Number(e.target.value) });
                    }}
                    adornment={'mm'}
                    type="number"
                    inputProps={{ min: 0 }}
                    required
                />
                <InputEndAdornment
                    label={t('ductility.second_rupture_length')}
                    value={data.second_rupture_length}
                    onChange={(e) => {
                        if (e.target.value === null) return;
                        setData({ step: 1, key: 'second_rupture_length', value: Number(e.target.value) });
                    }}
                    adornment={'mm'}
                    type="number"
                    inputProps={{ min: 0 }}
                    required
                />
                <InputEndAdornment
                    label={t('ductility.third_rupture_length')}
                    value={data.third_rupture_length}
                    onChange={(e) => {
                        if (e.target.value === null) return;
                        setData({ step: 1, key: 'third_rupture_length', value: Number(e.target.value) });
                    }}
                    adornment={'mm'}
                    type="number"
                    inputProps={{ min: 0 }}
                    required
                />
            </Box>
        </Box>
    );
};

export default Ductility_Step2;
