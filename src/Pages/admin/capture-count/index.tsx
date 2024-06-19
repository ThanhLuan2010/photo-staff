import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";

interface FrameData {
  name: string;
  url: string;
  typeFrame: string;
  price: number;
  capureCount: number;
}

const CaptureCount = () => {
  const [date, setDate] = useState<any>(moment().subtract(1, "days"));
  const [endDate, setEndDate] = useState<any>(moment().subtract(1, "days"));
  const [data, setData] = useState<FrameData[]>([]);
  const [filteredData, setFilteredData] = useState<FrameData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const itemsPerPage = 10;

  const fetchData = async () => {
    const startDate = moment(date).format("YYYY-MM-DD");
    const endDateFormatted = moment(endDate).format("YYYY-MM-DD");
    const response = await fetch(
      `https://framemanager.phototimevn.com/Frame?limit=500&page=1&startDate=${startDate}&endDate=${endDateFormatted}`
    );
    const data = await response.json();
    setData(data);
    setFilteredData(data);
  };

  useEffect(() => {
    fetchData();
  }, [date, endDate]);

  useEffect(() => {
    const lowercasedFilter = search.toLowerCase();
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, data]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getDisplayedPages = () => {
    const totalDisplayedPages = 5;
    const halfDisplayedPages = Math.floor(totalDisplayedPages / 2);
    let startPage = Math.max(1, currentPage - halfDisplayedPages);
    let endPage = Math.min(totalPages, currentPage + halfDisplayedPages);

    if (endPage - startPage < totalDisplayedPages - 1) {
      startPage = Math.max(1, endPage - totalDisplayedPages + 1);
    }

    if (endPage - startPage < totalDisplayedPages - 1) {
      endPage = Math.min(totalPages, startPage + totalDisplayedPages - 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const displayedPages = getDisplayedPages();
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
            value={date.toDate()}
          />
        </div>

        <div>
          <h5 className="text-[#ffc0cb]">Ngày kết thúc</h5>
          <DateTimePicker
            format="dd-MM-y"
            disableClock={true}
            onChange={setEndDate}
            value={endDate.toDate()}
          />
        </div>
      </div>

      <div className="my-3">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mt-2">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-[#ffc0cb]">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Url</th>
              <th className="py-3 px-6">Type Frame</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Capture Count</th>
              <th className="py-3 px-6">Total</th>
            </tr>
          </thead>
          <tbody className="bg-pink-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="border-b-[1px] border-[#ffc0cb]">
                  <td className="py-4 px-6">{item.name}</td>
                  <td className="py-4 px-6 flex justify-center">
                    <img
                      src={item.url.replace(
                        "http://27.71.26.120",
                        "https://phototimevn.com"
                      )}
                      alt="Frame"
                      style={{ width: "auto", maxHeight: "50px" }}
                    />
                  </td>
                  <td className="py-4 px-6">{item.typeFrame}</td>
                  <td className="py-4 px-6">{item.price}</td>
                  <td className="py-4 px-6">{item.capureCount}</td>
                  <td className="py-4 px-6">{item.capureCount * item.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center space-x-2 mt-4">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="w-8 h-8 rounded-full bg-gray-200 text-black"
            >
              {"<"}
            </button>
          )}
          {displayedPages.map((page) => (
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
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 text-black"
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureCount;
