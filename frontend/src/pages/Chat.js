import React, { useState, useEffect } from 'react';
import socket from '../socket';
import axios from 'axios';

function Chat({ userId, token }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');

  useEffect(() => {
    if (receiverId) {
      axios.get(`http://localhost:5000/api/chat/messages/${userId}/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => setMessages(response.data))
      .catch(err => console.error(err));
    }
  }, [receiverId]);

  useEffect(() => {

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    socket.emit('sendMessage', { senderId: userId, receiverId, content: message });
    setMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <input type="text" placeholder="Receiver ID" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} />
      </div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender === userId ? "You" : "Other"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;