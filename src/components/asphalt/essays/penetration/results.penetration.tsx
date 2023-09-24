import { EssayPageProps } from '@/components/templates/essay';

const Penetration_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  // const { results: granulometry_results, penetrationCalc, generalData } = usePenetrationStore();

  // criando o objeto que será passado para o componente ExperimentResume
  // const experimentResumeData: ExperimentResumeData = {
  //   experimentName: generalData.name,
  //   materials: [{ name: generalData.material.name, type: generalData.material.type }],
  // };

  return <>{/* <ExperimentResume data={experimentResumeData} /> */}</>;
};

export default Penetration_Results;
