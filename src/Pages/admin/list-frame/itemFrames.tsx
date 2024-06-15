import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../api/request.tsx";

interface ItemFramesProps {
  item: any;
  index?: number;
}
const ItemFrame: React.FC<ItemFramesProps> = ({ item, index }) => {
  const [indexFrame, setindexFrame] = useState(item?.index);
  const navigate = useNavigate();

  const handleKeyPress = async(event: any) => {
    if (event.key === "Enter") {
      const res = await request("frame/edit-frame", {index:indexFrame, id:item?.id}, "POST");
      alert(res?.message)
    }
  };

  return (
    <div className="w-full">
      <div
        key={index}
        onClick={() => {
          navigate("/admin/add-frame", { state: { item } });
        }}
        className="shadow-lg mt-5 p-2 rounded-md bg-white hover:bg-[pink] cursor-pointer"
      >
        <img
          src={item?.url?.replace(
            "http://27.71.26.120",
            "https://phototimevn.com"
          )}
          className="w-full h-[300px] object-contain"
        />
        <div className="mt-2 text-center line-clamp-1">{item?.name}</div>
      </div>
      <div className="w-auto bg-red-400" onClick={() => {}}>
        <input
          placeholder="index"
          type="number"
          className="w-full"
          value={indexFrame}
          onChange={(e) => setindexFrame(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};
export default ItemFrame;
