import React, { useEffect } from "react";
import MobileNavBar from "../MobileNav/NavBar.tsx";
import NavBar from "../nav/NavBar.tsx";
import { AiOutlineMenu } from "react-icons/ai";
import { useSelector } from "react-redux";
import { authSelect } from "../../store/slice/auth.slice.tsx";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: any;
}
const MainLayout : React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { isLogin } = useSelector(authSelect);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  return (
    <div className="flex h-screen">
      <MobileNavBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`md:block hidden overflow-y-auto bg-[pink]`}>
        <NavBar />
      </div>
      <div className="w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
        <div
          onClick={() => setIsOpen(true)}
          className="fixed mx-5 my-5 text-xl cursor-pointer md:hidden text-primary"
        >
          <AiOutlineMenu />
        </div>
        <div className="w-full px-5 mt-10 mb-10">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;



<>
header
<>body</>
footer
</>