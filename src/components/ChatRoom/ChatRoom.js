import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./ChatRoom.scss";

function ChatRoom({ socket }) {
  const { id } = useParams();
  const dummy = useRef();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ file: ChatRoom.js ~ line 12 ~ ChatRoom ~ messages", messages)
  const userName = localStorage.getItem("username");
  const room = localStorage.getItem("room");
  const fetchMessages = () => {
    fetch(`http://localhost:8000/message/${room}`).then(async (response) => {
      const data = await response.json();
      console.log("🚀 ~ file: ChatRoom.js ~ line 18 ~ fetch ~ data", data)
      const newData =  data.map(item=>({
        user:item.user,
        msg:item.text,
        channel:item.channel
      }));
     
      setMessages([...newData]);
      console.log("🚀 ~ file: ChatRoom.js ~ line 17 ~ fetch ~ data", newData);
      // data.forEach((element) => {
      //   let temp = messages;
      //   temp.push(element.content);
      //   setMessages([...temp]);
      // });
    });
  };
  useEffect(() => {
    socket.emit("join", {
      channelToJoin: room,
      username: userName,
    });
    fetchMessages();
    // dummy.current.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    console.log('rejoin user');
    socket.emit("login", ({username:userName}));
  }, [socket, userName, room]);
  useEffect(() => {
    socket.on("msgReceive", (data) => {
      setMessages([...messages, data]);
    // dummy.current.scrollIntoView({ behavior: "smooth" });
    });
  }, [socket, messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    let messageContent = {
      room: room,
      user:userName,
      msg:text
    };
    await socket.emit("msgSend", messageContent);
    setMessages([...messages, messageContent]);
    setText("");
    // dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <React.Fragment>
      <main>
        {messages &&
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage} className='roomForm'>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="write text to send"
          className='messageInput'
        />

        <button type="submit" className='sendButton' disabled={!text}>
          send
        </button>
      </form>
    </React.Fragment>
  );
}

function ChatMessage(props) {
  const { room, user, msg } = props.message;

  const messageClass =
    user === localStorage.getItem("username") ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{msg}</p>
      </div>
    </>
  );
}

export default ChatRoom;
