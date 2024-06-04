import moment from "moment";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { GetList } from "../../../hook/getList.tsx";
import Card from "./card.tsx";

type dataCouponType = {
  recordset: any;
};
type dataUserActiveType = {
  count: number;
};

type couponRecord = {
  SALES_QTY: any;
  USE_COUPON: any;
  USE_COUPON_20k: any;
  USE_COUPON_50k: any;
  USE_COUPON_70k: any;
  USE_COUPON_100k: any;
};

type coutRegisterType = {
  count: number;
};
const Dashboard = () => {
  const { data: dataUser } = GetList<dataUserActiveType>({
    url: "users/getListUserActive",
  });
  const [date, setdate] = useState<any>(moment().subtract(1, "days"));
  const [endDate, setEndDate] = useState<any>(moment().subtract(1, "days"));
  const { data: listEvent } = GetList<any>({ url: "home/get-list-event" });
  const { data: listBranch } = GetList<any>({
    url: "home/get-list-branch",
    params: { limit: 30 },
  });
  const { data: dataCoupon, reLoad: handleReloadCoupon } =
    GetList<dataCouponType>({
      dependencies: date,
      dependencies2: endDate,
      url: `coupon/query-coupon?startDate=${moment(date).format(
        "YYYY-MM-DD"
      )}&enDate=${moment(endDate).format("YYYY-MM-DD")}`,
    });
  const navigate = useNavigate();

  const { data: coutRegister } = GetList<coutRegisterType>({
    url: `users/find-by-date?startDate=${moment(date).format(
      "DD/MM/YYYY"
    )}&endDate=${moment(endDate).format("DD/MM/YYYY")}`,
    dependencies: date,
    dependencies2: endDate,
    isLazy: false,
  });
  const [totalQuanlity, setTotalQuanlity] = useState(0);
  const [totalCoupon, setTotalCoupon] = useState(0);
  const [totalCoupon20, setTotalCoupon20] = useState(0);
  const [totalCoupon50, setTotalCoupon50] = useState(0);
  const [totalCoupon70, setTotalCoupon70] = useState(0);
  const [totalCoupon100, setTotalCoupon100] = useState(0);
  const [totalCouponInstore, setTotalCouponInstore] = useState(0);

  useEffect(() => {
    if (dataCoupon?.recordset?.length > 0) {
      let total1 = 0;
      let total2 = 0;
      let total3 = 0;
      let total4 = 0;
      let total5 = 0;
      let total6 = 0;
      let total7 = 0;
      dataCoupon?.recordset?.forEach((item: couponRecord) => {
        const temp7 =
          parseInt(item?.USE_COUPON) -
          parseInt(
            item?.USE_COUPON_100k +
              item?.USE_COUPON_20k +
              item?.USE_COUPON_50k +
              item?.USE_COUPON_70k
          );
        total1 += parseInt(item?.SALES_QTY);
        total2 += parseInt(item?.USE_COUPON);
        total3 += parseInt(item?.USE_COUPON_20k);
        total4 += parseInt(item?.USE_COUPON_50k);
        total5 += parseInt(item?.USE_COUPON_70k);
        total6 += parseInt(item?.USE_COUPON_100k);
        total7 += temp7;
      });
      setTotalQuanlity(total1);
      setTotalCoupon(total2);
      setTotalCoupon20(total3);
      setTotalCoupon50(total4);
      setTotalCoupon70(total5);
      setTotalCoupon100(total6);
      setTotalCouponInstore(total7);
    }
  }, [dataCoupon]);
  console.log("=====dataCoupon====", dataCoupon);

  useEffect(() => {}, []);

  const onExportFile = (): void => {
    const TotalData = dataCoupon?.recordset?.concat({
      GROUP_ID: "Tổng",
      GROUP_NAME: "Cộng:",
      SALES_QTY: totalQuanlity,
      USE_COUPON: totalCoupon,
      USE_COUPON_20k: totalCoupon20,
      USE_COUPON_50k: totalCoupon50,
      USE_COUPON_70k: totalCoupon70,
      USE_COUPON_100k: totalCoupon100,
    });
    const finalData = TotalData?.map((item: any) => {
      return {
        STORE: item?.GROUP_ID,
        GROUP_NAME: item?.GROUP_NAME,
        QUANTITY: item?.SALES_QTY,
        CP20: item?.USE_COUPON_20k,
        CP50: item?.USE_COUPON_50k,
        CP70: item?.USE_COUPON_70k,
        CP100: item?.USE_COUPON_100k,
        PAPER_COUPON:
          item?.USE_COUPON -
          (item?.USE_COUPON_100k +
            item?.USE_COUPON_20k +
            item?.USE_COUPON_50k +
            item?.USE_COUPON_70k),
        TOTAL_COUPON: item?.USE_COUPON,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(finalData);
    // Định nghĩa style cho hàng cuối
    worksheet["A1"].s = {
      font: {
        name: "arial",
        sz: 24,
        bold: true,
        color: "#F2F213",
      },
    };
    // Tạo workbook mới và thêm worksheet vào workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Xuất workbook (Tải xuống file Excel)
    XLSX.writeFile(workbook, "export.xlsx");
  };

  return (
    <div>
      <div className="grid flex-wrap grid-cols-1 gap-2 px-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card lable="Người dùng" value={dataUser?.count || 0} />
        <Card
          onClick={() => navigate("/admin/ListUserRegisted")}
          lable="Người đăng ký app"
          value={coutRegister?.count || 0}
        />
        <Card lable="Sự kiện" value={listEvent?.length || 0} />
        <Card lable="Chi nhánh" value={listBranch?.length || 0} />
      </div>
      <h1 className="mt-10 font-bold text-[pink] text-2xl">THỐNG KÊ</h1>

      <div className="flex gap-5 my-3 ">
        <div>
          <h5 className="text-[pink]">Ngày bắt đầu</h5>
          <DateTimePicker
            format={"dd-MM-y"}
            disableClock={true}
            onChange={setdate}
            value={date}
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

      <button
        onClick={onExportFile}
        className="bg-[pink] px-10 py-4 text-white rounded-lg mb-2"
      >
        Xuất file
      </button>

      <div className="mb-20">
        <table>
          <tbody>
            <tr className="border-b-[3px] border-[pink] text-[pink] font-bold">
              <td className="text-center ">DATE</td>
              <td className="text-center">STORE</td>
              <td className="text-center">GROUP NAME</td>
              <td className="text-center">QUANTITY</td>
              <td className="text-center">CP20K</td>
              <td className="text-center">CP50K</td>
              <td className="text-center">CP70K</td>
              <td className="text-center">CP100K</td>
              <td className="text-center">PAPER COUPON</td>
              <td className="text-center">TOTAL COUPON</td>
            </tr>
            <tr>
              <td className="border-r-[1px] border-[pink] border-l-[1px] border-b-[1px]">
                {moment(date).format("DD/MM/YYYY")}
              </td>
              <td className="border-r-[1px] border-[pink] text-center">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => (
                      <div
                        className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[150px] md:w-auto px-3 text-center py-3"
                        key={index + "store"}
                      >
                        <div key={index + "store"}>{item?.GROUP_ID}</div>
                      </div>
                    ))}
                    <div className="self-center bg-[pink] text-center">-</div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => (
                      <div
                        className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[150px] md:w-auto px-3 text-center py-3"
                        key={index + "group"}
                      >
                        <div>{item?.GROUP_NAME}</div>
                      </div>
                    ))}
                    <div className="self-center bg-[pink] text-center">-</div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[100px]"
                          key={index + "group"}
                        >
                          <div>{item?.SALES_QTY}</div>
                        </div>
                      );
                    })}
                    <div className="bg-[pink] w-[100px] text-center">
                      {totalQuanlity}
                    </div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[70px]"
                          key={index + "group"}
                        >
                          <div>{item?.USE_COUPON_20k}</div>
                        </div>
                      );
                    })}
                    <div className="bg-[pink] w-[70px] text-center">
                      {totalCoupon20}
                    </div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[70px]"
                          key={index + "group"}
                        >
                          <div>{item?.USE_COUPON_50k}</div>
                        </div>
                      );
                    })}
                    <div className="bg-[pink] w-[70px] text-center">
                      {totalCoupon50}
                    </div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[70px]"
                          key={index + "group"}
                        >
                          <div>{item?.USE_COUPON_70k}</div>
                        </div>
                      );
                    })}
                    <div className="bg-[pink] w-[70px] text-center">
                      {totalCoupon70}
                    </div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[150px]"
                          key={index + "group"}
                        >
                          <div>{item?.USE_COUPON_100k}</div>
                        </div>
                      );
                    })}
                    <div className="bg-[pink] w-[150px] text-center">
                      {totalCoupon100}
                    </div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div>
                    {dataCoupon?.recordset?.map((item: any, index: number) => (
                      <div
                        className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[150px]"
                        key={index + "group"}
                      >
                        <div>
                          {item?.USE_COUPON -
                            (item?.USE_COUPON_100k +
                              item?.USE_COUPON_20k +
                              item?.USE_COUPON_50k +
                              item?.USE_COUPON_70k)}
                        </div>
                      </div>
                    ))}
                    <div className="bg-[pink] w-[150px] text-center">
                      {totalCouponInstore}
                    </div>
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {dataCoupon?.recordset?.length > 0 && (
                  <div className="items-center justify-center flex-col w-[150px]">
                    {dataCoupon?.recordset?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center"
                          key={index + "group"}
                        >
                          <div>{item?.USE_COUPON}</div>
                        </div>
                      );
                    })}
                    <div className="self-center bg-[pink] w-[150px] text-center">
                      {totalCoupon}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
