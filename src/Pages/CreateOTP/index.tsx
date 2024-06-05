import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import { BASE_URL, request } from "../../api/request.tsx";
import { Dropdown } from "../../component/Dropdow/index.tsx";
import LoadingWrap from "../../component/LoadingWrap.tsx";
import data from "../../contains/data.json";
import { authSelect } from "../../store/slice/auth.slice.tsx";

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
function RequestCoupon(): React.JSX.Element {
  const [selectedCoupon, setselectedCoupon] = useState<
    TypeCoupon | null | undefined
  >(null);
  const [selectedPrice, setselectedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { userInfo } = useSelector(authSelect);

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

  const onSubmit = async (value: TypeBody) => {
    try {
      setLoading(true);
      if (!selectedImage) {
        notify("Vui lòng chọn hình ảnh");
      } else {
        const response = await request(
          "staff/request-coupon",
          {
            category: value.typeCoupon,
            amount: value.price,
            url: selectedImage,
            description: value.reason,
            branch: userInfo?.branh_resgisted,
          },
          "POST"
        );
        notify(response.message);
        setcouponResult(response?.data);
      }
      setLoading(false);
    } catch (e) {
      console.log("====e===", e);
      setLoading(false);
    }
  };

  return (
    <LoadingWrap active={loading}>
      <div className="relative">
        <h1 className="mt-10 text-5xl font-semibold text-center text-primary">
          REQUEST COUPON
        </h1>
        <div className="grid-flow-col gap-5 mt-5 md:flex sm: md:grid-flow-row">
          <div className="w-full text-primary">
            <p className="font-semibold">Chọn loại coupon</p>
            <Dropdown
              data={data}
              placeholder="Chọn coupon"
              onSelectItem={(coupon) => {
                setselectedCoupon(coupon);
                const cp_name = coupon.couponName;
                setValue("typeCoupon", cp_name);
              }}
              filedKey="couponName"
              value={selectedCoupon?.couponName}
            />
            {errors.typeCoupon && (
              <p className="text-red-500">{errors.typeCoupon?.message}</p>
            )}
          </div>
          <div className="w-full text-primary">
            <p className="font-semibold">Chọn giá tiền</p>
            <Dropdown
              data={selectedCoupon?.ListPrice}
              placeholder="Chọn giá"
              onSelectItem={({ price }) => {
                setselectedPrice(price);
                setValue("price", price);
              }}
              filedKey="price"
              value={selectedPrice}
            />
            {errors.price && (
              <p className="text-red-500">{errors.price?.message}</p>
            )}
          </div>
        </div>

        <div className="mt-5">
          {selectedImage && (
            <img src={selectedImage?.replace("http://27.71.26.120","https://phototimevn.com")} className="w-[100px] h-[100px]" />
          )}
          <input
            onChange={handleImageChange}
            type="file"
            accept=".png, .jpg, .jpeg"
            className="fill-none"
          />
        </div>

        <div className="mt-5">
          <p className="font-bold text-primary">Lý do yêu cầu</p>
          <textarea
            placeholder="Nhập lý do yêu cầu coupon"
            className="w-full px-5 py-3 rounded-xl h-[100px] border border-primary outline-none"
            onChange={(e) => handelOnchange(e, "reason")}
          />
          {errors.reason && (
            <p className="text-red-500">{errors.reason?.message}</p>
          )}
        </div>

        <div className="flex justify-center mt-5">
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-10 py-2 text-white rounded-full bg-primary"
          >
            Gửi yêu cầu
          </button>
        </div>
      </div>
      {couponResult && (
        <div className="absolute w-full h-screen bg-[rgba(0,0,0,0.5)] bottom-[-50%] justify-center items-center flex">
          <div className="items-center justify-center px-5 py-5 mx-5 text-center bg-white w-fit rounded-2xl">
            <div className="relative flex justify-center flex-1 py-10">
              <div className="bg-[#F59EBB] rounded-2xl px-2 py-2 w-auto h-auto flex">
                <div className="flex-1 w-auto px-2 py-2 text-center border border-white rounded-2xl">
                  <p className="text-[#AD287D] font-bold sm:text-xs md:text-lg">
                    Discount
                  </p>
                  <p className="text-[#AD287D] font-bold text-lg">
                    {couponResult.PRICE}
                  </p>
                  <p className="text-sm border-[#AD287D] border-2 rounded-full px-1 text-[#AD287D] bg-white w-auto line-clamp-1">
                    {couponResult.USE_YN === "Y"
                      ? "Đã sử dụng"
                      : "Chưa sử dụng"}
                  </p>
                </div>
              </div>

              <div className="bg-[#F59EBB] rounded-2xl px-2 py-2 h-auto flex">
                <div className="px-2 py-2 border border-white rounded-2xl">
                  <p className="font-semibold text-white sm:text-xs md:text-xl line-clamp-2">
                    {couponResult.Titile}
                  </p>
                  <p className="sm:text-sm md:text-xl text-[#AD287D] font-bold">
                    CODE: {couponResult.EVENT_POINT}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setcouponResult(null)}
              className="w-full py-3 text-white bg-red-500 rounded-full"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </LoadingWrap>
  );
}

export default RequestCoupon;
