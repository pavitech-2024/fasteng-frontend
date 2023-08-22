import { UnitMassIcon } from '@/assets';
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { UnitMassActions, UnitMassData } from '@/stores/concrete/unitMass/unitMass.store';
import Api from '@/api';

class UNITMASS_SERVICE implements IEssayService {
  info = {
    key: 'cbr',
    icon: UnitMassIcon,
    title: t('concrete.essays.unitMass'),
    path: '/concrete/essays/unitMass',
    steps: 3,
    backend_path: 'concrete/essays/unitMass',
    standard: {
      name: 'ABNT NM 45',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('unitMass.generalData'), path: 'general-data' },
      { step: 1, description: 'step 2', path: 'step2' },
      { step: 2, description: t('unitMass.result'), path: 'result' },
    ],
  };

  store_actions: UnitMassActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as UnitMassData['generalData']);
          break;
        case 1:
          //await this.submitStep2Data(data as UnitMassData['step2Data']);
          break;
        case 2:
          //const { result } = data as UnitMassData;
          break;
        case 3:
          //await this.saveEssay(data as UnitMassData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: UnitMassData['generalData']): Promise<void> => {
    try {
      const { experimentName, aggregate, method } = generalData;

      if (!experimentName) throw t('errors.empty-experimentName');
      if (!aggregate) throw t('errors.empty-aggregate');
      if (!method) throw t('errors.empty-method');

      const response = await Api.post(`${this.info.backend_path}/verify-init`, { experimentName, aggregate, method });
      
      const { success, error } = response.data;

      if (success === false) throw error.name;
    }
    catch (error) {
      throw error;
    }
  }
}

export default UNITMASS_SERVICE;
