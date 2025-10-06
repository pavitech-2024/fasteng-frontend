export interface AsphaltMaterial {
  name: string;
  type: string;
}

export interface GranulometryResult {
  accumulated_retained?: [string, number][];
  graph_data?: [number, number][];
  passant?: [string, number][];
  retained_porcentage?: [string, number][];
  total_retained?: number;
  nominal_size?: number;
  nominal_diameter?: number;
  fineness_module?: number;
  cc?: number;
  cnu?: number;
  error?: number;
}

export interface GranulometryItem {
  material: AsphaltMaterial;
  result: GranulometryResult | null;
  data?: {  // ⬅️ ADICIONE ESTA PROPRIEDADE OPCIONAL
    material: AsphaltMaterial;
    material_mass: number;
    table_data: Array<{
      sieve_label: string;
      sieve_value: number;
      passant: number;
      retained: number;
    }>;
    sieve_series: Array<{
      label: string;
      value: number;
    }>;
    bottom: number;
  };
}

export interface ViscosityResult {
  result: {
    compressionTemperatureRange: Record<string, number>;
    aggregateTemperatureRange: Record<string, number>;
    machiningTemperatureRange: Record<string, number>;
    curvePoints: any[];
  };
}

interface StoreData {
  granulometrys: Array<{
    material: AsphaltMaterial;
    result: GranulometryResult | null;
    data?: {
      material: AsphaltMaterial;
      material_mass: number;
      table_data: Array<{
        sieve_label: string;
        sieve_value: number;
        passant: number;
        retained: number;
      }>;
      sieve_series: Array<{
        label: string;
        value: number;
      }>;
      bottom: number;
    };
  }>;
  viscosity: any;
  aggregatesData?: any[]; // ⬅️ ADICIONE ESTA LINHA
  percentsToList?: any[]; // ⬅️ ADICIONE ESTA LINHA
  nominalSize?: { // ⬅️ ADICIONE ESTA LINHA
    value: number;
  };
  porcentagesPassantsN200?: number[]; // ⬅️ ADICIONE ESTA LINHA
}