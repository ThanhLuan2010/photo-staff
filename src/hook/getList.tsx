"use client";
import React, { useCallback, useEffect, useState } from "react";
import { request } from "../api/request.tsx";

interface GetListProps {
  url: string;
  params?: any;
  dependencies?: any;
  isLazy?: boolean;
  dependencies2?: any;
}
export function GetList<T>({
  url,
  params,
  dependencies,
  isLazy,
  dependencies2,
}: GetListProps): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  search: (queryString: string) => void;
  loadMore: (page: number) => void;
  reLoad: () => void;
} {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    getData();
  }, [dependencies, dependencies2]);

  const search = (searchQuery: string) => {
    getData(1, searchQuery);
    setPage(1); // reset to the first page for new search
  };

  const loadMore = (apage: number) => {
    getData(apage);
  };

  const reLoad = () => {
    getData(); // fetch data immediately
    setPage(1); // reset to the first page
  };

  const getData = async (_page = page, search = "") => {
    if (isLazy) {
      const respone = await request(url, null, "GET", {
        page: _page,
        limit: 20,
        search,
        ...params,
      });
      setData(respone?.data);
    } else {
      const respone = await request(url, null, "GET", {
        // page: _page,
        // limit: 20,
        // search,
        ...params,
      });
      setData(respone?.data);
    }
  };
  return {
    data,
    loading,
    error,
    search,
    reLoad,
    loadMore,
  };
}
