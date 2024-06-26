import React from "react";
import { useNavigate } from "react-router-dom";

interface CustomerProps {
  item: any;
  index: number;
}
const BranchItems: React.FC<CustomerProps> = ({ item, index }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => {
        navigate("/admin/add-branch", { state: { item } });
      }}
      className="flex 
      my-2 
      border-[1px] 
      border-[pink] 
      rounded-2xl
      justify-between
      text-[pink]
      hover:text-white 
      hover:bg-[pink]
      w-full
      cursor-pointer
      "
    >
      <div className="items-center w-full text-center">
        <img
          className="w-full h-[200px] md:h-[300px] lg:h-[250px] sm:h-[400px] rounded-tr-[15px] rounded-tl-[15px]"
          src={item?.url?.replace("http://27.71.26.120","https://phototimevn.com")}
        />
        <div>{item?.name}</div>
      </div>
    </div>
  );
};
export default BranchItems;
