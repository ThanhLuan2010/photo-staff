import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetList } from "../../../hook/getList.tsx";
import { BASE_URL, request } from "../../../api/request.tsx";
import LoadingWrap from "../../../component/LoadingWrap.tsx";
import { Dropdown } from "../../../component/Dropdow/index.tsx";
import { useLocation } from "react-router-dom";
import moment from "moment";

const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().required("Vui lòng điền tên khung ảnh"),
  nameEn: Yup.string().required("Vui lòng điền tên khung ảnh"),
  nameKo: Yup.string().required("Vui lòng điền tên khung ảnh"),
  type: Yup.number().required("Vui lòng chọn chọn loại hình"),
  typeFrame: Yup.string().required("Vui lòng chọn chọn loại khung"),
  price: Yup.number().required("Vui lòng nhập giá tiền"),
  countCut: Yup.number().required("Vui lòng nhập số ảnh"),
  programe_category: Yup.string(),
  thumnail: Yup.string(),
});

const dataType = [
  { value: "P", lable: "P" },
  { value: "F", lable: "F" },
  { value: "FC", lable: "4C" },
  { value: "TSH", lable: "2SH" },
  { value: "TH", lable: "2H" },
  { value: "B", lable: "B" },
  { value: "Family", lable: "Family" },
];
interface IFormInput {
  name: string;
  nameEn: string;
  nameKo: string;
  type: number;
  typeFrame: string;
  price: number;
  countCut: number;
  note?: string;
  programe_category: string;
  thumnail: string;
}

type CategoryType = {
  categoryName: string;
  categoryNameEn: string;
  categoryNameKo: string;
  categoryType: number;
  id: string;
  subCategory: any;
};

interface IStep {
  url: string;
  index: number;
}

