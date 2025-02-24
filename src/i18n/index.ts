// i18n é a biblioteca que vamos utilizar para traduzir o nosso app
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// login
import loginPTBR from './translations/login/ptbr.json';
import loginENG from './translations/login/en.json';
// home
import homePTBR from './translations/home/ptbr.json';
import homeENG from './translations/home/en.json';
// topbar
import topbarPTBR from './translations/topbar/ptbr.json';
import topbarENG from './translations/topbar/en.json';
//footer
import footerPTBR from './translations/footer/ptbr.json';
import footerENG from './translations/footer/en.json';
//navbar
import navbarPTBR from './translations/navbar/ptbr.json';
import navbarENG from './translations/navbar/en.json';
//settings
import settingsPTBR from './translations/settings/ptbr.json';
import settingsENG from './translations/settings/en.json';
//errors
import errorsPTBR from './translations/errors/ptbr.json';
import errorsENG from './translations/errors/en.json';

/** @templates */
import materialsPTBR from './translations/templates/materials/ptbr.json';
import materialsENG from './translations/templates/materials/en.json';

import welcomePTBR from './translations/templates/welcome/ptbr.json';
import welcomeENG from './translations/templates/welcome/en.json';

/**@asphalt */
// pdf
import asphaltPDFPTBR from './translations/asphalt/pdf/ptbr.json';
import asphaltPDFENG from './translations/asphalt/pdf/en.json';
import commmonPDFPTBR from './translations/asphalt/pdf/common/ptbr.json';
import commmonPDFENG from './translations/asphalt/pdf/common/en.json';
// materials
import asphaltMaterialsPTBR from './translations/asphalt/materials/ptbr.json';
import asphaltMaterialsENG from './translations/asphalt/materials/en.json';
// essays
import asphaltEssaysPTBR from './translations/asphalt/essays/ptbr.json';
import asphaltEssaysENG from './translations/asphalt/essays/en.json';
// rtcd
import rtcdPTBR from './translations/asphalt/essays/rtcd/ptbr.json';
import rtcdENG from './translations/asphalt/essays/rtcd/en.json';
// ddui
import asphaltDduiPTBR from './translations/asphalt/essays/ddui/ptbr.json';
import asphaltDduiENG from './translations/asphalt/essays/ddui/en.json';
// softeningPoint
import softeningPointPTBR from './translations/asphalt/essays/softeningPoint/ptbr.json';
import softeningPointENG from './translations/asphalt/essays/softeningPoint/en.json';
// sayboltFurol
import sayboltFurolPTBR from './translations/asphalt/essays/saybolt-furol/ptbr.json';
import sayboltFurolENG from './translations/asphalt/essays/saybolt-furol/en.json';
// viscosityRotational
import viscosityRotationalPTBR from './translations/asphalt/essays/viscosityRotational/ptbr.json';
import viscosityRotationalENG from './translations/asphalt/essays/viscosityRotational/en.json';
// sandEquivalent
import sandEquivalentPTBR from './translations/asphalt/essays/sandEquivalent/ptbr.json';
import sandEquivalentENG from './translations/asphalt/essays/sandEquivalent/en.json';
// rtfo
import rtfoPTBR from './translations/asphalt/essays/rtfo/ptbr.json';
import rtfoENG from './translations/asphalt/essays/rtfo/en.json';
// adhesiveness
import adhesivenessPTBR from './translations/asphalt/essays/adhesiveness/ptbr.json';
import adhesivenessENG from './translations/asphalt/essays/adhesiveness/en.json';
// specifyMass
import specifyMassPTBR from './translations/asphalt/essays/specifyMass/ptbr.json';
import specifyMassENG from './translations/asphalt/essays/specifyMass/en.json';
// flashPoint
import flashPointPTBR from './translations/asphalt/essays/flashPoint/ptbr.json';
import flashPointENG from './translations/asphalt/essays/flashPoint/en.json';
// ductility
import ductilityPTBR from './translations/asphalt/essays/ductility/ptbr.json';
import ductilityENG from './translations/asphalt/essays/ductility/en.json';
// angularity
import angularityPTBR from './translations/asphalt/essays/angularity/ptbr.json';
import angularityENG from './translations/asphalt/essays/angularity/en.json';
// shapeIndex
import shapeIndexPTBR from './translations/asphalt/essays/shapeIndex/ptbr.json';
import shapeIndexENG from './translations/asphalt/essays/shapeIndex/en.json';
// elongatedParticles
import elongatedParticlesPTBR from './translations/asphalt/essays/elongatedParticles/ptbr.json';
import elongatedParticlesENG from './translations/asphalt/essays/elongatedParticles/en.json';
// granulometry
import asphaltGranulometryPTBR from './translations/asphalt/essays/granulometry/ptbr.json';
import asphaltGranulometryENG from './translations/asphalt/essays/granulometry/en.json';
// penetration
import asphaltPenetrationPTBR from './translations/asphalt/essays/penetration/ptbr.json';
import asphaltPenetrationENG from './translations/asphalt/essays/penetration/en.json';
// elasticRecovery
import asphaltElasticRecoveryPTBR from './translations/asphalt/essays/elasticRecovery/ptbr.json';
import asphaltElasticRecoveryENG from './translations/asphalt/essays/elasticRecovery/en.json';
// dosages
// marshall
import marshallPTBR from './translations/asphalt/dosages/marshall/ptbr.json';
import marshallENG from './translations/asphalt/dosages/marshall/en.json';
// superpave
import superpavePTBR from './translations/asphalt/dosages/superpave/ptbr.json';
import superpaveENG from './translations/asphalt/dosages/superpave/en.json';
// igg
import iggPTBR from './translations/asphalt/essays/igg/ptbr.json';
import iggENG from './translations/asphalt/essays/igg/en.json';
// fwd
import fwdPTBR from './translations/asphalt/essays/fwd/ptbr.json';
import fwdENG from './translations/asphalt/essays/fwd/en.json';
// superpave tooltips
import superpaveTooltipsPTBR from './translations/asphalt/dosages/tooltips/superpave/ptbr.json';
import superpaveTooltipsENG from './translations/asphalt/dosages/tooltips/superpave/en.json';

