// 📄 src/screens/SettingsNotifications.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AppLayout from '../layout/AppLayout';

export default function SettingsNotifications() {
  const userId = auth.currentUser?.uid;
  const [emailNotif, setEmailNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(false);
  const [msgNotif, setMsgNotif] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      const n = snap.data()?.notifications || {};
      setEmailNotif(n.email || false);
      setPushNotif(n.push || false);
      setMsgNotif(n.messages || false);
    };

    if (userId) loadUser();
  }, [userId]);

  const saveChanges = async () => {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      notifications: {
        email: emailNotif,
        push: pushNotif,
        messages: msgNotif,
      },
    });
    alert('Notification settings saved!');
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">🔔 Notification Settings</h1>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
          Email notifications
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
          Push notifications
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={msgNotif} onChange={(e) => setMsgNotif(e.target.checked)} />
          Message alerts
        </label>
        <button onClick={saveChanges} className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
          Save Preferences
        </button>
      </div>
    </AppLayout>
  );
}
