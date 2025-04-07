// 📄 src/screens/MessagesScreen.jsx
import React, { useEffect, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import { auth, db } from '../firebase';
import { sendMessage } from '../utils/messageSender';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function MessagesScreen() {
  const currentUserId = auth.currentUser?.uid;

  const [activeRecipient, setActiveRecipient] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [messageRequestsCount, setMessageRequestsCount] = useState(0);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const dummyPeople = [
    { id: 'user123', name: 'Jane Doe' },
    { id: 'user456', name: 'John Smith' },
  ];

  // ✅ SEED request message to test
  const seedTestRequest = async () => {
    const testSenderId = 'seed_user';
    const path = collection(db, 'requests', currentUserId, 'from', testSenderId, 'messages');
    await addDoc(path, {
      from: testSenderId,
      to: currentUserId,
      text: '🔁 This is a test message request.',
      createdAt: serverTimestamp(),
    });
    alert('Seed request added!');
  };

  // ✅ Count message requests
  useEffect(() => {
    const fetchRequestCount = async () => {
      setLoadingRequests(true);
      const ref = collection(db, 'requests', currentUserId, 'from');
      const snap = await getDocs(ref);
      setMessageRequestsCount(snap.docs.length);
      setLoadingRequests(false);
    };

    if (currentUserId) fetchRequestCount();
  }, [currentUserId]);

  // ✅ Listen to messages
  useEffect(() => {
    if (!currentUserId || !activeRecipient) return;

    const threadId = [currentUserId, activeRecipient].sort().join('_');
    const q = query(collection(db, 'messages', threadId, 'chats'), orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => doc.data());
      setChatMessages(msgs);
    });

    return () => unsub();
  }, [currentUserId, activeRecipient]);

  const handleSend = async () => {
    if (!messageInput || !activeRecipient) return;
    const allowed = await sendMessage(activeRecipient, messageInput);

    if (allowed) {
      setMessageInput('');
    } else {
      alert('Message sent as a request. They will see it if they accept.');
      setMessageInput('');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 pb-32 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">💬 Messages</h1>
          <div className="flex gap-3 items-center">
            <Link
              to="/messages/requests"
              className="text-blue-600 relative text-sm underline"
            >
              Requests
              {messageRequestsCount > 0 && (
                <span className="ml-1 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {messageRequestsCount}
                </span>
              )}
            </Link>
            <button
              onClick={seedTestRequest}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              + Seed
            </button>
          </div>
        </div>

        {/* Recipient Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">To:</label>
          <select
            className="w-full p-2 border rounded"
            value={activeRecipient}
            onChange={(e) => setActiveRecipient(e.target.value)}
          >
            <option value="">Select a user</option>
            {dummyPeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Window */}
        <div className="bg-white border rounded mb-4 p-3 h-64 overflow-y-auto">
          {chatMessages.length === 0 ? (
            <p className="text-gray-400">No messages yet.</p>
          ) : (
            chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 max-w-[80%] p-2 rounded-md text-sm ${
                  msg.from === currentUserId
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="fixed bottom-20 left-0 right-0 px-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded p-2"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
