import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// <Skeleton count={5} />
const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userChats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });
  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore SYNAPSE AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending ? (
          <Skeleton count={5} />
        ) : error ? (
          "Some Err has occured during data fetching process"
        ) : (
          data?.map((chats) => (
            <Link to={`/dashboard/chats/${chats._id}`} key={chats._id}>
              {chats.title}
            </Link>
          ))
        )}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
