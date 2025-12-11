import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Superpave_Step5_InitialBinder from '@/components/asphalt/dosages/superpave/step-5.superpave';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('@/services/asphalt/dosages/superpave/superpave.service');
jest.mock('@/stores/asphalt/superpave/superpave.store');
jest.mock('react-toastify', () => ({
  toast: {
    promise: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('i18next', () => ({
  t: (key: string) => key,
}));
jest.mock('@/contexts/auth', () => ({
  __esModule: true,
  default: () => ({
    user: { id: 'test-user-id' },
  }),
}));

const mockSuperpaveService = new Superpave_SERVICE() as jest.Mocked<Superpave_SERVICE>;
const mockUseSuperpaveStore = useSuperpaveStore as jest.MockedFunction<typeof useSuperpaveStore>;

const mockSetData = jest.fn();

const initialStoreState = {
  generalData: {
    trafficVolume: '1.000.000',
  },
  granulometryEssayData: {
    materials: [
      { name: 'Agregado 1', type: 'Aggregate' },
      { name: 'Agregado 2', type: 'Aggregate' },
      { name: 'Ligante 1', type: 'asphaltBinder' },
    ],
  },
  granulometryCompositionData: {
    chosenCurves: ['lower', 'average'],
    percentageInputs: [
      { material_1: 50, material_2: 50 },
      { material_1: 40, material_2: 60 },
    ],
  },
  initialBinderData: {
    materials: [
      { name: 'Agregado 1', type: 'Aggregate', realSpecificMass: null, apparentSpecificMass: null, absorption: null },
      { name: 'Agregado 2', type: 'Aggregate', realSpecificMass: null, apparentSpecificMass: null, absorption: null },
      { name: 'Ligante 1', type: 'asphaltBinder', realSpecificMass: 1.03 },
    ],
    turnNumber: {
        initialN: 0,
        maxN: 0,
        projectN: 0,
        tex: ''
    }
  },
  setData: mockSetData,
};

describe('Superpave_Step5_InitialBinder', () => {
  let setNextDisabled: jest.Mock;

  beforeEach(() => {
    setNextDisabled = jest.fn();
    mockUseSuperpaveStore.mockReturnValue(initialStoreState);
    (toast.promise as jest.Mock).mockImplementation((promise) => promise());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('1. should disable the next button on initial render', () => {
    render(
      <Superpave_Step5_InitialBinder
        nextDisabled={true}
        setNextDisabled={setNextDisabled}
        superpave={mockSuperpaveService}
      />
    );
    expect(setNextDisabled).toHaveBeenCalledWith(true);
  });

  test('2. should enable the next button after filling the binder content', async () => {
    const user = userEvent.setup();

    // Mock service response
    mockSuperpaveService.calculateStep5Data.mockResolvedValue({
      granulometryComposition: [
        { curve: 'lower', combinedGsb: 2.7, combinedGsa: 2.8, gse: 2.9, percentsOfDosageWithBinder: [50, 50] },
        { curve: 'average', combinedGsb: 2.7, combinedGsa: 2.8, gse: 2.9, percentsOfDosageWithBinder: [40, 60] },
      ],
      turnNumber: { initialN: 8, maxN: 115, projectN: 75, tex: '1.000.000' },
    });

    render(
      <Superpave_Step5_InitialBinder
        nextDisabled={true}
        setNextDisabled={setNextDisabled}
        superpave={mockSuperpaveService}
      />
    );
    
    // Test 1: Initially disabled
    expect(setNextDisabled).toHaveBeenCalledWith(true);
    
    // Step 1: Click confirm on the first modal
    const confirmMassesButton = screen.getByRole('button', { name: /Confirmar/i });
    await user.click(confirmMassesButton);

    await waitFor(() => {
        expect(mockSuperpaveService.calculateStep5Data).toHaveBeenCalled();
    });

    // It should still be disabled because binder content is not filled yet
    // The last call determines the state.
    expect(setNextDisabled).toHaveBeenLastCalledWith(true);

    // Step 2: Open the binder content modal
    const changeBinderButton = screen.getByRole('button', { name: /asphalt.dosages.superpave.change-initial-binder/i });
    await user.click(changeBinderButton);
    
    // Step 3: Fill binder content inputs
    const binderInputs = await screen.findAllByPlaceholderText(/asphalt.dosages.superpave.initial_binder/i);
    expect(binderInputs).toHaveLength(2); // For 'lower' and 'average' curves

    await user.type(binderInputs[0], '5');
    await user.type(binderInputs[1], '5.5');
    
    // Step 4: Confirm the binder content
    // The confirm button is in the modal, let's find it by its text
    const confirmBinderButton = screen.getAllByRole('button', { name: /Confirmar/i }).find(btn => btn.closest('.MuiModal-root'));
    await user.click(confirmBinderButton);

    // After confirming, the `useEffect` should run and call setNextDisabled(false)
    await waitFor(() => {
        expect(setNextDisabled).toHaveBeenLastCalledWith(false);
    });
  });
});
