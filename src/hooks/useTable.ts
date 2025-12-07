// src/hooks/useTable.ts
import { useState, useCallback } from 'react';

interface TableState {
  page: number;
  pageSize: number;
  keyword: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const useTable = (initialState?: Partial<TableState>) => {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    keyword: '',
    sortBy: '',
    sortOrder: 'asc',
    ...initialState,
  });

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setKeyword = useCallback((keyword: string) => {
    setState(prev => ({ ...prev, keyword, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const reset = useCallback(() => {
    setState({
      page: 1,
      pageSize: 10,
      keyword: '',
      sortBy: '',
      sortOrder: 'asc',
    });
  }, []);

  return {
    ...state,
    setPage,
    setPageSize,
    setKeyword,
    setSort,
    reset,
  };
};

// ==========================================