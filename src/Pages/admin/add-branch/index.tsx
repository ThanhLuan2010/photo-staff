import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { BASE_URL, request } from "../../../api/request.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import React from "react";
import { useLocation } from "react-router-dom";

const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().required("Vui lòng điền tên chi nhánh"),
  nameEn: Yup.string().required("Vui lòng điền tên chi nhánh tiếng anh"),
  nameKo: Yup.string().required("Vui lòng điền tên chi nhánh tiếng hàn"),
  address: Yup.string().required("Vui lòng điền địa chỉ"),
  addressEn: Yup.string().required("Vui lòng điền địa chỉ"),
  addressKo: Yup.string().required("Vui lòng điền địa chỉ"),
  linkgoogleMap: Yup.string().required("Vui lòng điền link bản đồ"),
  description: Yup.string(),
  descriptionEn: Yup.string(),
  descriptionKo: Yup.string(),
})

interface InputForm {
  name: string;
  nameEn: string;
  nameKo: string;
  address: string;
  addressEn: string;
  addressKo: string;
  linkgoogleMap: string;
  description?: string;
  descriptionEn?: string;
  descriptionKo?: string;
  url?: string;
  id?: any;
}

const FormControl = (props: any) => {
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

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<InputForm>({
    defaultValues: {
      name: item?.name || "",
      nameEn: item?.nameEn || "",
      nameKo: item?.nameKo || "",
      address: item?.address || "",
      addressEn: item?.addressEn || "",
      addressKo: item?.addressKo || "",
      linkgoogleMap: item?.linkgoogleMap || "",
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
    formData.append("image", event.target.files[0]);

    try {
      const res = await fetch(`${BASE_URL}upload/upload`, {
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
          address: data.address,
          addressEn: data.addressEn,
          addressKo: data.addressKo,
          linkgoogleMap: data.linkgoogleMap,
          description: data.description,
          descriptionEn: data.descriptionEn,
          descriptionKo: data.descriptionKo,
          url: selectedImage,
        };
        const res = await request("home/create-branch", body, "POST");
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
            address: _data.address,
            addressEn: _data.addressEn,
            addressKo: _data.addressko,
            linkgoogleMap: _data.linkgoogleMap,
            description: _data.description,
            descriptionEn: _data.descriptionEn,
            descriptionKo: _data.descriptionKo,
            url: selectedImage,
            id: item.id,
          };
          const res = await request("home/edit-branch", body, "POST");
          notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
        } else {
          const resImg = await request(
            "upload/uploadBase64",
            { file: selectedImage?.replace("data:image/png;base64,", "") },
            "POST"
          );
          if (resImg?.success) {
            const body = {
              name: _data.name,
              address: _data.address,
              linkgoogleMap: _data.linkgoogleMap,
              description: _data.description,
              url: resImg.data?.url,
              id: _data.id,
            };
            const res = await request("home/edit-branch", body, "POST");
            if (res?.status) {
              // navigation('/branch/list')
            }
            notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
          } else {
            notify(resImg?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
          }
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
          {isUpdate ? "CẬP NHẬT CHI NHÁNH" : "THÊM CHI NHÁNH"}
        </div>
        <div className="mb-3">
          <div className={classLable}>Tên chí nhánh</div>
          <input
            onChange={(value) => handelOnchange(value, "name")}
            placeholder="Nhập tên chi nhánh"
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
          <div className={classLable}>Tên chí nhánh Tiếng Anh</div>
          <input
            onChange={(value) => handelOnchange(value, "nameEn")}
            placeholder="Nhập tên chi nhánh tiếng anh"
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
          <div className={classLable}>Tên chí nhánh Tiếng Hàn</div>
          <input
            onChange={(value) => handelOnchange(value, "nameKo")}
            placeholder="Nhập tên chi nhánh tiếng hàn"
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
          <div className={classLable}>Đia chỉ</div>
          <input
            onChange={(value) => handelOnchange(value, "address")}
            placeholder="Nhập địa chỉ"
            className={classInput}
            defaultValue={getValues("address")}
          />
          <div>
            {errors?.address ? (
              <text style={{ color: "red" }}>{errors.address?.message}</text>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <div className={classLable}>Đia chỉ tiếng anh</div>
          <input
            onChange={(value) => handelOnchange(value, "addressEn")}
            placeholder="Nhập địa chỉ tiếng anh"
            className={classInput}
            defaultValue={getValues("addressEn")}
          />
          <div>
            {errors?.addressEn ? (
              <text style={{ color: "red" }}>{errors.addressEn?.message}</text>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <div className={classLable}>Đia chỉ tiếng Hàn</div>
          <input
            onChange={(value) => handelOnchange(value, "addressKo")}
            placeholder="Nhập địa chỉ tiếng Hàn"
            className={classInput}
            defaultValue={getValues("addressKo")}
          />
          <div>
            {errors?.addressKo ? (
              <text style={{ color: "red" }}>{errors.addressKo?.message}</text>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <div className={classLable}>Link GoogleMap</div>
          <input
            onChange={(value) => handelOnchange(value, "linkgoogleMap")}
            placeholder="Dánh link bản đồ"
            className={classInput}
            defaultValue={getValues("linkgoogleMap")}
          />
          <div>
            {errors?.linkgoogleMap ? (
              <text style={{ color: "red" }}>
                {errors.linkgoogleMap?.message}
              </text>
            ) : null}
          </div>
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
          <div className={classLable}>Ảnh cửa hàng</div>
          <input
            onChange={handleImageChange}
            type="file"
            className={classInput}
          />
        </div>

        <div className="mb-3">
          <div className={classLable}>Mô tả</div>
          <ReactQuill
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

export default FormControl;
