import React from "react";
import { useNavigate } from "react-router-dom";

interface CustomerProps {
  item: any;
  index: number;
}
const CustomerItems: React.FC<CustomerProps> = ({ item, index }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => {
        navigate("/admin/add-banner", { state: { item } });
      }}
      className="flex 
      my-2 
      border-[1px] 
      border-[pink] 
      rounded-2xl
      w-fit
      py-4 
      px-5 
      justify-between
      text-[pink]
      hover:text-white 
      hover:bg-[pink]
      cursor-pointer
      "
    >
      <img src={item?.url?.replace("http://27.71.26.120","https://phototimevn.com")} className="object-contain h-[200px]" />
    </div>
  );
};
export default CustomerItems;
