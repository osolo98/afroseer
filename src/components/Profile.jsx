import React, { useState, useEffect } from 'react';
import FollowersFollowing from './FollowersFollowing.jsx';

import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

export default function Profile({ targetUserId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const [showFollowersFollowing, setShowFollowersFollowing] = useState(false);

  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', targetUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfile(data);
          setName(data.name);
          setBio(data.bio);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  const handleSave = async () => {
    const userRef = doc(db, 'users', targetUserId);

    await updateDoc(userRef, {
      name,
      bio
    });

    setProfile({ ...profile, name, bio });
    setEditMode(false);
  };

  const handleFollow = async () => {
    const userRef = doc(db, 'users', currentUserId);
    const targetRef = doc(db, 'users', targetUserId);

    await updateDoc(userRef, {
      following: arrayUnion(targetUserId)
    });

    await updateDoc(targetRef, {
      followers: arrayUnion(currentUserId)
    });

    // Optionally update UI:
    setProfile((prev) => ({
      ...prev,
      followers: [...(prev.followers || []), currentUserId]
    }));
  };

  const handleUnfollow = async () => {
    const userRef = doc(db, 'users', currentUserId);
    const targetRef = doc(db, 'users', targetUserId);

    await updateDoc(userRef, {
      following: arrayRemove(targetUserId)
    });

    await updateDoc(targetRef, {
      followers: arrayRemove(currentUserId)
    });

    // Optionally update UI:
    setProfile((prev) => ({
      ...prev,
      followers: (prev.followers || []).filter(id => id !== currentUserId)
    }));
  };

  if (loading) return <p>Loading profile...</p>;

  const isCurrentUser = currentUserId === targetUserId;
  const isFollowing = profile.followers?.includes(currentUserId);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>{isCurrentUser ? 'My Profile' : `${profile.name}'s Profile`}</h2>

      {/* No profile photo - optional placeholder */}
      <img
        src={'https://via.placeholder.com/100'}
        alt="Profile"
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
      />

      {editMode && isCurrentUser ? (
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
          <p><strong>Followers:</strong> {profile.followers?.length || 0}</p>
          <p><strong>Following:</strong> {profile.following?.length || 0}</p>

          <button onClick={() => setShowFollowersFollowing(!showFollowersFollowing)}>
            {showFollowersFollowing ? 'Hide Followers/Following' : 'Show Followers/Following'}
        </button>

        {showFollowersFollowing && (
        <FollowersFollowing targetUserId={targetUserId} />
        )}


          {isCurrentUser ? (
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          ) : (
            isFollowing ? (
              <button onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button onClick={handleFollow}>Follow</button>
            )
          )}
        </>
      )}
    </div>
  );
}
