import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import Modal from './Modal'; // Reusable modal component (from earlier)

// If you don't have the Modal component yet, let me know!

export default function Profile({ targetUserId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const currentUserId = auth.currentUser.uid;

  const isCurrentUser = currentUserId === targetUserId;

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

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, 'users', targetUserId);
      await updateDoc(userRef, { name, bio });

      setProfile(prev => ({ ...prev, name, bio }));
      setShowEditProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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

    setProfile(prev => ({
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
      followers: (prev.followers || []).filter(id => id !== currentUserId)
    });

    setProfile(prev => ({
      ...prev,
      followers: (prev.followers || []).filter(id => id !== currentUserId)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const isFollowing = profile.followers?.includes(currentUserId);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />

        <h2 className="text-xl font-bold">
          {isCurrentUser ? 'My Profile' : `${profile.name}'s Profile`}
        </h2>

        <p className="text-gray-600">{profile.bio || 'No bio available.'}</p>

        <div className="flex space-x-4 text-sm text-gray-500">
          <button
            onClick={() => setShowFollowersModal(true)}
            className="hover:text-blue-500"
          >
            <strong>{profile.followers?.length || 0}</strong> Followers
          </button>
          <button
            onClick={() => setShowFollowingModal(true)}
            className="hover:text-blue-500"
          >
            <strong>{profile.following?.length || 0}</strong> Following
          </button>
        </div>

        {isCurrentUser ? (
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full"
          >
            Edit Profile
          </button>
        ) : isFollowing ? (
          <button
            onClick={handleUnfollow}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full"
          >
            Follow
          </button>
        )}
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <Modal title="Followers" onClose={() => setShowFollowersModal(false)}>
          {profile.followers && profile.followers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {profile.followers.map(followerId => (
                <li key={followerId} className="py-2">
                  {followerId}
                </li>
              ))}
            </ul>
          ) : (
            <p>No followers yet.</p>
          )}
        </Modal>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <Modal title="Following" onClose={() => setShowFollowingModal(false)}>
          {profile.following && profile.following.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {profile.following.map(followingId => (
                <li key={followingId} className="py-2">
                  {followingId}
                </li>
              ))}
            </ul>
          ) : (
            <p>Not following anyone yet.</p>
          )}
        </Modal>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <Modal title="Edit Profile" onClose={() => setShowEditProfileModal(false)}>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
            />

            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Bio"
              rows="3"
            />

            <button
              onClick={handleSaveProfile}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
