import moment from "moment";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import * as XLSX from "xlsx";
import { GetList } from "../../../hook/getList.tsx";

const ListUserRegisted = () => {
  const [date, setdate] = useState<any>(moment().subtract(1, "days"));
  const { data } = GetList<any>({
    url: `users/find-by-month?startDate=${moment(date).format("DD/MM/YYYY")}`,
    isLazy: false,
    dependencies: date,
  });

  const onExportFile = () => {
    let total = 0;
    for (let i = 0; i < data?.length; i++) {
      total = total + data[i]?.count;
    }
    const finalData: any = [...data, { date: "Tổng:", count: total }];

    const Data = finalData?.map((item: any) => {
      return {
        DATE: item?.date,
        COUNT_OF_USER: item?.count,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(Data);
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
  let total = 0;
  for (let i = 0; i < data?.length; i++) {
    total = total + data[i]?.count;
  }
  const finalData: any = data
    ? [...data, { date: "Tổng:", count: total }]
    : null;
  return (
    <div>
      <h1 className="text-center text-[#c12e47] text-2xl">
        TỔNG HỢP USER ĐĂNG KÝ APP TRONG THÁNG {moment(new Date()).format("MM")}
      </h1>

      <div className="flex items-center justify-center my-10">
        <DateTimePicker
          format={"MM-y"}
          disableClock={true}
          onChange={setdate}
          value={date}
        />

        <button
          className="bg-[pink] rounded-md px-5  text-white font-semibold py-1 ml-5"
          onClick={onExportFile}
        >
          Xuất file
        </button>
      </div>
      <div className="flex justify-center">
        <table>
          <tbody>
            <tr>
              <td className="border-[pink] border-[1px] px-[10px] text-center w-[200px] md:w-[400px]">
                DATE
              </td>
              <td className="border-[pink] border-[1px] px-[10px] text-center w-[200px] md:w-[400px]">
                COUNT OF USER REGISTER
              </td>
            </tr>
            <tr>
              <td>
                {finalData?.length > 0 &&
                  finalData?.map((item: any, index: number) => (
                    <div
                      className="border-[pink] border-[1px] px-[10px] text-center w-[200px] md:w-[400px]"
                      key={index}
                    >
                      {item?.date !== "Tổng:"
                        ? moment(item?.date).format("DD/MM/YYYY")
                        : "Tổng cộng"}
                    </div>
                  ))}
              </td>
              <td>
                {finalData?.length > 0 &&
                  finalData?.map((item: any, index: number) => (
                    <div
                      className="border-[pink] border-[1px] px-[10px] text-center w-[200px] md:w-[400px]"
                      key={index}
                    >
                      {item?.count}
                    </div>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUserRegisted;
