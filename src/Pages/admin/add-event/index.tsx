import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import * as Yup from "yup";
import { request } from "../../../api/request.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import React from "react";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";

interface IFormInput {
  name: string;
  nameEn: string;
  nameKo: string;
  description: string;
  descriptionEn: string;
  descriptionKo: string;
  timeStart?: Date;
  timeEnd?: Date;
}

const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().required("Vui lòng điền tên sự kiện"),
  nameEn: Yup.string().required("Vui lòng điền tên sự kiện tiếng anh"),
  nameKo: Yup.string().required("Vui lòng điền tên sự kiện tiếng hàn"),
  description: Yup.string().required("Vui lòng điền mô tả cửa hàng"),
  descriptionEn: Yup.string().required("Vui lòng điền mô tả cửa hàng"),
  descriptionKo: Yup.string().required("Vui lòng điền mô tả cửa hàng"),
});

const AddEvent = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const [timeStart, setTimeStart] = useState<any>(new Date());
  const [timeEnd, setTimeEnd] = useState<any>(new Date());
  const location = useLocation();
  const { item } = location.state || {};
  useEffect(() => {
    if (item && item?.url) {
      setSelectedImage(item?.url);
      setisUpdate(true);
      setTimeEnd(item?.timeEnd);
      setTimeStart(item?.timeStart);
    }
  }, [item]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<IFormInput>({
    defaultValues: {
      name: item?.name || "",
      nameEn: item?.nameEn || "",
      nameKo: item?.nameKo || "",
      description: item?.description?.replace(/&lt;/g, "<") || "",
      descriptionEn: item?.descriptionEn?.replace(/&lt;/g, "<") || "",
      descriptionKo: item?.descriptionKo?.replace(/&lt;/g, "<") || "",
    },
    resolver: yupResolver(validationSchemaRegister),
  });

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };
  const handleImageChange = async (event: any) => {
    setLoading(true);
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const res = await fetch("http://27.71.26.120:8081/Image", {
        method: "POST",
        body: formData,
        // dataType: 'jsonp',
      });
      const resJson = await res.json();
      if (resJson?.success) {
        setSelectedImage(resJson?.data?.url);
      } else {
        notify(resJson?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (e) {
      notify("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
    setLoading(false);
  };

  const MyEditormodules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const MyEditorformats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  const notify = (title: string) => toast(title);

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (isUpdate) {
      onUpdate(data);
    } else {
      if (selectedImage) {
        const body = {
          name: data.name,
          nameEn: data.nameEn,
          nameKo: data.nameKo,
          description: data.description,
          descriptionEn: data.descriptionEn,
          descriptionKo: data.descriptionKo,
          url: selectedImage,
          timeStart: timeStart,
          timeEnd: timeEnd,
        };
        const res = await request("home/create-event", body, "POST");
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

  const onUpdate = async (_data: any) => {
    setLoading(true);
    if (selectedImage) {
      if (selectedImage)
        if (
          selectedImage?.includes("http://") ||
          selectedImage?.includes("https://")
        ) {
          const body = {
            name: _data.name,
            nameEn: _data.nameEn,
            nameKo: _data.nameKo,
            description: _data.description,
            descriptionEn: _data.descriptionEn,
            descriptionKo: _data.descriptionKo,
            url: selectedImage,
            id: item.id,
            timeStart: timeStart,
            timeEnd: timeEnd,
          };
          const res = await request("home/edit-branch", body, "POST");
          notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
        } else {
          alert("trống");
          // const resImg = await request(
          //   "upload/uploadBase64",
          //   { file: selectedImage?.replace("data:image/png;base64,", "") },
          //   "POST"
          // );
          // if (resImg?.success) {
          //   const body = {
          //     name: _data.name,
          //     nameEn: _data.nameEn,
          //     nameKo: _data.nameKo,
          //     description: _data.description,
          //     descriptionEn: _data.descriptionEn,
          //     descriptionKo: _data.descriptionKo,
          //     url: resImg.data?.url,
          //     id: data.id,
          //     timeStart: timeStart,
          //     timeEnd: timeEnd,
          //   };
          //   const res = await request("home/edit-branch", body, "POST");
          //   if (res?.status) {
          //     // navigation('/branch/list')
          //   }
          //   notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
          // } else {
          //   notify(resImg?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
          // }
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
    <LoadingWrap active={loading}>
      <div className="w-full">
        <div className="text-2xl text-center text-[pink] font-bold">
          {isUpdate ? "CẬP NHẬT SỰ KIỆN" : "THÊM SỤ KIỆN"}
        </div>
        <div className="mb-3">
          <div className={classLable}>Tên sự kiện</div>
          <input
            onChange={(value) => handelOnchange(value, "name")}
            placeholder="Nhập tên sự kiện"
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
          <div className={classLable}>Tên sự kiện Tiếng Anh</div>
          <input
            onChange={(value) => handelOnchange(value, "nameEn")}
            placeholder="Nhập tên sự kiện tiếng anh"
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
          <div className={classLable}>Tên sự kiện Tiếng Hàn</div>
          <input
            onChange={(value) => handelOnchange(value, "nameKo")}
            placeholder="Nhập tên sự kiện tiếng hàn"
            className={classInput}
            defaultValue={getValues("nameKo")}
          />
          <div>
            {errors?.nameKo ? (
              <text style={{ color: "red" }}>{errors.nameKo?.message}</text>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          {selectedImage && (
            <div>
              <h2>Ảnh đã chọn:</h2>
              <img
                src={selectedImage}
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

        <div className="flex">
          <div className="mb-3">
            <p className={classLable}>Ngày bắt đầu</p>
            <DateTimePicker onChange={setTimeStart} value={timeStart} />
          </div>

          <div className="mb-3 ml-5">
            <p className={classLable}>Ngày kết thúc</p>
            <DateTimePicker onChange={setTimeEnd} value={timeEnd} />
          </div>
        </div>

        <div className="mb-3">
          <div className={classLable}>Mô tả</div>
          <ReactQuill
            theme="snow"
            modules={MyEditormodules}
            formats={MyEditorformats}
            defaultValue={getValues("description")}
            onChange={(txt) => {
              setValue("description", txt);
            }}
          />
          <div>
            {errors?.description ? (
              <text style={{ color: "red" }}>
                {errors.description?.message}
              </text>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <div className={classLable}>Mô tả tiếng anh</div>
          <ReactQuill
            modules={MyEditormodules}
            defaultValue={getValues("descriptionEn")}
            formats={MyEditorformats}
            theme="snow"
            onChange={(txt) => {
              setValue("descriptionEn", txt);
            }}
          />
          <div>
            {errors?.descriptionEn ? (
              <text style={{ color: "red" }}>
                {errors.descriptionEn?.message}
              </text>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <div className={classLable}>Mô tả tiếng Hàn</div>
          <ReactQuill
            theme="snow"
            modules={MyEditormodules}
            formats={MyEditorformats}
            defaultValue={getValues("descriptionKo")}
            onChange={(txt) => {
              setValue("descriptionKo", txt);
            }}
          />
          <div>
            {errors?.descriptionKo ? (
              <text style={{ color: "red" }}>
                {errors.descriptionKo?.message}
              </text>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            className="px-8 bg-[pink] text-white mb-20 py-2 rounded-md self-center"
          >
            {isUpdate ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </LoadingWrap>
  );
};

export default AddEvent;
