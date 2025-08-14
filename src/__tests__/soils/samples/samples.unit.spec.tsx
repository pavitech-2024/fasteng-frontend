import { renderHook, waitFor, act } from '@testing-library/react';
import { useState, useEffect } from 'react';
import useAuth from '@/contexts/auth';
import samplesService from '@/services/soils/soils-samples.service';
import { SoilSample } from '@/interfaces/soils';

jest.mock('@/services/soils/soils-samples.service');
jest.mock('@/contexts/auth');

const mockUser = { _id: 'user123' };
const mockSamplesResponse = {
  data: [
    { _id: 'sample1', name: 'Sample 1', type: 'inorganicSoil' },
    { _id: 'sample2', name: 'Sample 2', type: 'organicSoil' },
  ],
};

// Hook auxiliar para simular a lógica do componente que busca os Samples
function useSamples() {
  const { user } = useAuth();
  const [samples, setSamples] = useState<SoilSample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    samplesService
      .getSamplesByUserId(user._id)
      .then((res) => {
        setSamples(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleDeleteSample = async (id: string) => {
    await samplesService.deleteSample(id);
    setSamples((prev) => prev.filter((s) => s._id !== id));
  };

  return { samples, loading, handleDeleteSample };
}

describe('useSamples hook (unit test)', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (samplesService.getSamplesByUserId as jest.Mock).mockResolvedValue(mockSamplesResponse);
    (samplesService.deleteSample as jest.Mock).mockResolvedValue({});
  });

  it('should fetch samples and update state correctly', async () => {
    const { result } = renderHook(() => useSamples());

    // Espera carregar os samples
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(samplesService.getSamplesByUserId).toHaveBeenCalledWith('user123');
    expect(result.current.samples).toEqual(mockSamplesResponse.data);
  });

  it('should delete a sample correctly', async () => {
    const { result } = renderHook(() => useSamples());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleDeleteSample('sample1');
    });

    await waitFor(() => {
      expect(result.current.samples).toEqual([mockSamplesResponse.data[1]]);
    });
    expect(samplesService.deleteSample).toHaveBeenCalledWith('sample1');
  });
});
