import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';

const useResetStores = () => {
  const resetGranulometryStore = useAsphaltGranulometryStore((state) => state.reset);

  return () => {
    resetGranulometryStore();
  };
};

export default useResetStores;
