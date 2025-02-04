import React, { useCallback, useState } from "react";
import { GetList } from "../../../hook/getList.tsx";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaEdit, FaTrash } from "react-icons/fa";
import { request } from "../../../api/request.tsx";
import { ToastContainer, toast } from "react-toastify";
import LoadingWrap from "../../../component/LoadingWrap.tsx";

function Device() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data,reLoad }: any = GetList({
    url: "device/get-list-device",
  });

  const { data: dataBranch }: any = GetList({
    url: "branch/get-list-branch",
    params: { limit: 1000 },
  });

  const getBranch = useCallback(
    (id: string) => {
      if (dataBranch) {
        const brancFound = dataBranch?.results?.find((i: any) => i?.id === id);
        if (brancFound) {
          return brancFound?.name;
        }
      }
    },
    [dataBranch]
  );
  const navigate = useNavigate();

  const onDelete = async (item:any) => {
   try {
    setIsLoading(true);
    const response = await request("device/delete-device", {
      id: item?.id,
    },"POST");
    setIsLoading(false);
    notify(response?.message);
    reLoad()
   } catch (error) {
    setIsLoading(false);
    notify("Đã có lỗi sảy ra, vui lòng thử lại sau");
   }
  };

  const notify = (title: string) => toast(title);

  const renderDevice = (item: any, index: number) => {
    return (
      <tr
        key={index}
        className=" w-full justify-between content-between border-b-[1px] border-l-[1px] border-r-[1px] text-[gray] text-center"
      >
        <td className="">{item?.name}</td>
        <td className="">{getBranch(item?.branchId)}</td>
        <td className="">
          {item?.isUpdated ? "Đã cập nhập" : "Chưa cập nhật"}
        </td>
        <td className="">
          {item?.lastUpdatedAt
            ? moment(item?.lastUpdatedAt).format("DD/MM/YYYY HH:mm")
            : "-"}
        </td>
        <td className="gap-[10px]">
          <button
            onClick={() => navigate("/admin/add-device", { state: { item } })}
          >
            <FaEdit color="gray" size={20} />
          </button>

          <button onClick={() => onDelete(item)} className="ml-3">
            <FaTrash color="red" size={20} />
          </button>
        </td>
      </tr>
    );
  };
  return (
    <LoadingWrap active={isLoading}>
      <div className="">
        <div className="flex w-[100%] items-center">
          <text className="font-bold size-[24px] flex-1 text-[pink]">
            THIẾT BỊ
          </text>
          <button
            onClick={() => navigate("/admin/add-device")}
            className="items-end w-auto border-[1px] border-[pink] rounded-xl px-5 py-3 text-[pink] font-semibold"
          >
            Thêm thiết bị
          </button>
        </div>
        <table className="w-full mt-10">
          <tbody>
            <tr className=" w-full justify-between content-between border-[1px]">
              <th className="">Tên thiết bị</th>
              <th className="">Chi nhánh</th>
              <th className="">Trạng thái</th>
              <th className="">Cập nhật gần nhất</th>
              <th className="">Hành động</th>
            </tr>
            {data?.results?.map(renderDevice)}
          </tbody>
        </table>
      </div>
    </LoadingWrap>
  );
}

export default Device;
