"use client";
import React, { useCallback, useEffect, useState } from "react";
import { request } from "../api/request.tsx";

interface GetListProps {
  url: string;
  params?: any;
  dependencies?: any;
  isLazy?: boolean;
  dependencies2?: any;
  dependencies1?: any;
}
export function GetList<T>({
  url,
  params,
  dependencies,
  isLazy,
  dependencies2,
  dependencies1,
}: GetListProps): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  search: (queryString: string) => void;
  loadMore: (page: number) => void;
  reLoad: () => void;
  totalPage:number
} {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    getData();
  }, [dependencies, dependencies2, dependencies1]);

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
    console.log("====searchQuery===",search)

    if (isLazy) {
      const respone = await request(url, null, "GET", {
        page: _page,
        limit: 20,
        search,
        ...params,
      });
      setData(respone?.data?.results);
      setTotalPage(respone?.data?.totalPages)
    } else {
      const respone = await request(url, null, "GET", {
        // page: _page,
        // limit: 20,
        // search,
        ...params,
      });
      setData(respone?.data);
    }
    setLoading(false);

  };

  return {
    data,
    loading,
    error,
    search,
    reLoad,
    loadMore,
    totalPage
  };
}
