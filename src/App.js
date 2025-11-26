import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Addclient from "./pages/addclient/addclient";
import Header from "./components/Header/header";
import { createContext, useEffect, useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import InvoicePage from "./pages/additem/additem";
import Login from "./pages/login/login";
import Singup from "./pages/signup/singup";


const mycontext = createContext();

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
 const [islogin, setislogin] = useState(() => {
  return localStorage.getItem("islogin") === "true";
});

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    windowWidth,
    isOpenNav,
    setIsOpenNav,
    setislogin,
    islogin
  };

  return (
    <>
      <mycontext.Provider value={values}>
        <BrowserRouter>
          <div className="App">
            {
              isHideSidebarAndHeader !== true &&
              <Header />
            }
            <div className="app-container">
              {
                isHideSidebarAndHeader !== true && (
                  <>
                    <div className={`side-bar-overlay d-none ${isOpenNav === true ? 'show' : ''}`}
                      onClick={() => setIsOpenNav(false)}>
                    </div>
                    <div className={`sidebar-wrapper ${isToggleSidebar === true ? 'toggle' : ''} 
                    ${isOpenNav === true ? 'open' : ''}`}>
                      <Sidebar />
                    </div>
                  </>
                )}
              <div className={`main-content ${isHideSidebarAndHeader === true && 'full '} ${isToggleSidebar === true ? 'toggle' : ''}`}>
                <Routes>
                  <Route
                    path="/login"
                    element={islogin ? <Navigate to="/" /> : <Login />}
                  />
                  <Route
                    path="/singup"
                    element={islogin ? <Navigate to="/" /> : <Singup />}
                  />
                  <Route
                    path="/"
                    element={islogin ? <Addclient /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/client"
                    element={islogin ? <InvoicePage /> : <Navigate to="/login" />}
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </mycontext.Provider>
    </>
  );
}

export default App;
export { mycontext };
