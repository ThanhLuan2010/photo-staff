"use client";
import React from "react";
import { GetList } from "../../../hook/getList.tsx";
import CategoryItem from "./CategoryItem.tsx";

const ListCategoryFrame = () => {
  const { data: listCategory } = GetList<any>({
    url: "frame/get-list-category",
  });

  const renderCategory = (item: any, index: number) => {
    return <CategoryItem key={index} item={item} index={index} />;
  };
  return (
    <div>
      <div className="text-center font-bold text-[pink] text-2xl">
        Danh mục Frame
      </div>
      <div>{listCategory?.length > 0 && listCategory.map(renderCategory)}</div>
    </div>
  );
};

export default ListCategoryFrame;
