/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompressionIcon } from "@/assets";
import { IEssayService } from "@/interfaces/common/essay/essay-service.interface";
import { t } from "i18next";

class COMPRESSION_SERVICE implements IEssayService {
  info = {
    key: 'cbr',
    icon: CompressionIcon,
    title: t('soils.essays.compression'),
    path: '/soils/essays/compression',
    steps: 4,
    backend_path: 'soils/essays/compression',
    standard: {
      name: 'DNIT 164/2013 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_164_2013_me.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('hygroscopic humidity'), path: 'hygroscopic-humidity' }, // Umidade higroscópica
      { step: 2, description: t('humidity determination'), path: 'humidity-determination' }, // Determinação da umidade
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  handleNext(step: number, data: unknown): void {
    throw new Error("Method not implemented.");
  }
}

export default COMPRESSION_SERVICE;