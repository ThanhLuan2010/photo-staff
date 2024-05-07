import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  FaChartLine,
  FaClock,
  FaSignOutAlt,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";
import { images } from "../../assets/index.tsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin, setToken, setUserInfo } from "../../store/slice/auth.slice.tsx";

const data = [
  {
    lable: "Request Coupon",
    id: 1,
    route: [
      {
        path: "/dashboard",
        lable: "Request Coupon",
        id: 1,
        icon: <FaTicketAlt />,
      },
    ],
  },
  {
    lable: "History",
    id: 2,
    route: [{ path: "/history", lable: "History", id: 2, icon: <FaClock /> }],
  },
];
interface Props {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}
export default function MobileNavBar({ isOpen, setIsOpen }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navAnimation = isOpen ? "translate-x-0" : "translate-x-[-100%]";
  return (
    <div
      className={`fixed ${navAnimation} h-full min-h-screen duration-300 top-0 left-0 right-0 bottom-0 z-[10000] bg-[pink] overflow-y-auto`}
    >
      <div className="py-4">
        <div className="flex items-center justify-center">
          <img
            src={images.logo}
            alt="Logo"
            className="w-[70px] h-[70px] object-contain"
          />
          <div className="ml-2 text-3xl font-bold text-white">PHOTO TIME</div>
        </div>
        <AiFillCloseCircle
          onClick={() => setIsOpen(false)}
          className="w-[30px] h-[30px] absolute right-2 top-2 cursor-pointer text-white"
        />
        <div className="mt-5">
          {data.map((item, index) => {
            return (
              <div className="px-5 py-0 rounded-xl" key={index + "navRoute"}>
                {item.route.length > 1 && (
                  <div className="mt-5 font-bold">{item.lable}</div>
                )}
                <div>
                  {item.route.map((route, subindex) => {
                    const Icon = route.icon;

                    return (
                      <div
                        onClick={() => {
                          setIsOpen(false);
                          navigate(route.path);
                        }}
                        className={`bg-[white] 
                        rounded-xl
                        px-2 
                        mt-1 
                        hover:bg-pink-500
                        cursor-pointer
                        flex
                        items-center
                        min-h-[40px]
                        `}
                        key={subindex}
                      >
                        <div>{route.icon}</div>
                        <div className="ml-2">{route.lable}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center my-5">
          <button
            onClick={() => {
              dispatch(setIsLogin(false));
              dispatch(setToken(""));
              dispatch(setUserInfo({}));
            }}
            className="flex items-center self-center text-xl text-white"
          >
            Đăng xuất
            <FaSignOutAlt className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
