import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

export default function MessagesPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const currentUserId = auth.currentUser.uid;

  // Get all users (except me)
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUserId);
      setUsers(fetchedUsers);
    });

    return () => unsub();
  }, [currentUserId]);

  // Fetch messages in real-time for the selected conversation
  useEffect(() => {
    if (!selectedUser) return;

    const conversationId = generateConversationId(currentUserId, selectedUser.id);

    const messagesRef = collection(db, 'messages', conversationId, 'chats');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });

    return () => unsub();
  }, [currentUserId, selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const conversationId = generateConversationId(currentUserId, selectedUser.id);

    const messagesRef = collection(db, 'messages', conversationId, 'chats');

    await addDoc(messagesRef, {
      senderId: currentUserId,
      receiverId: selectedUser.id,
      text: newMessage.trim(),
      timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  const generateConversationId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar: List of users to chat with */}
      <div className="w-1/3 border-r border-gray-300 bg-white overflow-y-auto">
        <h2 className="text-lg font-bold p-4 border-b">Messages</h2>
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center w-full p-4 border-b hover:bg-gray-100 ${
              selectedUser?.id === user.id ? 'bg-gray-100' : ''
            }`}
          >
            <img
              src={'https://via.placeholder.com/40'}
              alt={user.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium">{user.name || user.id}</p>
              <p className="text-xs text-gray-500">{user.bio || 'No bio'}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center space-x-3">
              <img
                src={'https://via.placeholder.com/40'}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-lg font-bold">{selectedUser.name || selectedUser.id}</h2>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === currentUserId
                        ? 'bg-blue-500 text-white self-end ml-auto'
                        : 'bg-gray-200 text-gray-800 self-start mr-auto'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex p-4 border-t bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
