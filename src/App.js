import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Suspense, React } from "react";
import Login from "./Pages/Login/index.tsx";
import DashBoard from "./Pages/admin/Dashboard/index.tsx";
import MainLayout from "./component/MainLayout/index.tsx";
import History from "./Pages/History/index.tsx";
import RequestCoupon from "./Pages/RequestCouon/index.tsx";
import ListUserRegisted from "./Pages/admin/ListUserRegister/index.tsx";
import Customer from "./Pages/admin/customer/index.tsx";
import EditUser from "./Pages/admin/editUser/index.tsx";
import ListBranch from "./Pages/admin/list-branch/index.tsx";
import AddBranch from "./Pages/admin/add-branch/index.tsx";
import Frame from "./Pages/admin/list-frame/index.tsx";
import AddFrame from "./Pages/admin/add-frame/index.tsx";
import ListCategory from "./Pages/admin/list-category-frame/index.tsx";
import AddCategory from "./Pages/admin/add-category-frame/index.tsx";
import ListEvent from "./Pages/admin/list-event/index.tsx";
import AddEvent from "./Pages/admin/add-event/index.tsx";
import ListBanner from "./Pages/admin/list-banner/index.tsx";
import AddBanner from "./Pages/admin/add-banner/index.tsx";
import { useSelector } from "react-redux";
import { authSelect } from "./store/slice/auth.slice.tsx";
function App() {
  const loading = false;
  const { userInfo } = useSelector(authSelect);
  // const dataNav = userInfo?.role === "ADMIN" ? dataRouteAdmin : dataRouteStaff;
  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          {userInfo?.role === "STAFF" ? (
            <>
              <Route
                exact
                path="/requestCoupon"
                name="Request Coupon"
                element={
                  <MainLayout>
                    <RequestCoupon />
                  </MainLayout>
                }
              />
              <Route
                exact
                path="/history"
                name="History"
                element={
                  <MainLayout>
                    <History />
                  </MainLayout>
                }
              />
            </>
          ) : userInfo?.role === "ADMIN" ? (
            <>
              <Route exact path="/" name="Login Page" element={<Login />} />
              <Route
                exact
                path="/dashboard"
                name="Dashboard"
                element={
                  <MainLayout>
                    <DashBoard />
                  </MainLayout>
                }
              />
              <Route
                exact
                path="/admin/ListUserRegisted"
                name="List User Register"
                element={
                  <MainLayout>
                    <ListUserRegisted />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/customer"
                name="Customer"
                element={
                  <MainLayout>
                    <Customer />
                  </MainLayout>
                }
              />
              <Route
                exact
                path="/admin/editUser"
                name="Customer"
                element={
                  <MainLayout>
                    <EditUser />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/branch"
                name="List Branch"
                element={
                  <MainLayout>
                    <ListBranch />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/add-branch"
                name="add branch"
                element={
                  <MainLayout>
                    <AddBranch />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/frame"
                name="List Frame"
                element={
                  <MainLayout>
                    <Frame />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/add-frame"
                name="add branch"
                element={
                  <MainLayout>
                    <AddFrame />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/frame-category"
                name="List Category"
                element={
                  <MainLayout>
                    <ListCategory />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/add-category"
                name="add branch"
                element={
                  <MainLayout>
                    <AddCategory />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/list-event"
                name="List Event"
                element={
                  <MainLayout>
                    <ListEvent />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/add-event"
                name="add Event"
                element={
                  <MainLayout>
                    <AddEvent />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/list-banner"
                name="List banner"
                element={
                  <MainLayout>
                    <ListBanner />
                  </MainLayout>
                }
              />

              <Route
                exact
                path="/admin/add-banner"
                name="add banner"
                element={
                  <MainLayout>
                    <AddBanner />
                  </MainLayout>
                }
              />
            </>
          ) : null}
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
