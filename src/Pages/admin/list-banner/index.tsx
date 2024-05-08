import React from "react";
import { GetList } from "../../../hook/getList.tsx";
import BannerItems from "./bannerItems.tsx";

interface PageChangeEvent {
  selected: number;
}

const ListBanner = () => {
  const { data } = GetList<any>({ url: "home/get-home-banner" });

  const renderUser = (item: any, index: number) => {
    return (
      <div className="flex justify-center">
        <BannerItems item={item} key={index} index={index} />
      </div>
    );
  };
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {data?.length > 0 && data?.map(renderUser)}
    </div>
  );
};

export default ListBanner;
