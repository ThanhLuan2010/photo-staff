import React, { useState, useEffect } from "react";
import { GetList } from "../../../hook/getList.tsx";
import moment from "moment";
import "./pagination.css";
import { TypeCouponResult } from "../../RequestCouon/index.tsx";
import { Dropdown } from "../../../component/Dropdow/index.tsx";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { useNavigate } from "react-router-dom";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import { Box, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  historySelect,
  setDataRequestCp,
} from "../../../store/slice/historyRequestCoupon.slice.tsx";

function HistoryStaffRequest() {
  const navigate = useNavigate();
  const storedBranch = localStorage.getItem("branch");
  const storedStartDate = localStorage.getItem("startDate");
  const storedEndDate = localStorage.getItem("endDate");
  const localPage = localStorage.getItem("page");
  const dispatch = useDispatch();
  const [branch, setbranch] = useState<string>(
    storedBranch ? storedBranch : ""
  );
  const [curentPage, setCurentPage] = useState(localPage || 1);
  const { dataRequestCp } = useSelector(historySelect);
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
    if (curentPage) {
      localStorage.setItem("page", curentPage?.toString());
    }
  }, [curentPage]);

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
    isLazy: false,
    dependencies: branch,
    dependencies1: startDate,
    dependencies2: endDate,
    params: {
      startDate: startDate,
      endDate: endDate,
      branch: branch,
    },
  });

  useEffect(() => {
    if (dataHistory?.length > 0) {
      dispatch(setDataRequestCp(dataHistory));
    }
    if (dataHistory?.length === 0 && !loading) {
      dispatch(setDataRequestCp([]));
    }
  }, [dataHistory]);

  type TypeHistory = {
    name: string;
    userId: string;
    url: string;
    description: string;
    date: Date;
    branch: string;
    coupon: TypeCouponResult;
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
    { title: "DongNai" },
    { title: "ParcMall" },
    { title: "Lotte_GoVap" },
    { title: "Thu_Duc" },
    { title: "Hue" },
    { title: "CHUA_LANG" },
    { title: "BAC_NINH" },
    { title: "NHA_TRANG" },
    { title: "HAI_PHONG" },
    { title: "PXL" },
    { title: "Central Premium" },
    { title: "NHH_HOAN_KIEM" },
    { title: "CAN_THO" },
 
  ];
  return (
    <LoadingWrap active={loading && dataRequestCp?.length === 0}>
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
              dispatch(setDataRequestCp([]));
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
              onChange={(date) => {
                setStartDate(date);
                dispatch(setDataRequestCp([]));
              }}
              value={startDate}
            />
          </div>

          <div>
            <h5 className="text-[pink]">Ngày kết thúc</h5>
            <DateTimePicker
              format={"dd-MM-y"}
              disableClock={true}
              onChange={(date) => {
                setEndDate(date);
                dispatch(setDataRequestCp([]));
              }}
              value={endDate}
            />
          </div>
        </div>
      </div>
      {dataRequestCp && dataRequestCp?.length > 0 ? (
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
            {dataRequestCp.map(renderHistory)}
          </tbody>
        </table>
      ) : (
        <div className="h-[100px] justify-center flex items-center">
          <p className="text-2xl font-semibold text-center text-gray-400">
            Danh sách trống
          </p>
        </div>
      )}

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
      </div> */}
      <Box display={"flex"} justifyContent={"center"} mt={5}>
        <Pagination
          page={parseInt(curentPage?.toString())}
          color="primary"
          onChange={(e, page) => {
            loadMore(page);
            setCurentPage(page);
            dispatch(setDataRequestCp([]));
          }}
          count={1000}
        />
      </Box>
    </LoadingWrap>
  );
}

export default HistoryStaffRequest;
