import React, { useRef, useState } from "react";
import { images } from "../../assets/index.tsx";
import { AiOutlineMail, AiOutlineKey } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { request } from "../../api/request.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingWrap from "../../component/LoadingWrap.tsx";
import { useDispatch } from "react-redux";
import {
  setIsLogin,
  setToken,
  setUserInfo,
} from "../../store/slice/auth.slice.tsx";
import { useNavigate } from "react-router-dom";

const validationSchemaRegister = Yup.object().shape({
  email: Yup.string()
    .required("Vui lòng điền email")
    .test("test-name", "Email không đúng định dạng", function (value) {
      const emailRegex =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      const isValidEmail = emailRegex.test(value);
      if (!isValidEmail) {
        return false;
      }
      return true;
    }),
  password: Yup.string()
    .required("Vùi lòng điền mật khẩu")
    .max(40, "Mật khẩu tối đa 40 ký tự")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export default function Login() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchemaRegister),
  });

  const onLogin = async (value: any) => {
    try {
      setLoading(true);
      const { email, password } = value;
      const body = {
        email,
        password,
      };

      const response = await request("auth/login-admin", body, "POST");
      // const response = await request("auth/login-staff", body, "POST");
      if (response?.status) {
        dispatch(setIsLogin(true));
        dispatch(setToken(response.data.token));
        dispatch(setUserInfo(response.data.user));
        navigate("/dashboard");
      }
      notify(response?.message || "Đã có lỗi xảy ra");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handelOnchange = (value: any, field: any) => {
    setValue(field, value.target.value);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (buttonRef.current) buttonRef.current.focus();
    }
  };

  const notify = (title: string) => toast(title);

  return (
    <LoadingWrap active={loading}>
      <div
        style={{
          backgroundImage: `url(${images.loginBanner})`,
        }}
        className="flex items-center justify-center w-screen h-screen"
      >
        <div className="px-10 py-10 text-center bg-white sm:px-25 w-fit rounded-2xl">
          <strong className="text-primary text-[40px]">LOGIN</strong>
          <div className="flex w-full px-5 py-2 mt-5 border border-gray-500 rounded-full">
            <AiOutlineMail size={25} />
            <input
              placeholder="Email"
              className="bg-[transparent] border-[1px] ml-2 border-[black] border-none flex-1 w-full outline-none"
              onChange={(e) => handelOnchange(e, "email")}
              onKeyDown={handleKeyPress}
            />
          </div>
          {errors.email && (
            <span className="mt-1 text-left text-red-500">
              {errors.email.message}
            </span>
          )}

          <div>
            <div className="flex w-full px-5 py-2 mt-3 border border-gray-500 rounded-full">
              <AiOutlineKey size={25} />
              <input
                placeholder="Password"
                className="bg-[transparent] border-[1px] ml-2 border-[black] border-none outline-none"
                onChange={(e) => handelOnchange(e, "password")}
                type="password"
                onKeyDown={handleKeyPress}
              />
            </div>
            {errors.password && (
              <span className="mt-1 text-left text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            ref={buttonRef}
            onClick={handleSubmit(onLogin)}
            className="px-10 py-3 mt-5 text-center text-white rounded-full bg-primary"
          >
            Login
          </button>
        </div>
      </div>
      <ToastContainer />
    </LoadingWrap>
  );
}
