import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import { Dropdown } from "../../../component/Dropdow/index.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import data from "../../../contains/data.json";

type TypeCoupon = {
  couponName: string | null;
  ListPrice: any;
};

const validationSchemaRegister = Yup.object().shape({
  typeCoupon: Yup.string().required("Vui lòng chọn loại coupon"),
  price: Yup.string().required("Vui lòng chọn số tiền"),
  reason: Yup.string().required("Vui lòng nhập lý do yêu cầu coupon"),
});

export type TypeCouponResult = {
  CREATE_DATE: string;
  Category: string;
  Description_E: string;
  Description_K: string;
  Description_V: string;
  EVENT_HDD: string;
  EVENT_POINT: string;
  Expire_Date: number;
  PRICE: number;
  SEQ: number;
  Send_date: string | null;
  Titile: string;
  Titile_E: string;
  Titile_K: string;
  UPDATE_DATE: string | null;
  USE_HDD: string;
  USE_YN: string;
  User_id: string | null;
};
function DetailRequestCouon(): React.JSX.Element {
  const [selectedCoupon, setselectedCoupon] = useState<
    TypeCoupon | null | undefined
  >(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { item } = location.state || {};
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      typeCoupon: "",
      price: "",
      reason: "",
    },
    resolver: yupResolver(validationSchemaRegister),
  });

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  return (
    <LoadingWrap active={loading}>
      <div className="relative">
        <h1 className="mt-10 text-5xl font-semibold text-center text-primary">
          REQUEST COUPON DETAIL
        </h1>
        <div className="grid-flow-col gap-5 mt-5 md:flex sm: md:grid-flow-row">
          <div className="w-full text-primary">
            <p className="font-semibold">Loại coupon</p>
            <Dropdown
              data={data}
              disabled={true}
              placeholder="Chọn coupon"
              onSelectItem={(coupon) => {}}
              filedKey="couponName"
              value={item?.coupon?.Category}
            />
            {errors.typeCoupon && (
              <p className="text-red-500">{errors.typeCoupon?.message}</p>
            )}
          </div>
          <div className="w-full text-primary">
            <p className="font-semibold">Giá tiền</p>
            <Dropdown
              data={selectedCoupon?.ListPrice}
              placeholder="Chọn giá"
              onSelectItem={({ price }) => {}}
              disabled={true}
              filedKey="price"
              value={item?.coupon?.PRICE}
            />
            {errors.price && (
              <p className="text-red-500">{errors.price?.message}</p>
            )}
          </div>
        </div>

        <Box width={1 / 4} height={1 / 4} mt={5}>
          {item?.url && (
            <div
              style={{
                position: "relative",
              }}
            >
              <img
                src={item?.url?.replace(
                  "http://27.71.26.120",
                  "https://phototimevn.com"
                )}
                className="object-contain w-full"
                onMouseEnter={(e) => {
                  // update image size and turn on magnifier
                  const elem = e.currentTarget;
                  const { width, height } = elem.getBoundingClientRect();
                  setSize([width, height]);
                  setShowMagnifier(true);
                }}
                onMouseMove={(e) => {
                  // update cursor position
                  const elem = e.currentTarget;
                  const { top, left } = elem.getBoundingClientRect();

                  const x = e.pageX - left - window.pageXOffset;
                  const y = e.pageY - top - window.pageYOffset;
                  setXY([x, y]);
                }}
                onMouseLeave={() => {
                  // hide magnifier
                  setShowMagnifier(false);
                }}
                alt={"img"}
              />
              <div
                style={{
                  display: showMagnifier ? "" : "none",
                  position: "absolute",
                  // prevent magnifier blocks the mousemove event of img
                  pointerEvents: "none",
                  // set size of magnifier
                  height: `${200}px`,
                  width: `${200}px`,
                  // move element center to cursor pos
                  top: `${y - 200 / 2}px`,
                  left: `${x - 200 / 2}px`,
                  opacity: "1", // reduce opacity so you can verify position
                  border: "1px solid lightgray",
                  backgroundColor: "white",
                  backgroundImage: `url('${item?.url?.replace(
                    "http://27.71.26.120",
                    "https://phototimevn.com"
                  )}')`,
                  backgroundRepeat: "no-repeat",

                  //calculate zoomed image size
                  backgroundSize: `${imgWidth * 5}px ${imgHeight * 5}px`,

                  //calculate position of zoomed image.
                  backgroundPositionX: `${-x * 5 + 200 / 2}px`,
                  backgroundPositionY: `${-y * 5 + 200 / 2}px`,
                }}
              ></div>
            </div>
          )}
        </Box>

        <div className="mt-5">
          <p className="font-bold text-primary">Lý do yêu cầu</p>
          <textarea
            placeholder="Nhập lý do yêu cầu coupon"
            className="w-full px-5 py-3 rounded-xl h-[100px] border border-primary outline-none"
            onChange={(e) => handelOnchange(e, "reason")}
            value={item?.description}
            disabled
          />
          {errors.reason && (
            <p className="text-red-500">{errors.reason?.message}</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </LoadingWrap>
  );
}

export default DetailRequestCouon;
