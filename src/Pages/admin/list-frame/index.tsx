import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { GetList } from "../../../hook/getList.tsx";
import ItemFrame from "./itemFrames.tsx";
import "./pagination.css";
import React from "react";
import EmptyComponent from "../../../component/EmptyComponent/index.tsx";

const ListFame = () => {
  const { data, search, loadMore, loading } = GetList<any>({
    url: "frame/get-list",
    isLazy: true,
  });

  const [searchValue, setSearchValue] = useState("");
  const renderFrame = (item: any, index: string) => {
    return <ItemFrame key={index} item={item} />;
  };

  const handlePageChange = ({ selected }: any) => {
    loadMore(selected + 1);
  };

  return (
    <div className="px-10 pb-10 bg-pink-200">
      <div className="flex justify-center">
        <div
          className="
            flex 
            items-center 
            border-[1.5px] 
            w-[100%]
            md:w-[60%]
            rounded-lg
            pl-2
            border-[white]
            mt-5
            "
        >
          <input
            className="flex w-full px-2 py-2 bg-transparent outline-none "
            placeholder="Tìm kiếm frame"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <button
            onClick={() => search(searchValue)}
            className="bg-[white] px-3 h-full rounded-tr-lg rounded-br-lg"
          >
            <AiOutlineSearch size={26} />
          </button>
        </div>
      </div>
      {data?.length > 0 && !loading ? (
        <div className="grid grid-cols-1 gap-3 mb-10 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 xl:grid-cols-4">
          {data?.map(renderFrame)}
        </div>
      ) : (
        <EmptyComponent loading={loading} />
      )}

      <ReactPaginate
        activeClassName={"item active "}
        breakClassName={"item break-me "}
        breakLabel={"..."}
        containerClassName={"pagination"}
        disabledClassName={"disabled-page"}
        marginPagesDisplayed={2}
        nextClassName={"item next "}
        nextLabel={">"}
        onPageChange={handlePageChange}
        pageCount={100}
        pageClassName={"item pagination-page "}
        pageRangeDisplayed={10}
        previousClassName={"item previous"}
        previousLabel={"<"}
      />
    </div>
  );
};

export default ListFame;
