import { lazy } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

const Channel = lazy(()=>import('../components/ChannelList'));
const ChatRoom = lazy(()=>import('../components/ChatRoom/ChatRoom'));
export const ROUTES = [
  {
    path: "/",
    component: Login,
    isEager: true,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/signup",
    component: Register,
    isEager: true,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/channels",
    component: Channel,
    isPrivate: true,
    routes:[
      {
        path: "/channels/chat-room/:id",
        component: ChatRoom,
      },
    ]
  },
  // {
  //   path: "/chat-room/:id",
  //   component: ChatRoom,
  //   isPrivate: true,
  //   exact: true,
  // },
];