/**@soils */
// samples
import samplesPTBR from './translations/soils/samples/ptbr.json';
import samplesENG from './translations/soils/samples/en.json';
// essays
import soilsEssaysPTBR from './translations/soils/essays/ptbr.json';
import soilsEssaysENG from './translations/soils/essays/en.json';
// standards
import soilsStandardsPTBR from './translations/soils/standards/pt-br.json';
import soilsStandardsENG from './translations/soils/standards/en.json';
// cbr
import cbrPTBR from './translations/soils/essays/cbr/ptbr.json';
import cbrENG from './translations/soils/essays/cbr/en.json';
// hrb
import hrbPTBR from './translations/soils/essays/hrb/ptbr.json';
import hrbENG from './translations/soils/essays/hrb/en.json';
// sucs
import sucsPTBR from './translations/soils/essays/sucs/ptbr.json';
import sucsENG from './translations/soils/essays/sucs/en.json';
// granulometry
import soilsGranulometryPTBR from './translations/soils/essays/granulometry/ptbr.json';
import soilsGranulometryENG from './translations/soils/essays/granulometry/en.json';
// compression
import compressionPTBR from './translations/soils/essays/compression/ptbr.json';
import compressionENG from './translations/soils/essays/compression/en.json';

/**@concrete */
// essays
import concreteEssaysPTBR from './translations/concrete/essays/ptbr.json';
import concreteEssaysENG from './translations/concrete/essays/en.json';
// materials
import concreteMaterialsPTBR from './translations/concrete/materials/ptbr.json';
import concreteMaterialsENG from './translations/concrete/materials/en.json';
// standards
import concreteStandardsPTBR from './translations/concrete/standards/pt-br.json';
import concreteStandardsENG from './translations/concrete/standards/en.json';
//chapman
import chapmanPTBR from './translations/concrete/essays/chapman/ptbr.json';
import chapmanENG from './translations/concrete/essays/chapman/en.json';
// unit mass
import unitMassPTBR from './translations/concrete/essays/unitMass/ptbr.json';
import unitMassENG from './translations/concrete/essays/unitMass/en.json';
// sandIncrease
import sandIncreasePTBR from './translations/concrete/essays/sandIncrease/ptbr.json';
import sandIncreaseENG from './translations/concrete/essays/sandIncrease/en.json';
// granulometry
import concreteGranulometryPTBR from './translations/concrete/essays/granulometry/ptbr.json';
import concreteGranulometryENG from './translations/concrete/essays/granulometry/en.json';
// coarse aggregate
import coarseAggregatePTBR from './translations/concrete/essays/coarseAggregate/ptbr.json';
import coarseAggregateENG from './translations/concrete/essays/coarseAggregate/en.json';
// rc
import rcPTBR from './translations/concrete/essays/rc/ptbr.json';
import rcENG from './translations/concrete/essays/rc/en.json';
// rt
import rtPTBR from './translations/concrete/essays/rt/ptbr.json';
import rtENG from './translations/concrete/essays/rt/en.json';
// dosages
// abcp
import concreteABCPPTBR from './translations/concrete/dosages/abcp/ptbr.json';
import concreteABCPENG from './translations/concrete/dosages/abcp/en.json';