const CreateFrame = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedThumnail, setSelectedThumnail] = useState<any>(null);
  const [isUpdate, setisUpdate] = useState<boolean>(false);
  const [seletedCategory, setseletedCategory] = useState<string>("Chọn loại");
  const [seletedTypeFrame, setseletedTypeFrame] = useState<string>("Chọn loại");
  const { data } = GetList<any>({ url: "frame/get-list-category" });
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());
  const [step, setstep] = useState<Array<IStep>>([]);

  const location = useLocation();
  const { item } = location.state || {};
  const handleImageChange = async (event) => {
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
      console.log("=======e=======", e);
    }
    setLoading(false);
  };

  const handleThumnailChange = async (event) => {
    setLoading(true);
    setSelectedThumnail(URL.createObjectURL(event.target.files[0]));
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
        setSelectedThumnail(resJson?.data?.url);
      } else {
        notify(resJson?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (e) {
      notify("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
    setLoading(false);
  };

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
      type: item?.categoryType || 0,
      typeFrame: item?.typeFrame || "",
      price: item?.price || 0,
      countCut: item?.countCut || 0,
      programe_category: item?.programe_category || "",
      thumnail: item?.thumnail || "",
      note:item?.note || ""
    },
    resolver: yupResolver<any>(validationSchemaRegister),
  });

  const notify = (title: string) => toast(title);

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  useEffect(() => {
    setLoading(false);
    setValue("type", 1);
  }, []);

  useEffect(() => {
    if (item && item?.url) {
      setSelectedImage(item?.url);
      setSelectedThumnail(item?.thumnail);
      setisUpdate(true);
      setstep(item?.step)
      if (item.timeEnd) {
        setEndDate(moment(item.timeEnd));
      }
      if (item.timeStart) {
        setStartDate(moment(item.timeStart));
      }
      setseletedTypeFrame(item?.typeFrame);
      const currentCategory = data?.find((cate: CategoryType) => {
        return cate?.categoryType === item.categoryType;
      });
      if (currentCategory) {
        setseletedCategory(currentCategory?.categoryName);
      }
    }
  }, [item, data]);

  const onSubmit = async (data: IFormInput) => {
    setLoading(true);
    if (isUpdate) {
      onUpdate(data);
    } else if (selectedImage) {
      const body = {
        name: data.name,
        nameKo: data.nameKo,
        nameEn: data.nameEn,
        url: selectedImage,
        timeStart: startDate,
        timeEnd: endDate,
        listFrame: [],
        categoryType: data.type,
        typeFrame: data.typeFrame,
        price: data.price,
        countCut: data.countCut,
        note: data?.note || "",
      };
      if (isUpdate) {
        const res = await request("frame/edit-frame", body, "POST");
        notify(res?.message || "Đã có lỗi xảy ra");
      } else {
        const res = await request("frame/create-frame", body, "POST");
        notify(res?.message || "Đã có lỗi xảy ra");
      }
    } else {
      notify("Vui lòng chọn hình ảnh");
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
            name: data.name,
            nameKo: data.nameKo,
            nameEn: data.nameEn,
            url: selectedImage,
            timeStart: startDate,
            timeEnd: endDate,
            listFrame: [],
            categoryType: data.type,
            typeFrame: data.typeFrame,
            price: data.price,
            countCut: data.countCut,
            id: item.id,
            note: _data?.note || "",
            programe_category: _data?.programe_category || "",
            thumnail: selectedThumnail,
            step: step,
          };
          const res = await request("frame/edit-frame", body, "POST");
          notify(res?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
    } else {
      notify("Vui lòng chọn hình ảnh");
    }
    setLoading(false);
  };

  const setValueStep = (value: any, index: number, field: string) => {
    let dataStep = step;
    for (let i = 0; i < dataStep.length; i++) {
      if (i === index) {
        dataStep[i][field] = value;
      }
    }
    setstep([...dataStep]);
  };

  const handleChangeStepImgae = async (event, index, field) => {
    setLoading(true);
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
        // setSelectedThumnail(resJson?.data?.url);
        let dataStep = step;
        for (let i = 0; i < dataStep.length; i++) {
          if (i === index) {
            dataStep[i][field] = resJson?.data?.url;
          }
        }
        setstep([...dataStep]);
      } else {
        notify(resJson?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (e) {
      notify("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
    setLoading(false);
  };

  const classInput =
    "w-full border-[1px] border-[pink] rounded-md px-2 py-2 outline-none";
  const classLable = "font-semibold text-[pink]";
  return (
    <LoadingWrap active={loading}>
      <div  className="text-center font-bold text-[pink] text-xl">
        {isUpdate ? "Sửa Frame" : "Thêm Frame"}
      </div>
      <div className="mb-3">
        <div className={classLable}>Tên Khung ảnh</div>
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
        <div className={classLable}>Tên Khung ảnh Tiếng Anh</div>
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
        <div className={classLable}>Tên Khung ảnh Tiếng Hàn</div>
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

      <div className="mb-3">
        {selectedImage && (
          <div>
            <img
              src={selectedImage?.replace(
                "http://27.71.26.120",
                "https://phototimevn.com"
              )}
              alt="Selected"
              style={{ maxWidth: "15%" }}
            />
          </div>
        )}
        <div className={classLable}>Hình ảnh</div>
        <input
          onChange={handleImageChange}
          type="file"
          className={classInput}
        />
      </div>
      <div className="mb-3">
        <div className={classLable}>Ngày bắt đầu</div>
        <br />
        <DateTimePicker onChange={setStartDate} value={startDate} />
      </div>

      <div className="mb-3">
        <div className={classLable}>Ngày kết thúc</div>
        <br />
        <DateTimePicker onChange={setEndDate} value={endDate} />
      </div>

      <div className="mb-3">
        <div className={classLable}>Giá tiền</div>
        <input
          onChange={(value) => handelOnchange(value, "price")}
          // value={getValues('price')}
          type="text"
          defaultValue={getValues("price")}
          className={classInput}
        />
      </div>

      <div className="mb-3">
        <div className={classLable}>Số ảnh in ra</div>
        <input
          onChange={(value) => handelOnchange(value, "countCut")}
          // value={getValues('countCut')}
          type="text"
          className={classInput}
          defaultValue={getValues("countCut")}
        />
      </div>

      <div className="mb-3">
        <div className={classLable}>Ghi chú</div>
        <input
          onChange={(value) => handelOnchange(value, "note")}
          // value={getValues('countCut')}
          type="text"
          className={classInput}
          defaultValue={getValues("note")}
        />
      </div>

      <div className="flex flex-col gap-5 mt-5 md:flex-row">
        <div className="w-full">
          <div className={classLable}>Chọn loại danh mục</div>
          <Dropdown
            placeholder="Chọn danh mục Frame"
            data={data}
            filedKey="categoryName"
            onSelectItem={(item) => {
              setseletedCategory(item?.categoryName);
              setValue("type", item?.categoryType);
            }}
            value={seletedCategory}
          />

          <div>
            {errors?.type ? (
              <text style={{ color: "red" }}>{errors.type?.message}</text>
            ) : null}
          </div>
        </div>

        <div className="w-full">
          <div className={classLable}>Chọn loại Frame</div>
          <Dropdown
            placeholder="Chọn loại Frame"
            data={dataType}
            filedKey="lable"
            onSelectItem={(item) => {
              setseletedTypeFrame(item?.lable);
              setValue("typeFrame", item?.value);
            }}
            value={seletedTypeFrame}
          />
          <div>
            {errors?.typeFrame ? (
              <text style={{ color: "red" }}>{errors.typeFrame?.message}</text>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-10 mb-3">
        {selectedThumnail && (
          <div>
            <img
              src={selectedThumnail?.replace(
                "http://27.71.26.120",
                "https://phototimevn.com"
              )}
              alt="Selected"
              style={{ maxWidth: "15%" }}
            />
          </div>
        )}
        <div className={classLable}>Thumnail</div>
        <input
          onChange={handleThumnailChange}
          type="file"
          className={classInput}
        />
      </div>

      <div className="mb-3">
        <div className={classLable}>Category</div>
        <input
          onChange={(value) => handelOnchange(value, "programe_category")}
          type="text"
          className={classInput}
          defaultValue={getValues("programe_category")}
        />
      </div>

      <div className="mb-3">
        <div className={classLable}>Step</div>
        <div className="border-[1px] p-5">
          {step?.length > 0 &&
            step?.map((item: IStep, index: number) => (
              <div key={index} className="flex items-end gap-4 mb-3">
                <div className="w-1/2">
                  <p>URL</p>
                  {
                    item?.url && <img src={item?.url} className="w-[200px] h=[300px]"/>
                  }
                  <input
                    onChange={(value) =>
                      handleChangeStepImgae(value, index, "url")
                    }
                    // value={item?.url}
                    type="file"
                    className={classInput}
                  />
                </div>

                <div className="w-1/2">
                  <p>Index</p>
                  <input
                    onChange={(value) =>
                      setValueStep(value.target.value, index, "index")
                    }
                    value={item?.index}
                    type="text"
                    className={classInput}
                  />
                </div>

                <div className=" text-primary hover:bg-red-500">
                  <button
                    onClick={() => setstep(step.filter((s) => s !== item))}
                    className={classInput}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
        </div>

        <button
          className="mb-4 text-primary border-[1px] rounded-md py-3 px-6 w-full mt-5"
          onClick={() => setstep(step?.concat({ url: "", index: 0 }))}
        >
          {"Thêm step"}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          className="mb-4 bg-[pink] text-white py-3 px-6 rounded-md"
          onClick={handleSubmit(onSubmit)}
        >
          {isUpdate ? "Sửa Frame" : "Thêm Frame"}
        </button>
      </div>
      <ToastContainer />
    </LoadingWrap>
  );
};

export default CreateFrame;
