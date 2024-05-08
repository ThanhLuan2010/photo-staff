import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Suspense, React } from "react";
import Login from "./Pages/Login/index.tsx";
import DashBoard from "./Pages/Dashboard/index.tsx";
import MainLayout from "./component/MainLayout/index.tsx";
import History from "./Pages/History/index.tsx";
import RequestCoupon from "./Pages/RequestCouon/index.tsx";
function App() {
  const loading = false;
  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
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
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
