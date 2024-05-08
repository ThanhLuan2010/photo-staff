import React from "react";
import { GetList } from "../../hook/getList.tsx";
import moment from "moment";
import { TypeCouponResult } from "../admin/Dashboard/index.tsx";
import ReactPaginate from "react-paginate";
import "./pagination.css";
function History() {
  const { data: dataHistory, loadMore } = GetList<any>({
    url: "staff/get-history-request",
    isLazy: true,
  });

  type TypeHistory = {
    name: string;
    userId: string;
    url: string;
    description: string;
    date: Date;
    branch: string;
    coupon: TypeCouponResult;
  };

  interface PageChangeEvent {
    selected: number;
  }

  const handlePageChange = ({ selected }: PageChangeEvent) => {
    loadMore(selected + 1);
  };

  const renderHistory = (item: TypeHistory, index: number) => {
    return (
      <tr className="w-full py-2 text-center text-white border border-primary">
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
  return (
    <div>
      <h1 className="fixed top-0 right-0 w-screen mt-10 text-5xl font-semibold text-center text-primary">
        Lịch sử
      </h1>
      {dataHistory && dataHistory?.length > 0 ? (
        <table className="w-full bg-red-200 mt-[100px]">
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
      ):<div className="h-[100px]"></div>}

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
