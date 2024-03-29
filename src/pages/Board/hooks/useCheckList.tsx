import AuthContext from '@/contexts/AuthContext';
import { BaseURL } from '@/pages/baseURL';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { CheckLists } from '../types';

export const useCheckList = (cardId: number) => {
  let authTokens = useContext(AuthContext)?.authTokens;
  const queryRs = useQuery<CheckLists, Error>({
    queryKey: ['checklist', cardId],
    queryFn: async () => {
      const response = await fetch(BaseURL + `tascrum/checklist/${cardId}/`, {
        method: 'GET',
        headers: {
          Authorization: `JWT ` + authTokens?.access,
        },
      });
      if (response.status === 404) {
        return { data: [] };
      }
      const data = await response.json();

      return data;
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return queryRs;
};
