import Compression_GeneralData from "@/components/soils/essays/compression/general-data.compression";
import COMPRESSION_SERVICE from "@/services/soils/essays/compression/compression.service";
import useCompressionStore, { CompressionActions } from "@/stores/soils/compression/compression.store";
import useAuth from '@/contexts/auth';
import EssayTemplate from '@/components/templates/essay';
import Compression_Step2 from "@/components/soils/essays/compression/step2.compression";
import Compression_Step3 from "@/components/soils/essays/compression/step3.compression";
import Compression_Results from "@/components/soils/essays/compression/results.compression";

const Compression = () => {
  const compression = new COMPRESSION_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useCompressionStore();

  compression.userId = userId;

  compression.store_actions = store as CompressionActions;

  const childrens = [
    { step: 0, children: <Compression_GeneralData compression={compression} />, data: store.compressionGeneralData },
     { step: 1, children: <Compression_Step2 />, data: store.hygroscopicData },
     { step: 2, children: <Compression_Step3 />, data: store.humidityDeterminationData },
     { step: 3, children: <Compression_Results />, data: store.results },
  ];

  return <EssayTemplate essayInfo={compression.info} nextCallback={compression.handleNext} childrens={childrens} />;

}

export default Compression;