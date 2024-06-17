
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
const totalPages = 30;
const CaptureCount = () => {
  const [date, setDate] = useState<any>(moment().subtract(1, "days"));
  const [endDate, setEndDate] = useState<any>(moment().subtract(1, "days"));
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchData = async () => {
    const startDate = moment(date).format("YYYY-MM-DD");
    const endDateFormatted = moment(endDate).format("YYYY-MM-DD");
    const response = await fetch(
      `https://framemanager.phototimevn.com/Frame?limit=10&page=${currentPage}&startDate=${startDate}&endDate=${endDateFormatted}`
    );
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, [date, endDate, currentPage]);
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(startPage + 3, totalPages);

  return (
    <div>
      <h1 className="mt-10 mb-2 font-bold text-[#ffc0cb] text-2xl uppercase">
        Thống kê số lượng chụp frames
      </h1>
      <div className="flex gap-5 my-3">
        <div>
          <h5 className="text-[#ffc0cb]">Ngày bắt đầu</h5>
          <DateTimePicker
            format="dd-MM-y"
            disableClock={true}
            onChange={setDate}
            value={date}
          />
        </div>

        <div>
          <h5 className="text-[#ffc0cb]">Ngày kết thúc</h5>
          <DateTimePicker
            format="dd-MM-y"
            disableClock={true}
            onChange={setEndDate}
            value={endDate}
          />
        </div>
      </div>

      <div className="mt-2">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-[#ffc0cb]">
            <tr>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Url</th>
              <th className="py-3 px-6">Type Frame</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Capture Count</th>
              <th className="py-3 px-6">Total</th>
            </tr>
          </thead>
          <tbody className="bg-pink-50">
            {data.map((item: any, index: number) => (
              <tr key={index} className="border-b-[1px] border-[#ffc0cb]">
                <td className="py-4 px-6">
                  {moment(date).format("DD/MM/YYYY")}
                </td>
                <td className="py-4 px-6">{item.name}</td>
                <td className="py-4 px-6  flex justify-center">
                  <img
                    src={item.url}
                    alt="Frame"
                    style={{ width: "auto", maxHeight: "50px" }}
                  />
                </td>
                <td className="py-4 px-6">{item.typeFrame}</td>
                <td className="py-4 px-6">{item.price}</td>
                <td className="py-4 px-6">{item.capureCount}</td>
                <td className="py-4 px-6">{item.capureCount * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-full bg-gray-200 text-black"
          >
            {"<"}
          </button>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full ${
                currentPage === page ? "bg-[#ffc0cb]" : "bg-gray-200"
              } text-black`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(30)}
            disabled={currentPage === 30}
            className="w-8 h-8 rounded-full bg-gray-200 text-black"
          >
            {">"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CaptureCount;
