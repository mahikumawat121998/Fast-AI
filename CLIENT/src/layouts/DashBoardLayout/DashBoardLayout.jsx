import { useEffect } from "react";
import "./dashBoardLayout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ChatList from "../../components/ChatList/ChatList";

const DashBoardLayout = () => {
  const { userId, isLoaded } = useAuth();
  console.log("userId", "isLoading", userId, isLoaded);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
    console.log("userId");
  }, [isLoaded, userId, navigate]);
  if (!isLoaded) return "Loading...";
  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardLayout;
