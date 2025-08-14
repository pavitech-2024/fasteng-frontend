import useAuth from "@/contexts/auth";
import { ConcreteMaterial } from "@/interfaces/concrete";
import concreteMaterialService from "@/services/concrete/concrete-materials.service";
import { renderHook, waitFor } from "@testing-library/react";
import { useState, useEffect, act } from "react";


jest.mock('@/services/concrete/concrete-materials.service');
jest.mock('@/contexts/auth');

const mockUser = { _id: 'user123' };
const mockMaterialResponse = {
  data: [
    { _id: 'material1', name: 'Material 1', type: 'inorganicSoil' },
    { _id: 'material2', name: 'Material 2', type: 'organicSoil' },
  ],
};

// Hook auxiliar para simular a lógica do componente que busca os Material
function useMaterial() {
  const { user } = useAuth();
  const [material, setMaterial] = useState<ConcreteMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    concreteMaterialService
      .getMaterialsByUserId(user._id)
      .then((res) => {
        setMaterial(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleDeleteMaterial = async (id: string) => {
    await concreteMaterialService.deleteMaterial(id);
    setMaterial((prev) => prev.filter((s) => s._id !== id));
  };

  return { material, loading, handleDeleteMaterial };
}

describe('useMaterial hook (unit test)', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (concreteMaterialService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockMaterialResponse);
    (concreteMaterialService.deleteMaterial as jest.Mock).mockResolvedValue({});
  });

  it('should fetch material and update state correctly', async () => {
    const { result } = renderHook(() => useMaterial());

    // Espera carregar os material
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(concreteMaterialService.getMaterialsByUserId).toHaveBeenCalledWith('user123');
    expect(result.current.material).toEqual(mockMaterialResponse.data);
  });

  it('should delete a material correctly', async () => {
    const { result } = renderHook(() => useMaterial());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleDeleteMaterial('material1');
    });

    await waitFor(() => {
      expect(result.current.material).toEqual([mockMaterialResponse.data[1]]);
    });
    expect(concreteMaterialService.deleteMaterial).toHaveBeenCalledWith('material1');
  });
});
