import React from "react";
import { GetList } from "../../hook/getList.tsx";
import moment from "moment";
import { TypeCouponResult } from "../Dashboard/index.tsx";
function History() {
  const { data: dataHistory } = GetList<any>({
    url: "staff/get-history-request",
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
      {dataHistory && dataHistory?.length > 0 && (
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
      )}
    </div>
  );
}

export default History;
