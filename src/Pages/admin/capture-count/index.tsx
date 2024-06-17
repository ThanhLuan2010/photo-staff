import React from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import { GetList } from "../../../hook/getList.tsx";

type CardData = {
  Category: string;
  Price: number;
  Count: number;
};
const CaptureCount = () => {
  const { data: couponData } = GetList<CardData[]>({
    url: "coupon/get-coupon-count",
  });

  return (
    <div>
      <div className=" mt-2 ">
        <h1 className="mt-10 mb-2 font-bold text-[pink] text-2xl uppercase">
          Số lượng Coupon trong kho
        </h1>
        <table>
          <tbody>
            <tr className="border-b-[3px] border-[pink] text-[pink] font-bold">
              <th className="text-center ">Name</th>
              <th className="text-center">Url</th>
              <th className="text-center">Type Frame</th>
              <th className="text-center">Price</th>
              <th className="text-center">Capture Count</th>
              <th className="text-center">Total</th>
            </tr>
            <tr>
              <td className="border-r-[1px] border-[pink] border-l-[1px] ">
                {couponData && (
                  <div>
                    {couponData?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[150px]"
                          key={index + "coupon"}
                        >
                          <div>{item?.Category}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>

              <td className="border-r-[1px] border-[pink]">
                {couponData && (
                  <div>
                    {couponData?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center w-[150px]"
                          key={index + "coupon"}
                        >
                          <div>{item?.Price}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>

              <td className="border-r-[1px] border-[pink]">
                {couponData && (
                  <div className="items-center justify-center flex-col w-[150px]">
                    {couponData?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center"
                          key={index + "coupon"}
                        >
                          <div>{item?.Count}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {couponData && (
                  <div className="items-center justify-center flex-col w-[150px]">
                    {couponData?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center"
                          key={index + "coupon"}
                        >
                          <div>{item?.Count}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {couponData && (
                  <div className="items-center justify-center flex-col w-[150px]">
                    {couponData?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center"
                          key={index + "coupon"}
                        >
                          <div>{item?.Count}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>
              <td className="border-r-[1px] border-[pink]">
                {couponData && (
                  <div className="items-center justify-center flex-col w-[150px]">
                    {couponData?.map((item: any, index: number) => {
                      return (
                        <div
                          className="border-b-[1px] h-[40px] border-[pink] items-center flex justify-center"
                          key={index + "coupon"}
                        >
                          <div>{item?.Count}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaptureCount;
