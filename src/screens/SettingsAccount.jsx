// 📄 src/screens/SettingsAccount.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AppLayout from '../layout/AppLayout';

export default function SettingsAccount() {
  const userId = auth.currentUser?.uid;
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      const data = snap.data();
      setDisplayName(data?.displayName || '');
      setEmail(data?.email || '');
    };

    if (userId) loadUser();
  }, [userId]);

  const saveChanges = async () => {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      displayName,
      email,
    });
    alert('Account settings saved!');
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">👤 Account Settings</h1>
      <div className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
        />
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
        />
        <button onClick={saveChanges} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </AppLayout>
  );
}
