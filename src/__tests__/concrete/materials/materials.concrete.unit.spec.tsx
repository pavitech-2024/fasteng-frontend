import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from '@/contexts/auth';
import concreteMaterialsService from '@/services/concrete/concrete-materials.service';
import { useMaterials } from '@/utils/hooks/asphalt/materials.hooks';

jest.mock('@/contexts/auth');
jest.mock('@/services/concrete/concrete-materials.service');

const mockUser = { _id: 'user123' };
const mockMaterialResponse = {
  data: [
    { _id: 'material1', name: 'Material 1', type: 'coarseAggregate' },
    { _id: 'material2', name: 'Material 2', type: 'cement' },
  ],
};

describe('useMaterials hook (concrete)', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (concreteMaterialsService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockMaterialResponse);
    (concreteMaterialsService.deleteMaterial as jest.Mock).mockResolvedValue({});
  });

  it('should load materials', async () => {
    const { result } = renderHook(() => useMaterials('concrete'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.materials).toEqual(mockMaterialResponse.data);
  });

  it('should handle delete material', async () => {
    const { result } = renderHook(() => useMaterials('concrete'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleDeleteMaterial('material1');
    });

    expect(concreteMaterialsService.deleteMaterial).toHaveBeenCalledWith('material1');
  });

  it('should handle edit material', async () => {
    const { result } = renderHook(() => useMaterials('concrete'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleEditMaterial('material2');
    });

    expect(result.current.materialToEdit?._id).toBe('material2');
    expect(result.current.isEdit).toBe(true);
    expect(result.current.openModal).toBe(true);
  });

  it('should handle addNewMaterial', async () => {
    const { result } = renderHook(() => useMaterials('concrete'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addNewMaterial();
    });

    expect(result.current.materials).toEqual(mockMaterialResponse.data);
  });
});
