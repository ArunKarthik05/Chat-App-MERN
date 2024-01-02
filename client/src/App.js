import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState(() => {
    const storedUsername = JSON.parse(localStorage.getItem("username"));
    return storedUsername || "";
  });
  const [room, setRoom] = useState(() => {
    const storedRoom = JSON.parse(localStorage.getItem("room"));
    return storedRoom || "";
  });
  const [showChat, setShowChat] = useState(() => {
    const storedShowChat = JSON.parse(localStorage.getItem("showChat"));
    return storedShowChat || false;
  });
  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(username));
  }, [username]);

  useEffect(() => {
    localStorage.setItem("room", JSON.stringify(room));
  }, [room]);

  useEffect(() => {
    localStorage.setItem("showChat", JSON.stringify(showChat));
  }, [showChat]);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", username, room);
      setShowChat(true);
    }
  };

  function Logout() {
    setShowChat(false);
  }
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          handleLogout={Logout}
        />
      )}
    </div>
  );
}

export default App;
