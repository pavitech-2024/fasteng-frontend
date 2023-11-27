import samplesService from "@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const SpecificSample_BinderAsphaltConcrete = () => {

  const [samples, setSamples] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const query = router.query as any;
  console.log("🚀 ~ file: [id].tsx:12 ~ SpecificSample ~ id:", query.id)

  useEffect(() => {
    console.log("🚀 ~ file: [id].tsx:17 ~ SpecificSample ~ samples:", samples)
  }, [samples])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await samplesService.getSample(query.id);
        setSamples(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
      }
    };

    fetchData(); // Chame a função fetchData aqui

    console.log("🚀 ~ file: [id].tsx:17 ~ SpecificSample ~ samples:", samples);
  }, [query.id])
  

  return (
    <div>Teste sfgzsrfsdfsdfsdfsdfsd</div>
  )
}

export default SpecificSample_BinderAsphaltConcrete