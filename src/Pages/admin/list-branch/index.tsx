import { useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { GetList } from "../../../hook/getList.tsx";
import BranchItems from "./BranchItems.tsx";
import "./pagination.css";
import React from "react";

interface PageChangeEvent {
  selected: number;
}

const ListBranch = () => {
  const { data, loadMore, search } = GetList<any>({
    url: "branch/get-list-branch?limit=100",
    isLazy: true,
  });
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLButtonElement>(null);
  const handlePageChange = ({ selected }: PageChangeEvent) => {
    loadMore(selected + 1);
  };

  const renderUser = (item: any, index: number) => {
    return <BranchItems item={item} key={index} index={index} />;
  };

  const handalKeyPress=(event: any)=>{
    if (event.key === "Enter") {
      if (searchRef.current) searchRef.current.focus();
    }
  }

  return (
    <div>
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
            placeholder="Tìm kiếm chi nhánh"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={handalKeyPress}
          />
          <button
            ref={searchRef}
            onClick={() => search(searchValue)}
            className="bg-[pink] px-3 h-full rounded-tr-lg rounded-br-lg"
          >
            <AiOutlineSearch size={26} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md: lg:grid-cols-3 xl:grid-cols-4">
        {data?.results?.length > 0 && data?.results?.map(renderUser)}
      </div>

      {/* <div
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
          activeClassName={"item active "}
          breakClassName={"item break-me "}
          breakLabel={"..."}
          containerClassName={"pagination"}
          disabledClassName={"disabled-page"}
          marginPagesDisplayed={2}
          nextClassName={"item next "}
          nextLabel={">"}
          onPageChange={handlePageChange}
          pageCount={20}
          pageClassName={"item pagination-page "}
          pageRangeDisplayed={2}
          previousClassName={"item previous"}
          previousLabel={"<"}
        />
      </div> */}
    </div>
  );
};

export default ListBranch;
