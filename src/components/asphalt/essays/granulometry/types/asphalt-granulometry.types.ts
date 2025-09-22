// types/asphalt-granulometry.types.ts
export interface GranulometryEssay {
  _id: string;
  generalData: {
    name: string;
    material: {
      name: string;
      type: string;
    };
    createdAt: string;
    operator?: string;
    calculist?: string;
    description?: string;
  };
  step2Data: {
    material_mass: number;
    table_data: { sieve_label: string; sieve_value: number, passant: number, retained: number }[];
    bottom: number;
  };
  results: {
    accumulated_retained: [string, number][];
    graph_data: [number, number][];
    passant: [string, number][];
    retained_porcentage: [string, number][];
    total_retained: number;
    nominal_diameter: number;
    nominal_size: number;
    fineness_module: number;
    cc: number;
    cnu: number;
    error: number;
  };
}

export interface ResultCardData {
  label: string;
  value: any;
  unity?: string;
}

export interface EssayTableRow {
  sieve: string;
  passant_porcentage: number;
  passant: number;
  retained_porcentage: number;
  retained: number;
  accumulated_retained: number;
}