/**@common */
// essays
import commonEssaysPTBR from './translations/common/essays/ptbr.json';
import commonEssaysENG from './translations/common/essays/en.json';
// materials
import commonMaterialsPTBR from './translations/common/materials/ptbr.json';
import commonMaterialsENG from './translations/common/materials/en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'ptBR',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ptBR: {
      translation: {
        ...loginPTBR,
        ...homePTBR,
        ...topbarPTBR,
        ...navbarPTBR,
        ...settingsPTBR,
        ...footerPTBR,
        ...errorsPTBR,
        /**@templates */
        ...materialsPTBR,
        ...welcomePTBR,
        ...asphaltPDFPTBR,
        /**@asphalt */
        ...asphaltMaterialsPTBR,
        ...asphaltEssaysPTBR,
        ...rtcdPTBR,
        ...asphaltDduiPTBR,
        ...softeningPointPTBR,
        ...sayboltFurolPTBR,
        ...sandEquivalentPTBR,
        ...rtfoPTBR,
        ...adhesivenessPTBR,
        ...specifyMassPTBR,
        ...flashPointPTBR,
        ...ductilityPTBR,
        ...angularityPTBR,
        ...shapeIndexPTBR,
        ...elongatedParticlesPTBR,
        ...asphaltGranulometryPTBR,
        ...asphaltPenetrationPTBR,
        ...asphaltElasticRecoveryPTBR,
        ...marshallPTBR,
        ...superpavePTBR,
        ...iggPTBR,
        ...fwdPTBR,
        ...viscosityRotationalPTBR,
        ...superpaveTooltipsPTBR,
        ...superpaveTooltipsENG,
        /**@soils */
        ...samplesPTBR,
        ...soilsEssaysPTBR,
        ...cbrPTBR,
        ...hrbPTBR,
        ...sucsPTBR,
        ...soilsGranulometryPTBR,
        ...compressionPTBR,
        ...soilsStandardsPTBR,
        /**@concrete */
        ...concreteEssaysPTBR,
        ...concreteMaterialsPTBR,
        ...concreteStandardsPTBR,
        ...chapmanPTBR,
        ...unitMassPTBR,
        ...sandIncreasePTBR,
        ...concreteGranulometryPTBR,
        ...coarseAggregatePTBR,
        ...rcPTBR,
        ...rtPTBR,
        ...concreteABCPPTBR,
        ...concreteABCPPTBR,
        /**@common */
        ...commonEssaysPTBR,
        ...commonMaterialsPTBR,
        /**@pdf */
        ...commmonPDFPTBR,
      },
    },
    en: {
      translation: {
        ...loginENG,
        ...homeENG,
        ...topbarENG,
        ...navbarENG,
        ...settingsENG,
        ...footerENG,
        ...errorsENG,
        /**@templates */
        ...materialsENG,
        ...welcomeENG,
        ...asphaltPDFENG,
        /**@asphalt */
        ...asphaltMaterialsENG,
        ...asphaltEssaysENG,
        ...rtcdENG,
        ...asphaltDduiENG,
        ...softeningPointENG,
        ...sayboltFurolENG,
        ...sandEquivalentENG,
        ...rtfoENG,
        ...adhesivenessENG,
        ...specifyMassENG,
        ...flashPointENG,
        ...ductilityENG,
        ...angularityENG,
        ...shapeIndexENG,
        ...elongatedParticlesENG,
        ...asphaltGranulometryENG,
        ...asphaltPenetrationENG,
        ...asphaltElasticRecoveryENG,
        ...marshallENG,
        ...superpaveENG,
        ...iggENG,
        ...fwdENG,
        ...viscosityRotationalENG,
        /**@soils */
        ...samplesENG,
        ...soilsEssaysENG,
        ...cbrENG,
        ...hrbENG,
        ...sucsENG,
        ...soilsGranulometryENG,
        ...compressionENG,
        ...soilsStandardsENG,
        /**@concrete */
        ...concreteEssaysENG,
        ...concreteMaterialsENG,
        ...concreteStandardsENG,
        ...chapmanENG,
        ...unitMassENG,
        ...sandIncreaseENG,
        ...concreteGranulometryENG,
        ...coarseAggregateENG,
        ...rcENG,
        ...rtENG,
        ...concreteABCPENG,
        ...concreteABCPENG,
        /**@common */
        ...commonEssaysENG,
        ...commonMaterialsENG,
        /** @pdf */
        ...commmonPDFENG,
      },
    },
  },
});
