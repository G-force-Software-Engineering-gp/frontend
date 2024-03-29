import AuthContext from '@/contexts/AuthContext';
import { BaseURL } from '@/pages/baseURL';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { Members } from '../types';

export const useMembers = (boardId: number) => {
  let authTokens = useContext(AuthContext)?.authTokens;
  const queryRs = useQuery<Members, Error>({
    queryKey: ['members', boardId],
    queryFn: async () => {
      const response = await fetch(BaseURL + `tascrum/board-member/${boardId}/`, {
        method: 'GET',
        headers: {
          Authorization: `JWT ` + authTokens?.access,
        },
      });
      const data = await response.json();
      return data;
    },
  });
  return queryRs;
};
