type setDataType = { step: number; key?: string; value: unknown };


export interface StoreActions {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
}