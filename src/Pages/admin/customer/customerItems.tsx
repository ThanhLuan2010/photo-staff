"use client";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";

interface CustomerProps {
  item: any;
  index: number;
}
const CustomerItems: React.FC<CustomerProps> = ({ item, index }) => {
  const dataString = JSON.stringify(item);
  const navigate = useNavigate();
  // const location = useLocation();
  // const { id } = location.state || {}; // Truy cập vào 'id' từ 'state', mặc định là trả về undefined nếu không có state
  return (
    <div
      onClick={() => {
        navigate("/admin/editUser", { state: { item } });
      }}
      className="flex 
      my-2 
      border-[1px] 
      border-[pink] 
      rounded-2xl
      w-full 
      py-4 
      px-5 
      justify-between
      text-[pink]
      hover:text-white 
      hover:bg-[pink]
      cursor-pointer
      "
    >
      <div className="flex items-center w-full">
        {item?.avatar ? (
          <img className="w-[40px] h-[40px] rounded-full" src={item?.avatar?.replace("http://27.71.26.120","https://phototimevn.com")} />
        ) : (
          <div className="border-[1px] border-[pink] self-start p-1 rounded-full">
            <AiOutlineUser size={30} />
          </div>
        )}
        <div className="flex-col ml-2">
          <div>{item?.name}</div>
          <div>{item?.phoneNumber}</div>
        </div>
      </div>

      <div className="flex-col hidden w-full md:block">
        <div>Số tích điểm: {item?.accumulate_points?.count}</div>
        <div>Số điểm danh: {item?.dailyCheckin?.count}</div>
      </div>

      <div className="flex-col hidden w-full md:block">
        <div>Số tích điểm: {item?.accumulate_points?.count}</div>
        <div>Số điểm danh: {item?.dailyCheckin?.count}</div>
      </div>
    </div>
  );
};
export default CustomerItems;
