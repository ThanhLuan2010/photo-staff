import React, { useState, useEffect } from "react";
import { GetList } from "../../../hook/getList.tsx";
import moment from "moment";
import ReactPaginate from "react-paginate";
import "./pagination.css";
import { TypeCouponResult } from "../../RequestCouon/index.tsx";
import { Dropdown } from "../../../component/Dropdow/index.tsx";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { useNavigate } from "react-router-dom";
import LoadingWrap from "../../../component/LoadingWrap.tsx";

function HistoryStaffRequest() {
  const navigate = useNavigate();
  const storedBranch = localStorage.getItem("branch");
  const storedStartDate = localStorage.getItem("startDate");
  const storedEndDate = localStorage.getItem("endDate");

  const [branch, setbranch] = useState<string>(
    storedBranch ? storedBranch : ""
  );
  const [startDate, setStartDate] = useState<any>(
    storedStartDate ? new Date(storedStartDate) : new Date()
  );
  const [endDate, setEndDate] = useState<any>(
    storedEndDate ? new Date(storedEndDate) : new Date()
  );

  useEffect(() => {
    if (branch) {
      localStorage.setItem("branch", branch);
    }
  }, [branch]);

  useEffect(() => {
    if (startDate) {
      localStorage.setItem("startDate", startDate.toString());
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      localStorage.setItem("endDate", endDate.toString());
    }
  }, [endDate]);

  const {
    data: dataHistory,
    loadMore,
    loading,
  } = GetList<any>({
    url: "staff/admin-get-history-request",
    isLazy: true,
    dependencies: branch,
    dependencies1: startDate,
    dependencies2: endDate,
    params: {
      startDate: startDate,
      endDate: endDate,
      branch: branch,
    },
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
      <tr
        key={index}
        onClick={() =>
          navigate("/admin/detail-request-couon", {
            state: { item, startDate, endDate, branch },
          })
        }
        className="w-full py-2 mt-2 text-center text-white bg-red-200 border border-gray-500 cursor-pointer border-3"
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

  const dataBranch = [
    { title: "ALL" },
    { title: "D2" },
    { title: "GIGA" },
    { title: "HungVuong" },
    { title: "BHD" },
    { title: "Cinestar" },
    { title: "Royal" },
    { title: "Lotte" },
    { title: "TheLoop" },
    { title: "CresenMall" },
    { title: "Vinh" },
    { title: "THISO" },
    { title: "VANHANH" },
    { title: "Metropolis" },
    { title: "DANANG" },
    { title: "CrescentMall" },
  ];

  return (
    <LoadingWrap active={loading}>
      <h1 className="mt-10 text-5xl font-semibold text-center text-primary">
        Lịch sử
      </h1>

      <div className="flex flex-col items-center justify-center mt-10 text-center">
        <div className="w-[200px]">
          <Dropdown
            data={dataBranch}
            placeholder="Chi nhánh"
            onSelectItem={(i) => {
              setbranch(i.title);
            }}
            filedKey="title"
            value={branch}
          />
        </div>

        <div className="flex gap-5 my-3 ">
          <div>
            <h5 className="text-[pink]">Ngày bắt đầu</h5>
            <DateTimePicker
              format={"dd-MM-y"}
              disableClock={true}
              onChange={setStartDate}
              value={startDate}
            />
          </div>

          <div>
            <h5 className="text-[pink]">Ngày kết thúc</h5>
            <DateTimePicker
              format={"dd-MM-y"}
              disableClock={true}
              onChange={setEndDate}
              value={endDate}
            />
          </div>
        </div>
      </div>
      {dataHistory && dataHistory?.length > 0 ? (
        <table className="w-full mt-[10px]">
          <tbody>
            <tr className="w-full font-bold text-center border border-gray-500">
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
      ) : (
        <div className="h-[100px] justify-center flex items-center">
          <p className="text-2xl font-semibold text-center text-gray-400">
            Danh sách trống
          </p>
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
    </LoadingWrap>
  );
}

export default HistoryStaffRequest;
