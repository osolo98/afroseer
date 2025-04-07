import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
//import MessageRequests from './screens/MessageRequests';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';

export default function MessageRequests() {
  const userId = auth.currentUser?.uid;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const ref = collection(db, 'requests', userId, 'from');
      const snaps = await getDocs(ref);

      const result = [];
      for (const sender of snaps.docs) {
        const userRef = doc(db, 'users', sender.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        result.push({
          id: sender.id,
          name: userData?.displayName || 'Unknown',
          username: userData?.username || '',
        });
      }

      setRequests(result);
    };

    if (userId) fetchRequests();
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Message Requests</h2>
      {requests.length === 0 && <p>No new message requests</p>}
      <ul className="space-y-3">
        {requests.map((r) => (
          <li key={r.id} className="p-3 border rounded bg-white shadow-sm">
            <div className="font-semibold">@{r.username}</div>
            <div className="text-sm text-gray-600">{r.name}</div>
            {/* Later: Accept/Ignore Buttons */}
          </li>
        ))}
      </ul>
    </div>
  );
}
