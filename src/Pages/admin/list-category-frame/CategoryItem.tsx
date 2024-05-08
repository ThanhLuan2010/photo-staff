import React from "react";
import { useNavigate } from "react-router-dom";

interface CustomerProps {
  item: any;
  index: number;
}
const CategoryItem: React.FC<CustomerProps> = ({ item, index }) => {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      onClick={() => {
        navigate("/admin/add-category", { state: { item } });
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
      text-center
      "
    >
      <div className="items-center w-full">
        <div>Tên Danh mục</div>
        <div>{item?.categoryName}</div>
      </div>

      <div className="items-center w-full">
        <div>Tên Danh mục tiếng Anh</div>
        <div>{item?.categoryNameEn}</div>
      </div>
      <div className="items-center w-full">
        <div>Tên Danh mục tiếng Hàn</div>
        <div>{item?.categoryNameKo}</div>
      </div>
    </div>
  );
};
export default CategoryItem;
