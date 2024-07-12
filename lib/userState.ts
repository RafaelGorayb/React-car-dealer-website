import { Car } from '@/types';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const attomComparador = atomWithStorage<Car[] | null>("comparador", null);

export const useCompareList = () => {
  const [compareList, setCompareList] = useAtom(attomComparador);
  return { compareList, setCompareList };
};