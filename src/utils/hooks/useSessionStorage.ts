/* Similar ao useState porém com uma diferença: persiste
 o state no sessionStorage e também atualiza o mesmo sempre
  que o valor do state for alterado! */

import { useCallback, useState } from 'react';

interface IUseSessionStorage {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any;
}
export const useSessionStorage = ({ key, initialValue }: IUseSessionStorage) => {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);

      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: string) => {
      try {
        setState(value);
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  return [state, setValue];
};
