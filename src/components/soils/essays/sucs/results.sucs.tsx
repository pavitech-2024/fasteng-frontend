import useSucsStore from '@/stores/soils/sucs/sucs.store';
import Result_Card, { Result_CardContainer } from '../../../atoms/containers/result-card';
import { t } from 'i18next';
import FlexColumnBorder from '../../../atoms/containers/flex-column-with-border';
import ExperimentResume, { ExperimentResumeData } from '../../../molecules/boxes/experiment-resume';
import { EssayPageProps } from '../../../templates/essay';
import ResultSubTitle from '../../../atoms/titles/result-sub-title';
import showDefinition from './classification.sucs';
import { Typography } from '@mui/material';

const SUCS_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
    nextDisabled && setNextDisabled(false);
    const { results: sucs_results, generalData } = useSucsStore();

    const data = {
        // container "Resultados"
        container_other_data: []
    };

    if (sucs_results) {
        data.container_other_data.push(
            { label: "CC", value: sucs_results.cc, unity: '' },
            { label: "CNU", value: sucs_results.cnu, unity: '' },
            { label: "IP", value: sucs_results.ip, unity: '%' },
        );
        console.log(sucs_results)
    }

    // criando o objeto que será passado para o componente ExperimentResume
    const experimentResumeData: ExperimentResumeData = {
        experimentName: generalData.name,
        materials: [{ name: generalData.sample.name, type: generalData.sample.type }],
    };

    return (
        <>
            <ExperimentResume data={experimentResumeData} />
            <FlexColumnBorder title={t('results')} open={true}>
                <ResultSubTitle title={t('sucs.classification') + ': ' + sucs_results.classification} sx={{ margin: '.65rem' }} />
                <Typography
                variant="body1"
                sx={{ margin: '.65rem', mb: '2rem', fontWeight: '500', textAlign: 'justify', lineHeight: '1.2rem' }}
                >
                {showDefinition(sucs_results.classification)}
                </Typography>
                <Result_CardContainer hideBorder title={t('sucs.other-data')} mt='none'>
                    {data.container_other_data.map((item, index) => (
                        <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
                    ))}
                </Result_CardContainer>
            </FlexColumnBorder>
        </>
    );
};

export default SUCS_Results;
