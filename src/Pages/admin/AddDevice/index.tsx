import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import { Dropdown } from "../../../component/Dropdow/index.tsx";
import { GetList } from "../../../hook/getList.tsx";
import { request } from "../../../api/request.tsx";

interface InputForm {
  name: string;
  branchId: string;
  isUpdated?: boolean;
  lastUpdatedAt?: string;
  deviceId: string;
}

const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().required("Vui lòng điền tên thiết bị"),
  branchId: Yup.string().required("Vui lòng chọn chi nhánh"),
  deviceId: Yup.string().required("Vui lòng điền mã thiết bị"),
});

function AddDevice() {
  const location = useLocation();
  const { item } = location.state || {};
  const [loading, setloading] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const { data }: any = GetList({
    url: "branch/get-list-branch",
    params: { limit: 1000 },
  });
  const navigate = useNavigate();
  const [branch, setBranch] = useState<any>(null);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<InputForm>({
    defaultValues: {
      name: item?.name || "",
      branchId: item?.branchId || "",
      isUpdated: item?.isUpdated || null,
      deviceId: item?.deviceId || "",
    },
    resolver: yupResolver(validationSchemaRegister),
  });

  useEffect(() => {
    if (item) {
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
  }, [item]);

  useEffect(() => {
    if (data?.results?.length > 0 && item && item?.branchId) {
      const branchFound = data?.results?.find(
        (i: any) => i?.id === item?.branchId
      );
      if (branchFound) {
        setBranch(branchFound);
      }
    }
  }, [data, item]);

  const classInput =
    "w-full border-[1px] border-[pink] rounded-md px-2 py-2 outline-none";
  const classLable = "font-semibold text-[pink]";

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  const onSubmit = async (data: InputForm) => {
    try {
      setloading(true);
      let response: any;
      if (isUpdate) {
        response = await request(
          "device/edit-device",
          { ...data, id: item?.id },
          "POST"
        );
      } else {
        response = await request("device/create-device", data, "POST");
      }
      setloading(false);
      if (response.status) {
        navigate(-1);
      }
      notify(response?.message);
    } catch (error) {
      notify("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const notify = (title: string) => toast(title);

  return (
    <LoadingWrap active={loading}>
      <div className="">
        <div className="">
          <text className="font-bold text-[pink] text-[24px]">
            {isUpdate ? "CHỈNH SỬA" : "THÊM THIẾT BỊ"}
          </text>

          <div className="mt-10 mb-3">
            <div className={classLable}>Tên thiết bị</div>
            <input
              onChange={(value) => handelOnchange(value, "name")}
              placeholder="Nhập tên thiết bị"
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
            <div className={classLable}>Mã thiết bị</div>
            <input
              onChange={(value) => handelOnchange(value, "deviceId")}
              placeholder="Nhập mã thiết bị"
              className={classInput}
              defaultValue={getValues("deviceId")}
            />
            <div>
              {errors?.name ? (
                <text style={{ color: "red" }}>{errors.deviceId?.message}</text>
              ) : null}
            </div>
          </div>

          <div className="mb-3">
            <div className={classLable}>Chi nhánh</div>
            <Dropdown
              data={data?.results}
              onSelectItem={(item) => {
                setBranch(item);
              }}
              placeholder="Chọn chi nhánh"
              value={branch?.name}
              filedKey="name"
            />
            <div>
              {errors?.branchId ? (
                <text style={{ color: "red" }}>{errors.branchId?.message}</text>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit(onSubmit)}
            className="text-[pink] font-bold border-[1px] border-[pink] rounded-md px-7 py-3"
          >
            {isUpdate ? "Cập nhật" : "Thêm thiết bị"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </LoadingWrap>
  );
}

export default AddDevice;
