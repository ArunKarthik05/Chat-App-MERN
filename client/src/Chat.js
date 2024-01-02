import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room, handleLogout }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  console.log(typeof localStorage.getItem("messages"));
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  async function logoutServer() {
    await socket.emit("logout", room);
  }

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.author !== username) {
        setMessageList((list) => [...list, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup function to unsubscribe when the component is unmounted
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, username]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat of {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">
                      {messageContent.author === username
                        ? "you"
                        : messageContent.author}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <button
        className="logout"
        onClick={() => {
          handleLogout();
          logoutServer();
        }}
      >
        logout
      </button>
    </div>
  );
}

export default Chat;
