import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import { BASE_URL, request } from "../../../api/request.tsx";
import { Dropdown } from "../../../component/Dropdow/index.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import data from "../../../contains/data.json";
import { authSelect } from "../../../store/slice/auth.slice.tsx";
import { useLocation } from "react-router-dom";

type TypeCoupon = {
  couponName: string | null;
  ListPrice: any;
};

type TypeBody = {
  typeCoupon: string | null;
  price: any;
  reason: any;
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
  const [selectedPrice, setselectedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { userInfo } = useSelector(authSelect);
  const location = useLocation();
  const { item } = location.state || {};

  const [couponResult, setcouponResult] = useState<TypeCouponResult | null>(
    null
  );

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

  const handleImageChange = async (event) => {
    setLoading(true);
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    try {
      const res = await fetch(`${BASE_URL}upload/upload`, {
        method: "POST",
        body: formData,
      });
      const resJson = await res.json();
      if (resJson?.success) {
        setSelectedImage(resJson?.data?.url);
      } else {
        notify(resJson?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (e) {
      notify("Đã có lỗi xảy ra, vui lòng thử lại sau");
      console.log("=======e=======", e);
    }
    setLoading(false);
  };

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  const notify = (title: string) => toast(title);



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

        <div className="mt-5">
          {item?.url && (
            <img src={item?.url?.replace("http://27.71.26.120","https://phototimevn.com")} className="object-contain w-full" />
          )}
        </div>

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
