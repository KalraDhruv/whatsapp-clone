import { useState, useEffect, useRef } from "react";

function ChatWindow({ room, username, socket, isActive, onNewMessage, onClose }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      if (data.room === room.id) {
        setMessageList((list) => [...list, data]);
        onNewMessage(room.id);
      }
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket, room.id, onNewMessage]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room.id,
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`chat ${isMinimized ? "minimized" : ""} ${isActive ? "active-chat" : ""}`}>
      <div className="chat-title" onClick={() => setIsMinimized(!isMinimized)}>
        <h1>{room.name}</h1>
        <h2>{room.id}</h2>
        <figure className="avatar">
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#248A52", color: "white", fontSize: "12px", fontWeight: "bold" }}>
            {getInitials(room.name)}
          </div>
          {room.unreadCount > 0 && (
            <span className="chat-message-counter">{room.unreadCount}</span>
          )}
        </figure>
        <span className="online-bullet"></span>
      </div>

      {!isMinimized && (
        <>
          <div className="messages">
            <div className="messages-content">
              {messageList.map((messageContent, index) => {
                const isOwnMessage = messageContent.author === username;
                return (
                  <div
                    key={index}
                    className={`message ${isOwnMessage ? "message-personal" : ""} new`}
                  >
                    {!isOwnMessage && (
                      <div className="message-author">{messageContent.author}</div>
                    )}
                    {messageContent.message}
                    <div className="timestamp">{messageContent.time}</div>
                    <figure className="avatar">
                      {getInitials(messageContent.author)}
                    </figure>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="message-box">
            <textarea
              className="message-input"
              placeholder="Type message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="message-submit" onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
