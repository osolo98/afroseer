// 📄 src/screens/SettingsPrivacy.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AppLayout from '../layout/AppLayout';

export default function SettingsPrivacy() {
  const userId = auth.currentUser?.uid;
  const [profileVisibility, setProfileVisibility] = useState('Everyone');
  const [dmPermission, setDmPermission] = useState('everyone');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      const data = snap.data();
      setProfileVisibility(data?.privacy?.profileVisibility || 'Everyone');
      setDmPermission(data?.dmPermission || 'everyone'); // <-- NEW
    };

    loadUser();
  }, [userId]);

  const saveChanges = async () => {
    if (!userId) return;
    setSaving(true);
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      privacy: {
        profileVisibility,
      },
      dmPermission, // <-- NEW
    });
    setSaving(false);
    alert('Privacy settings saved!');
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">🔒 Privacy Settings</h1>

      <div className="space-y-4">
        <label className="block">
          Who can see your profile:
          <select
            className="w-full border p-2 rounded mt-1"
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
          >
            <option>Everyone</option>
            <option>Followers only</option>
            <option>Private</option>
          </select>
        </label>

        <label className="block">
          Who can message you:
          <select
            className="w-full border p-2 rounded mt-1"
            value={dmPermission}
            onChange={(e) => setDmPermission(e.target.value)}
          >
            <option value="everyone">Anyone</option>
            <option value="friends">Only friends</option>
          </select>
        </label>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </button>
      </div>
    </AppLayout>
  );
}
