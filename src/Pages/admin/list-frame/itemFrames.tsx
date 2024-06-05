import React from "react";
import { useNavigate } from "react-router-dom";

interface ItemFramesProps {
  item: any;
  index?: number;
}
const ItemFrame: React.FC<ItemFramesProps> = ({ item, index }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => {
        navigate("/admin/add-frame", { state: { item } });
      }}
      className="shadow-lg mt-5 p-2 rounded-md bg-white hover:bg-[pink] cursor-pointer"
    >
      <img src={item?.url?.replace("http://27.71.26.120","https://phototimevn.com")} className="w-full h-[300px] object-contain" />
      <div className="mt-2 text-center">{item?.name}</div>
    </div>
  );
};
export default ItemFrame;
