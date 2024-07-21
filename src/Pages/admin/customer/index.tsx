"use client";
import { useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { GetList } from "../../../hook/getList.tsx";
import CustomerItems from "./customerItems.tsx";
import "./pagination.css";
import React from "react";
import EmptyComponent from "../../../component/EmptyComponent/index.tsx";

interface PageChangeEvent {
  selected: number;
}

const Customer = () => {
  const { data, loadMore, search, loading } = GetList<any>({
    url: "users/getListUser",
    params: { limit: 20 },
    isLazy: true
  });
  const searchRef = useRef<HTMLButtonElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const handlePageChange = ({ selected }: PageChangeEvent) => {
    loadMore(selected + 1);
  };

  const renderUser = (item: any, index: number) => {
    return <CustomerItems item={item} key={index} index={index} />;
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (searchRef.current) searchRef.current.focus();
    }
  };

  return (
    <div className="px-10">
      <div className="flex justify-center">
        <div
          className="
        flex 
        items-center 
        border-[1.5px] 
        w-[50%]
        rounded-lg
        pl-2
        border-[pink]
        "
        >
          <input
            className="flex w-full px-2 py-2 outline-none "
            placeholder="Tìm kiếm người dùng"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => search(searchValue)}
            ref={searchRef}
            className="bg-[pink] px-3 h-full rounded-tr-lg rounded-br-lg"
          >
            <AiOutlineSearch size={26} />
          </button>
        </div>
      </div>

      <div>{data?.data?.length > 0 && !loading ?data?.data?.map(renderUser) : <EmptyComponent loading={loading}/>}</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 20,
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
        }}
      >
        <ReactPaginate
          activeClassName={"item active"}
          breakClassName={"item break-me"}
          breakLabel={"..."}
          containerClassName={"pagination"}
          disabledClassName={"disabled-page"}
          marginPagesDisplayed={2}
          nextClassName={"item next "}
          nextLabel={">"}
          onPageChange={handlePageChange}
          pageCount={data?.count / 20}
          pageClassName={"item pagination-page "}
          pageRangeDisplayed={2}
          previousClassName={"item previous"}
          previousLabel={"<"}
        />
      </div>
    </div>
  );
};

export default Customer;
