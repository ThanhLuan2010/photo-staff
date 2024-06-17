import React from "react";
import { AiFillCloseCircle, AiFillEnvironment } from "react-icons/ai";
import {
  FaChartLine,
  FaClock,
  FaCodeBranch,
  FaHistory,
  FaRegImages,
  FaSignOutAlt,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";
import { images } from "../../assets/index.tsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelect,
  setIsLogin,
  setToken,
  setUserInfo,
} from "../../store/slice/auth.slice.tsx";

const dataRouteStaff = [
  {
    lable: "Request Coupon",
    id: 1,
    route: [
      {
        path: "/requestCoupon",
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

const dataRouteAdmin = [
  {
    lable: "Thống Kê",
    id: 1,
    route: [
      { path: "/dashboard", lable: "Thống kê", id: 1, icon: <FaChartLine /> },
    ],
  },
  {
    lable: "Người dùng",
    id: 2,
    route: [
      { path: "/admin/customer", lable: "Người dùng", id: 2, icon: <FaUser /> },
    ],
  },
  {
    lable: "Lịch sử",
    id: 7,
    route: [
      {
        path: "/admin/history-staff-request-coupon",
        lable: "Lịch sử tạo coupon",
        id: 13,
        icon: <FaHistory />,
      },
    ],
  },
  {
    lable: "Chi nhánh",
    id: 3,
    route: [
      {
        path: "/admin/branch",
        lable: "Danh sách chi nhánh",
        id: 3,
        icon: <FaCodeBranch />,
      },
      {
        path: "/admin/add-branch",
        lable: "Thêm chi nhánh",
        id: 4,
        icon: <FaCodeBranch />,
      },
    ],
  },

  {
    lable: "Frame",
    id: 4,
    route: [
      {
        path: "/admin/frame",
        lable: "Danh sách Frame",
        id: 5,
        icon: <FaRegImages />,
      },
      {
        path: "/admin/add-frame",
        lable: "Thêm Frame",
        id: 6,
        icon: <FaRegImages />,
      },
      {
        path: "/admin/frame-category",
        lable: "Danh mục Frame",
        id: 7,
        icon: <FaRegImages />,
      },
      {
        path: "/admin/add-category",
        lable: "Thêm danh mục",
        id: 8,
        icon: <FaRegImages />,
      },
      {
        path: "/admin/frames",
        lable: "Thống kê lượng chụp",
        id: 8,
        icon: <FaRegImages />,
      },
    ],
  },

  {
    lable: "Sự kiện",
    id: 5,
    route: [
      {
        path: "/admin/list-event",
        lable: "Danh sách sự kiện",
        id: 9,
        icon: <AiFillEnvironment />,
      },
      {
        path: "/admin/add-event",
        lable: "Thêm sự kiện",
        id: 10,
        icon: <AiFillEnvironment />,
      },
    ],
  },

  {
    lable: "Banners",
    id: 6,
    route: [
      {
        path: "/admin/list-banner",
        lable: "Danh sách banner",
        id: 11,
        icon: <FaRegImages />,
      },
      {
        path: "/admin/add-banner",
        lable: "Thêm banner",
        id: 12,
        icon: <FaRegImages />,
      },
    ],
  },
];

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}
export default function MobileNavBar({ isOpen, setIsOpen }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(authSelect);
  const dataNav = userInfo?.role === "ADMIN" ? dataRouteAdmin : dataRouteStaff;
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
          {dataNav.map((item, index) => {
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
              navigate("/");
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
