"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { request } from "../../../api/request.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import { GetList } from "../../../hook/getList.tsx";

const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().required("Vui lòng điền tên khung ảnh"),
  nameEn: Yup.string().required("Vui lòng điền tên khung ảnh"),
  nameKo: Yup.string().required("Vui lòng điền tên khung ảnh"),
});

const dataType: any = [
  {
    name: "4Cuts",
    nameEn: "4Cuts",
    key: "FC",
    nameKo: "4컷",
  },
  {
    name: "Small size",
    nameEn: "Small size",
    key: "TSH",
    nameKo: "스몰 사이즈",
  },
  {
    name: "Big size",
    nameEn: "Big size",
    key: "B",
    nameKo: "빅 사이즈",
  },
  {
    name: "Profile size",
    nameEn: "Profile size",
    key: "P",
    nameKo: "프로필 사이즈",
  },
  {
    name: "Full size",
    nameEn: "Full size",
    key: "TH",
    nameKo: "풀 사이즈",
  },
  {
    name: "Free size",
    nameEn: "Free size",
    key: "F",
    nameKo: "프리 사이즈",
  },
];

interface IFormInput {
  name: string;
  nameEn: string;
  nameKo: string;
}

const CreateCategoryFrame = (props: any) => {
  const [isUpdate, setisUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEvent, setIsEvent] = useState<boolean>(false);
  const [arrTypeFrame, setArrTypeFrame] = useState<any>([]);
  const location = useLocation();
  const { item } = location.state || {};

  const { data: dataCategory } = GetList<any>({
    url: "frame/get-list-category",
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<IFormInput>({
    defaultValues: {
      name: item?.categoryName || "",
      nameEn: item?.categoryNameEn || "",
      nameKo: item?.categoryNameKo || "",
    },
    resolver: yupResolver(validationSchemaRegister),
  });

  const notify = (title: string) => toast(title);

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (item) {
      setisUpdate(true);
      setIsEvent(item?.isEvent);
    }
  }, [item]);

  const onSubmit = async (result: IFormInput) => {
    setLoading(true);
    const body = {
      categoryName: result.name,
      categoryNameEn: result.nameEn,
      categoryNameKo: result.nameKo,
      categoryType: dataCategory?.length + 1 || 999,
      isEvent: isEvent,
      subCategory: arrTypeFrame,
    };
    if (isUpdate) {
      const res = await request("frame/edit-frame-category", body, "POST");
      notify(res?.message || "Đã có lỗi xảy ra");
    } else {
      const res = await request("frame/create-frameCategory", body, "POST");
      notify(res?.message || "Đã có lỗi xảy ra");
    }

    setLoading(false);
  };

  const classInput =
    "w-full border-[1px] border-[pink] rounded-md px-2 py-2 outline-none";
  const classLable = "font-semibold text-[pink]";
  return (
    <LoadingWrap active={loading}>
      <div className="text-center font-bold text-[pink] text-xl">
        {isUpdate ? "SỬA DANH MỤC" : "THÊM DANH MỤC"}
      </div>
      <div className="mb-3">
        <div className={classLable}>Tên danh mục</div>
        <input
          onChange={(value) => handelOnchange(value, "name")}
          type="text"
          className={classInput}
          defaultValue={getValues("name")}
        />
        <div>
          {errors?.name ? (
            <text style={{ color: "red" }}>{errors.name?.message}</text>
          ) : null}
        </div>
      </div>

      <div className="mb-3">
        <div className={classLable}>Tên danh mục Tiếng Anh</div>
        <input
          onChange={(value) => handelOnchange(value, "nameEn")}
          type="text"
          className={classInput}
          defaultValue={getValues("nameEn")}
        />
        <div>
          {errors?.nameEn ? (
            <text style={{ color: "red" }}>{errors.nameEn?.message}</text>
          ) : null}
        </div>
      </div>

      <div className="mb-3">
        <div className={classLable}>Tên danh mục Tiếng Hàn</div>
        <input
          onChange={(value) => handelOnchange(value, "nameKo")}
          type="text"
          className={classInput}
          defaultValue={getValues("nameKo")}
        />
        <div>
          {errors?.nameKo ? (
            <text style={{ color: "red" }}>{errors.nameKo?.message}</text>
          ) : null}
        </div>
      </div>

      <div
        onClick={() => setIsEvent(!isEvent)}
        className="flex items-center text-[pink] cursor-pointer"
      >
        <div className="border-[1px] border-[pink] w-[1.5rem] h-[1.5rem] rounded-full mr-2 items-center justify-center flex">
          {isEvent && (
            <div className="bg-[pink] w-[1rem] h-[1rem] rounded-full"></div>
          )}
        </div>
        <p>Thêm vào mục sự kiện</p>
      </div>

      <div className="flex justify-center mt-10 ">
        <button
          className="mb-40 bg-[pink] text-white py-3 px-6 rounded-md"
          onClick={handleSubmit(onSubmit)}
        >
          {isUpdate ? "Sửa danh mục" : "Thêm danh mục"}
        </button>
      </div>
      <ToastContainer />
    </LoadingWrap>
  );
};

export default CreateCategoryFrame;
