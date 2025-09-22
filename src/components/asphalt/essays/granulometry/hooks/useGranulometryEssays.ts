// hooks/useGranulometryEssays.ts
import { useState, useEffect } from 'react';
import { GranulometryEssay } from '../types/asphalt-granulometry.types';
import AsphaltGranulometry_SERVICE from '@/services/asphalt/essays/granulometry/granulometry.service';
import useAuth from '@/contexts/auth';

export const useGranulometryEssays = () => {
  const { user } = useAuth();
  const [allEssays, setAllEssays] = useState<GranulometryEssay[]>([]);
  const [loadingEssays, setLoadingEssays] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const essaysPerPage = 5;

 // No hook useGranulometryEssays
useEffect(() => {
  const fetchAllEssays = async () => {
    try {
      const granulometryService = new AsphaltGranulometry_SERVICE();
      const response = await granulometryService.getAllEssaysByUser(user._id);
      console.log('Dados da API:', response); // 👈 ADICIONE ESTE LOG
      setAllEssays(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error('Erro ao buscar ensaios:', error);
      setAllEssays([]);
    } finally {
      setLoadingEssays(false);
    }
  };
  fetchAllEssays();
}, [user._id]);

  const indexOfLastEssay = currentPage * essaysPerPage;
  const indexOfFirstEssay = indexOfLastEssay - essaysPerPage;
  const currentEssays = allEssays.slice(indexOfFirstEssay, indexOfLastEssay);
  const totalPages = Math.ceil(allEssays.length / essaysPerPage);

  return {
    allEssays,
    currentEssays,
    loadingEssays,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};