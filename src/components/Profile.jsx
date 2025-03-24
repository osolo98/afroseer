import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile(data);
        setName(data.name);
        setBio(data.bio);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);

    await updateDoc(userRef, {
      name,
      bio
    });

    setProfile({ ...profile, name, bio });
    setEditMode(false);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>My Profile</h2>

      <img
        src={profile.photoURL || 'https://via.placeholder.com/100'}
        alt="Profile"
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
      />

      {editMode ? (
        <>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}
