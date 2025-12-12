
import Superpave_Step7_FirstCompactionParams from '@/components/asphalt/dosages/superpave/step-7.superpave';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { render, screen, waitFor } from '@testing-library/react';
import { t } from 'i18next';

jest.mock('@/services/asphalt/dosages/superpave/superpave.service');
jest.mock('@/stores/asphalt/superpave/superpave.store');

const mockUseSuperpaveStore = useSuperpaveStore as jest.MockedFunction<typeof useSuperpaveStore>;

const mockSuperpaveService = new Superpave_SERVICE() as jest.Mocked<Superpave_SERVICE>;

const mockData = {
  generalData: {
    trafficVolume: '10^6',
  },
  firstCompressionParamsData: {
    table1: {
      nominalSize: '12.5',
      expectedPorcentageGmmInitialN: '< 89',
      expectedPorcentageGmmMaxN: '< 98',
      expectedPorcentageGmmProjectN: '96',
      expectedVam: '14',
    },
    table2: {
      lower: {
        percentageGmmInitialN: 88.1,
        percentageGmmProjectN: 95.1,
        percentageGmmMaxN: 97.1,
        porcentageVam: 14.1,
        ratioDustAsphalt: 1.1,
        specificMass: 2.451,
        percentWaterAbs: 0.51,
      },
      average: {
        percentageGmmInitialN: 88.2,
        percentageGmmProjectN: 95.2,
        percentageGmmMaxN: 97.2,
        porcentageVam: 14.2,
        ratioDustAsphalt: 1.2,
        specificMass: 2.452,
        percentWaterAbs: 0.52,
      },
      higher: {
        percentageGmmInitialN: 88.3,
        percentageGmmProjectN: 95.3,
        percentageGmmMaxN: 97.3,
        porcentageVam: 14.3,
        ratioDustAsphalt: 1.3,
        specificMass: 2.453,
        percentWaterAbs: 0.53,
      },
    },
    table3: {},
    table4: {},
    selectedCurve: null,
  },
  granulometryCompositionData: {},
  initialBinderData: {},
  firstCompressionData: {},
  setData: jest.fn(),
};

// Teste para validar a renderização dos parâmetros de primeira compactação
describe.skip('Superpave_Step7_FirstCompactionParams', () => {
  // Se quiser rodar o teste, remova o .skip acima
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSuperpaveStore.mockReturnValue(mockData);
    mockSuperpaveService.getStepFirstCurvePercentages.mockResolvedValue({
      data: mockData.firstCompressionParamsData,
      success: true,
      error: null,
    });
  });

  it('should render the first DataGrid with complete data from table1', async () => {
    render(
      <Superpave_Step7_FirstCompactionParams
        setNextDisabled={jest.fn()}
        superpave={mockSuperpaveService}
      />
    );

    await waitFor(() => {
      expect(mockSuperpaveService.getStepFirstCurvePercentages).toHaveBeenCalled();
    });

    const table1 = mockData.firstCompressionParamsData.table1;
    
    // Check header
    expect(screen.getByText(`Parâmteros para o nível de tráfego ${mockData.generalData.trafficVolume} e tamanho nominal máximo ${table1.nominalSize}`)).toBeInTheDocument();

    // Check row values
    expect(screen.getByText(table1.expectedPorcentageGmmInitialN)).toBeInTheDocument();
    expect(screen.getByText(table1.expectedPorcentageGmmMaxN)).toBeInTheDocument();
    expect(screen.getByText(table1.expectedPorcentageGmmProjectN)).toBeInTheDocument();
    expect(screen.getByText(table1.expectedVam)).toBeInTheDocument();
    expect(screen.getByText('0,6 - 1,2')).toBeInTheDocument();
  });

  it('should render the second DataGrid with complete data from table2', async () => {
    render(
      <Superpave_Step7_FirstCompactionParams
        setNextDisabled={jest.fn()}
        superpave={mockSuperpaveService}
      />
    );
    
    await waitFor(() => {
        expect(mockSuperpaveService.getStepFirstCurvePercentages).toHaveBeenCalled();
    });

    const table2 = mockData.firstCompressionParamsData.table2;

    // Check header
    expect(screen.getByText('Parâmteros calculados das curvas granulométricas')).toBeInTheDocument();

    // Check values for 'lower' curve
    expect(screen.getByText(table2.lower.percentageGmmInitialN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.lower.percentageGmmProjectN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.lower.percentageGmmMaxN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.lower.porcentageVam.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.lower.ratioDustAsphalt.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.lower.specificMass.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.lower.percentWaterAbs.toFixed(2))).toBeInTheDocument();

    // Check values for 'average' curve
    expect(screen.getByText(table2.average.percentageGmmInitialN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.average.percentageGmmProjectN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.average.percentageGmmMaxN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.average.porcentageVam.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.average.ratioDustAsphalt.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.average.specificMass.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.average.percentWaterAbs.toFixed(2))).toBeInTheDocument();

    // Check values for 'higher' curve
    expect(screen.getByText(table2.higher.percentageGmmInitialN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.higher.percentageGmmProjectN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.higher.percentageGmmMaxN.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.higher.porcentageVam.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.higher.ratioDustAsphalt.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.higher.specificMass.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(table2.higher.percentWaterAbs.toFixed(2))).toBeInTheDocument();
  });
});
