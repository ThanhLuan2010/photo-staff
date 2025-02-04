import React, { useRef, useState } from "react";
import { GetList } from "../../hook/getList.tsx";
import moment from "moment";
import ReactPaginate from "react-paginate";
import "./pagination.css";
import { TypeCouponResult } from "../admin/DetailRequestCouon/index";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
type TypeHistory = {
  name: string;
  userId: string;
  url: string;
  description: string;
  date: Date;
  branch: string;
  coupon: TypeCouponResult;
};
function History() {
  const {
    data: dataHistory,
    loadMore,
    search,
    loading,
    totalPage
  } = GetList<any>({
    url: "staff/get-history-request",
  });
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const searchRef = useRef<HTMLButtonElement>(null);

  interface PageChangeEvent {
    selected: number;
  }

  const handlePageChange = ({ selected }: PageChangeEvent) => {
    loadMore(selected + 1);
  };

  const renderHistory = (item: TypeHistory, index: number) => {
    return (
      <tr
        onClick={() =>
          navigate("/admin/detail-request-couon", { state: { item } })
        }
        className="w-full py-2 text-center text-white border cursor-pointer border-primary"
      >
        <td className="py-2">{index + 1}</td>
        <td>{moment(item.date).format("DD/MM/YYYY")}</td>
        <td>
          {item.coupon.Expire_Date
            ? moment(item.coupon.Send_date)
                .add(item.coupon.Expire_Date, "days")
                .format("DD/MM/YYYY")
            : "-"}
        </td>
        <td>{item.coupon.EVENT_POINT}</td>
        <td>{item.coupon.Category}</td>
        <td>{item.coupon.PRICE}</td>
        <td>{item.coupon.USE_YN === "N" ? "Chưa sử dụng" : "Đã sử dụng"}</td>
        <td>{item.branch}</td>
      </tr>
    );
  };

  const handalKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (searchRef.current) searchRef.current.focus();
    }
  };

  return (
    <div>
      <h1 className="right-0 mt-10 text-5xl font-semibold text-primary">
        Lịch sử
      </h1>
      <div className="flex justify-center mt-10">
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
            placeholder="Tìm kiếm lịch sử"
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
      {dataHistory && dataHistory?.length > 0 ? (
        <>
          <table className="w-full bg-red-200 mt-[30px]">
            <tbody>
              <tr className="w-full font-bold text-center border border-primary">
                <td className="flex-1 min-w[100px]">STT</td>
                <td className="flex-1 min-w-[120px]">Ngày tạo</td>
                <td className="flex-1 min-w-[120px]">Ngày hết hạn</td>
                <td className="flex-1 min-w-[120px]">Mã Coupon</td>
                <td className="flex-1 min-w-[120px]">Tên Coupon</td>
                <td className="flex-1 min-w-[120px]">Giá tiền</td>
                <td className="flex-1 min-w-[120px]">Trạng Thái</td>
                <td className="flex-1 min-w-[120px]">Chi nhánh</td>
              </tr>
              {dataHistory.map(renderHistory)}
            </tbody>
          </table>
        </>
      ) : (
        <div className="h-[100px] flex justify-center items-center text-3xl text-gray-500">
          <p>{loading ? "Đang tải..." : "Danh sách trống"} </p>
        </div>
      )}

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
          marginPagesDisplayed={0}
          nextClassName={"item next "}
          nextLabel={">"}
          onPageChange={handlePageChange}
          pageCount={10000}
          pageClassName={"item pagination-page "}
          pageRangeDisplayed={2}
          previousClassName={"item previous"}
          previousLabel={"<"}
        />
      </div>
    </div>
  );
}

export default History;
