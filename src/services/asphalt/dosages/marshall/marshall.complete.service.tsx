// src/services/asphalt/dosages/marshall/marshall-complete.service.ts
import Api from '@/api';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';

const marshallCompleteService = {
  /**
   * Salva uma dosagem completa de uma vez só
   * @param userId ID do usuário
   * @param completeData Dados completos da dosagem (igual ao MarshallData)
   */
  saveCompleteDosage: (userId: string, completeData: MarshallData) => 
    Api.post(`asphalt/dosages/marshall/complete/${userId}`, completeData),

  /**
   * Busca uma dosagem completa por ID
   */
  getCompleteDosage: (dosageId: string, userId: string) => 
    Api.get(`asphalt/dosages/marshall/complete/${dosageId}/${userId}`),

  /**
   * Lista todas as dosagens do usuário (apenas resumo)
   */
  listUserDosages: (userId: string) => 
    Api.get(`asphalt/dosages/marshall/list/${userId}`),
};

export default marshallCompleteService;