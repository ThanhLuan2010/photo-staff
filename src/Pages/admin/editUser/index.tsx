import { useState } from "react";
// import "react-quill/dist/quill.snow.css";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { request } from "../../../api/request.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import { GetList } from "../../../hook/getList.tsx";
import React from "react";
import { useLocation } from "react-router-dom";

const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().required("Vui lòng điền tên người dùng"),
  birdthDay: Yup.string().required("Vui lòng điền ngày sinh"),
  checkin: Yup.string().required("Vui lòng điền số ngày điểm danh"),
  accumulate_points: Yup.string().required("Vui lòng điền số lần tích điểm"),
  email: Yup.string().optional(),
  phoneNumber: Yup.string().required("Vui lòng điền số điện thoại"),
});
interface InputForm {
  name: string;
  birdthDay: string;
  checkin: string;
  accumulate_points: string;
  email: string;
  phoneNumber: string;
}

interface dataParams {
  name: string;
  birdthDay: string;
  dailyCheckin: any;
  accumulate_points: any;
  email: string;
  phoneNumber: string;
  id: string;
}
const EditUser = () => {
  const [loading, setLoading] = useState(false);
  const [couponName, setcouponName] = useState("");
  const [couponAmount, setcouponAmount] = useState("");
  const location = useLocation();
  const { item } = location.state || {}; // Truy cập vào 'id' từ 'state', mặc định là trả về undefined nếu không có state
  const { data: listVoucher, reLoad } = GetList<any>({
    url: `users/Admin-get-user-voucher`,
    params: { userId: item?.id, limit:1000},
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<InputForm>({
    defaultValues: {
      name: item?.name || "",
      birdthDay: item?.birdthDay || "",
      checkin: item?.dailyCheckin?.count?.toString() || "",
      accumulate_points: item?.accumulate_points?.count?.toString() || "",
      email: item?.email || "",
      phoneNumber: item?.phoneNumber || "",
    },
    resolver: yupResolver(validationSchemaRegister),
  });

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  const notify = (title: string) => toast(title);

  const onSubmit = async (_data: any) => {
    setLoading(true);
    const body = {
      name: _data.name,
      email: _data.email,
      birdthDay: _data.birdthDay,
      accumulate_points: {
        count: _data.accumulate_points,
      },
      dailyCheckin: {
        count: _data.checkin,
      },
      userId: item?.id,
    };
    const res = await request("users/adminChangeInfo", body, "POST");
    if (res?.status) {
      // navigation('/branch/list')
    }
    notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");

    setLoading(false);
  };

  const onAddCoupon = async () => {
    if (!couponAmount) {
      notify("Vui lòng nhập mệnh giá coupon");
    }
    if (!couponName) {
      notify("Vui lòng nhập tên coupon");
    }
    if (couponAmount && couponName) {
      const body = {
        userId: item?.id,
        amount: parseInt(couponAmount),
        category: couponName,
      };
      const res = await request("users/add-coupon", body, "POST");
      reLoad();
      notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const onDeleteVoucher = async (item: any) => {
    setLoading(true);
    const response = await request(
      "coupon/deleteCoupon",
      {
        code: item?.EVENT_POINT,
        userId: item?.User_id,
      },
      "POST"
    );
    notify(
      response?.message || response?.status
        ? "Đã xóa coupon thành công"
        : "Đã có lỗi xảy ra, vui lòng thử lại sau"
    );
    reLoad();
    setLoading(false);
  };

  const renderListUser = (item: any, index: number) => {
    return (
      <tr className="" key={index + "coupon"}>
        <td className="border-[1px] border-[pink] text-center">{index + 1}</td>
        <td className="border-[1px] border-[pink] text-center">
          {item?.Category}
        </td>
        <td className="border-[1px] border-[pink] text-center">
          {item?.EVENT_POINT}
        </td>
        <td className="border-[1px] border-[pink] text-center">
          {item?.PRICE}
        </td>
        <td className="border-[1px] border-[pink] text-center">
          {parseInt(item?.Expire_Date) > 0 &&
            moment(item?.Send_date)
              ?.add(item?.Expire_Date, "days")
              .format("DD/MM/YYYY")}
          {/* {} */}
        </td>
        <td className="border-[1px] border-[pink] text-center">
          {item?.USE_YN === "N" ? "Chưa sử dụng" : "Đã sử dụng"}
        </td>
        <td className="border-[1px] border-[pink] text-center">
          <button
            onClick={() => onDeleteVoucher(item)}
            className="bg-red-600 px-5 py-2 rounded-md border-[1px] my-2 text-white"
          >
            Xoá
          </button>
        </td>

        {/* <MyDropdown onDelete={() => onDeleteVoucher(item)} /> */}
      </tr>
    );
  };

  return (
      <LoadingWrap active={loading}>
        <div className="w-full">
          <strong className="text-center text-[pink]">
            Thông tin người dùng
          </strong>
          <div className="my-4 text-[pink] flex-col w-full">
            <div className="font-bold">Tên người dùng</div>
            <input
              onChange={(value) => handelOnchange(value, "name")}
              placeholder="Nhập tên người dùng"
              defaultValue={getValues("name")}
              className="border-[1px] border-[pink] rounded-lg p-2 outline-none w-full"
            />
            <div>
              {errors?.name ? (
                <div style={{ color: "red" }}>{errors.name?.message}</div>
              ) : null}
            </div>
          </div>

          <div className="my-4 text-[pink] flex-col w-full">
            <div className="font-bold">Ngày sinh</div>
            <input
              onChange={(value) => handelOnchange(value, "birdthDay")}
              placeholder="Nhập ngày sinh"
              defaultValue={getValues("birdthDay")}
              className="border-[1px] border-[pink] rounded-lg p-2 outline-none w-full"
            />
            <div>
              {errors?.birdthDay ? (
                <text style={{ color: "red" }}>
                  {errors.birdthDay?.message}
                </text>
              ) : null}
            </div>
          </div>

          <div className="flex gap-4 xs:flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row">
            <div className="my-4 text-[pink] flex-col w-full">
              <div className="font-bold">Số lần tích điểm</div>
              <input
                onChange={(value) => handelOnchange(value, "accumulate_points")}
                placeholder="Số lần tích điểm"
                // defaultValue={}
                className="border-[1px] border-[pink] rounded-lg p-2 outline-none w-full"
                defaultValue={getValues("accumulate_points")}
              />
              <div>
                {errors?.accumulate_points ? (
                  <text style={{ color: "red" }}>
                    {errors.accumulate_points?.message}
                  </text>
                ) : null}
              </div>
            </div>

            <div className="my-4 text-[pink] flex-col w-full">
              <div className="font-bold">Số lần điểm danh</div>
              <input
                onChange={(value) => handelOnchange(value, "checkin")}
                placeholder="Số lần điểm danh"
                defaultValue={getValues("checkin")}
                className="border-[1px] border-[pink] rounded-lg p-2 outline-none w-full"
              />
              <div>
                {errors?.checkin ? (
                  <text style={{ color: "red" }}>
                    {errors.checkin?.message}
                  </text>
                ) : null}
              </div>
            </div>
          </div>

          <div className="my-4 text-[pink] flex-col w-full">
            <div className="font-bold">Email</div>
            <input
              onChange={(value) => handelOnchange(value, "email")}
              placeholder="Email"
              className="border-[1px] border-[pink] rounded-lg p-2 outline-none w-full"
              defaultValue={getValues("email")}
            />
            <div>
              {errors?.email ? (
                <text style={{ color: "red" }}>{errors.email?.message}</text>
              ) : null}
            </div>
          </div>
          <div className="my-4 text-[pink] flex-col w-full">
            <div className="font-bold">Số điện thoại</div>
            <input
              placeholder="Số điện thoại"
              value={getValues("phoneNumber")}
              className="border-[1px] border-[pink] rounded-lg p-2 outline-none w-full"
            />
            <div>
              {errors?.phoneNumber ? (
                <text style={{ color: "red" }}>
                  {errors.phoneNumber?.message}
                </text>
              ) : null}
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          className="bg-[pink] px-10 py-3 rounded-md text-white"
        >
          Chỉnh sửa
        </button>

        <div className="text-3xl w-full border-t-[2px] mt-10 pt-10 text-[pink]">
          Thêm Coupon
        </div>
        <div className="mt-5 mb-3">
          <div className="font-bold text-[pink]">Tên Coupon</div>
          <input
            value={couponName}
            onChange={(e) => setcouponName(e.target.value)}
            type="text"
            className="border-[1px] border-[pink] w-full py-2 rounded-md"
          />
        </div>

        <div className="mt-5 mb-3">
          <div className="font-bold text-[pink]">Mệnh giá</div>
          <input
            value={couponAmount}
            onChange={(e) => setcouponAmount(e.target.value)}
            type="text"
            className="border-[1px] border-[pink] w-full py-2 rounded-md"
          />
        </div>

        <div className="mb-3">
          <button
            className="bg-[pink] px-10 py-3 rounded-md text-white"
            onClick={onAddCoupon}
          >
            <text>Thêm coupon</text>
          </button>
        </div>
        <div>Danh sách Coupon</div>
        <table className="w-full">
          <tbody className="w-full">
            <tr className="border-[1px] w-full border-[pink] text-center">
              <td className="border-[1px] border-[pink]">#</td>
              <td className="border-[1px] border-[pink]">Tên coupon</td>
              <td className="border-[1px] border-[pink]">Mã Coupon</td>
              <td className="border-[1px] border-[pink]">Giá tiền</td>
              <td className="border-[1px] border-[pink]">Ngày hết hạn</td>
              <td className="border-[1px] border-[pink]">Trạng thái</td>
              <td className="border-[1px] border-[pink]">Hành động</td>
            </tr>
            {listVoucher?.recordset?.length > 0 &&
              listVoucher?.recordset?.map(renderListUser)}
          </tbody>
        </table>
        <ToastContainer />
      </LoadingWrap>
  );
};

export default EditUser;
