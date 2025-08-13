import { renderHook, waitFor } from '@testing-library/react';
import { useState, useEffect } from 'react';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';

jest.mock('@/services/asphalt/asphalt-materials.service');
jest.mock('@/contexts/auth');

const mockUser = { _id: 'user123' };

const mockResponse = {
  data: [
    {
      materials: [{ _id: 'mat1', name: 'Material Teste', type: 'coarseAggregate' }],
      fwdEssays: [{ _id: 'fwd1', generalData: { name: 'FWD Teste', createdAt: '2025-07-15T00:00:00.000Z' } }],
      iggEssays: [{ _id: 'igg1', generalData: { name: 'IGG Teste', createdAt: '2025-07-15T00:00:00.000Z' } }],
      rtcdEssays: [],
      dduiEssays: [],
    },
  ],
};

function useMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const [fwdEssays, setFwdEssays] = useState([]);
  const [iggEssays, setIggEssays] = useState([]);
  const [rtcdEssays, setRtcdEssays] = useState([]);
  const [dduiEssays, setDduiEssays] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMaterials = async (userId: string) => {
    const response = await materialsService.getMaterialsByUserId(userId);
    setMaterials(response.data[0].materials);
    setFwdEssays(response.data[0].fwdEssays);
    setIggEssays(response.data[0].iggEssays);
    setRtcdEssays(response.data[0].rtcdEssays);
    setDduiEssays(response.data[0].dduiEssays);
    setLoading(false);
  };

  useEffect(() => {
    loadMaterials(user._id);
  }, []);

  return { materials, fwdEssays, iggEssays, rtcdEssays, dduiEssays, loading };
}

describe('useMaterials hook (unit test)', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (materialsService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('should fetch materials and update all states correctly', async () => {
    const { result } = renderHook(() => useMaterials());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(materialsService.getMaterialsByUserId).toHaveBeenCalledWith('user123');
    expect(result.current.materials).toEqual(mockResponse.data[0].materials);
    expect(result.current.fwdEssays).toEqual(mockResponse.data[0].fwdEssays);
    expect(result.current.iggEssays).toEqual(mockResponse.data[0].iggEssays);
    expect(result.current.rtcdEssays).toEqual(mockResponse.data[0].rtcdEssays);
    expect(result.current.dduiEssays).toEqual(mockResponse.data[0].dduiEssays);
  });
});