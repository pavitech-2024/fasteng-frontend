import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from '@/contexts/auth';
import { useMaterials } from '@/utils/hooks/asphalt/materials.hooks';
import samplesService from '@/services/soils/soils-samples.service';

jest.mock('@/contexts/auth');
jest.mock('@/services/soils/soils-samples.service');

const mockUser = { _id: 'user123' };
const mockMaterialResponse = {
  data: [
    { _id: 'material1', name: 'Material 1', type: 'inorganicSoil' },
    { _id: 'material2', name: 'Material 2', type: 'organicSoil' },
  ],
};

describe('useMaterials hook (soils)', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (samplesService.getSamplesByUserId as jest.Mock).mockResolvedValue(mockMaterialResponse);
    (samplesService.deleteSample as jest.Mock).mockResolvedValue({});
  });

  it('should load samples', async () => {
    const { result } = renderHook(() => useMaterials('soils'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.materials).toEqual(mockMaterialResponse.data);
  });

  it('should handle delete sample', async () => {
    const { result } = renderHook(() => useMaterials('soils'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleDeleteMaterial('material1');
    });

    expect(samplesService.deleteSample).toHaveBeenCalledWith('material1');
  });

  it('should handle edit sample', async () => {
    const { result } = renderHook(() => useMaterials('soils'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleEditMaterial('material2');
    });

    expect(result.current.materialToEdit?._id).toBe('material2');
    expect(result.current.isEdit).toBe(true);
    expect(result.current.openModal).toBe(true);
  });

  it('should handle addNewMaterial for soils sample', async () => {
    const { result } = renderHook(() => useMaterials('soils'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addNewMaterial();
    });

    expect(result.current.materials).toEqual(mockMaterialResponse.data);
  });
});
