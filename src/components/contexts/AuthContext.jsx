import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { showSuccessToast, showErrorToast } from "../../lib/Toast";
import ActionProvider from "./ActionContext";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  // console.log(children)
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  async function handleLogin(values) {
    try {
      const { data } = await axios.post("/users/employee/signin", values);
      if (data.success) {
        showSuccessToast("Signed-in user:", data?.data?.employeeName); //TODO not working
        setIsAuth(true);
        setUser(data.data);
      
        return true;
      }
    } catch (error) {
      const msg = error.response.data.error;
      showErrorToast(msg);
      return false;
    }
  }
  async function guestLogin() {
    try {
      const values = {employeeEmail: "bineomi@gmail.com", employeePassword: "g1234"}
      const { data } = await axios.post("/users/employee/signin", values);
      if (data.success) {
        showSuccessToast("Signed-in guest user:", data?.data?.employeeName); //TODO not working
        setIsAuth(true);
        setUser(data.data);
      
        return true;
      }
    } catch (error) {
      const msg = error.response.data.error;
      showErrorToast(msg);
      return false;
    }
  }


  async function authUser() {
    try {
      const { data } = await axios.get("/users/auth");
      if (data.success) {
        setIsAuth(true);
        setUser(data.user);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Auth error:", error);
      }
    }
  }

  useEffect(() => {
    authUser();
  }, []);

  async function signOut() {
    try {
      const { data } = await axios.get("/users/manager/logout");
      setIsAuth(false);
    
      showSuccessToast(data.message);
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.error);
    }
  }

  const value = {
    handleLogin,
    setUser,
    user,
    isAuth,
    setIsAuth,
    signOut,
    guestLogin
  };

  return (
    <AuthContext.Provider value={value}>
      <ActionProvider>{children}</ActionProvider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
