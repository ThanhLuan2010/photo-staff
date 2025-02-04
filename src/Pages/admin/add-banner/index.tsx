import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, request } from "../../../api/request.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import React from "react";
import { useLocation } from "react-router-dom";

const AddBanner = (props: any) => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const location = useLocation();
  const { item } = location.state || {};
  useEffect(() => {
    if (item && item?.url) {
      setSelectedImage(item?.url);
      setisUpdate(true);
    }
  }, [item]);

  const handleImageChange = async (event: any) => {
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
        notify(resJson?.isSuccess || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (e) {
      notify("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
    setLoading(false);
  };

  const notify = (title: string) => toast(title);

  const onSubmit = async () => {
    setLoading(true);
    if (isUpdate) {
      onUpdate();
    } else {
      if (selectedImage) {
        const body = {
          name: "banner",
          nameEn: "banner",
          nameKo: "banner",
          description: "banner",
          descriptionEn: "banner",
          descriptionKo: "banner",
          url: selectedImage,
          type: 1,
        };
        const res = await request("home/create-home-banner", body, "POST");
        if (res?.status) {
          // navigation('/branch/list')
        }
        notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      } else {
        notify("Vui lòng chọn hình ảnh");
      }
    }

    setLoading(false);
  };

  const onUpdate = async () => {
    setLoading(true);
    if (selectedImage) {
      if (selectedImage)
        if (
          selectedImage?.includes("http://") ||
          selectedImage?.includes("https://")
        ) {
          const body = {
            name: "",
            nameEn: "",
            nameKo: "",
            description: "",
            descriptionEn: "",
            descriptionKo: "",
            url: selectedImage,
            type: 1,
            id: item?.id,
          };
          const res = await request("home/edit-home-banner", body, "POST");
          notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
        } else {
          alert("trống");
        }
    } else {
      notify("Vui lòng chọn hình ảnh");
    }
    setLoading(false);
  };

  const classInput =
    "w-full border-[1px] border-[pink] rounded-md px-2 py-2 outline-none";
  const classLable = "font-semibold text-[pink]";
  return (
    <div>
      <LoadingWrap active={loading}>
        <div className="w-full">
          <div className="text-2xl text-center text-[pink] font-bold">
            {isUpdate ? "CẬP NHẬT BANNER" : "THÊM BANNER"}
          </div>
          <div className="mb-3">
            {selectedImage && (
              <div>
                <h2>Ảnh đã chọn:</h2>
                <img
                  src={selectedImage?.replace("http://27.71.26.120","https://phototimevn.com")}
                  alt="Selected"
                  style={{ maxWidth: "15%" }}
                />
              </div>
            )}
            <div className={classLable}>Ảnh sự kiện</div>
            <input
              onChange={handleImageChange}
              type="file"
              className={classInput}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={onSubmit}
              color="primary"
              className="px-8 bg-[pink] text-white mb-20 py-2 rounded-md self-center"
            >
              {isUpdate ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </div>
        <ToastContainer />
      </LoadingWrap>
    </div>
  );
};

export default AddBanner;
