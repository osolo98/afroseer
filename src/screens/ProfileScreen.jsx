import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { format } from 'date-fns';
import AppLayout from '../layout/AppLayout';
import PostCard from '../components/PostCard';

export default function ProfileScreen() {
  const { id } = useParams();
  const [user, loadingUser] = useAuthState(auth);
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: '', bio: '', username: '', location: '' });
  const [canEditUsername, setCanEditUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [echoes, setEchoes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isOwnProfile = !id || id === user?.uid;
  const profileId = id || user?.uid;

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', profileId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setProfileData(data);
          setForm({
            displayName: data.displayName || '',
            bio: data.bio || '',
            username: data.username || '',
            location: data.location || ''
          });

          if (isOwnProfile) {
            const lastChange = data.lastUsernameChange?.toDate?.();
            if (!lastChange || Date.now() - lastChange.getTime() > 30 * 24 * 60 * 60 * 1000) {
              setCanEditUsername(true);
            }
          }

          if (!isOwnProfile && (data.followers || []).includes(user.uid)) {
            setIsFollowing(true);
          }
        }

        const echoQuery = query(
          collection(db, 'echoes'),
          where('userId', '==', profileId),
          where('type', '==', 'echo')
        );
        const echoSnap = await getDocs(echoQuery);
        const echoList = echoSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEchoes(echoList.reverse());
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    fetchProfile();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;

    const updates = {
      displayName: form.displayName,
      bio: form.bio,
      location: form.location
    };

    if (canEditUsername && form.username !== profileData.username) {
      const q = query(collection(db, 'users'), where('username', '==', form.username));
      const existing = await getDocs(q);
      const taken = existing.docs.some((doc) => doc.id !== user.uid);

      if (taken) {
        setUsernameError('Username is already taken.');
        return;
      }

      updates.username = form.username;
      updates.lastUsernameChange = serverTimestamp();
    }

    await updateDoc(doc(db, 'users', user.uid), updates);
    setProfileData((prev) => ({ ...prev, ...updates }));
    setEditing(false);
    setUsernameError('');
  };

  const handleFollow = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', profileId), {
        followers: arrayUnion(user.uid)
      });
      await updateDoc(doc(db, 'users', user.uid), {
        following: arrayUnion(profileId)
      });
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', profileId), {
        followers: arrayRemove(user.uid)
      });
      await updateDoc(doc(db, 'users', user.uid), {
        following: arrayRemove(profileId)
      });
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'afroseerup_avatars');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dp3zo88se/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        await updateDoc(doc(db, 'users', user.uid), {
          avatar: data.secure_url
        });
        setProfileData((prev) => ({ ...prev, avatar: data.secure_url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser || !user || !profileData) {
    return (
      <AppLayout>
        <p className="p-4">Loading profile...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white p-4 rounded shadow max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profileData.avatar || 'https://placehold.co/100x100?text=Avatar'}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover border"
            />
            {isOwnProfile && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute bottom-0 left-0 w-20 h-20 opacity-0 cursor-pointer"
                  title="Change avatar"
                />
                {uploading && (
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/70 flex items-center justify-center text-xs">
                    Uploading...
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profileData.displayName || 'Unnamed User'}</h2>
            <p className="text-gray-600">@{profileData.username || 'unknown'}</p>
            {profileData.location && (
              <p className="text-sm text-gray-500 mt-1">📍 {profileData.location}</p>
            )}
            {profileData.createdAt?.toDate && (
              <p className="text-sm text-gray-400">
                Joined {format(profileData.createdAt.toDate(), 'MMMM yyyy')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 text-gray-800">
          {editing ? (
            <>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                placeholder="Display Name"
                className="w-full border p-2 rounded mb-2"
              />
              {canEditUsername && (
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Username"
                  className="w-full border p-2 rounded mb-2"
                />
              )}
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Bio"
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
                className="w-full border p-2 rounded mb-2"
              />
              <div className="text-right">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{profileData.bio || 'No bio yet.'}</p>
              {isOwnProfile && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 text-blue-600 text-sm underline"
                >
                  Edit Profile
                </button>
              )}
              {!isOwnProfile && (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className={`mt-4 px-4 py-1 rounded text-white ${
                    isFollowing
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex gap-6 text-sm text-gray-600 mt-4">
          <Link to={`/profile/${profileId}/following`} className="hover:underline">
            <strong>{profileData.following?.length || 0}</strong> Following
          </Link>
          <Link to={`/profile/${profileId}/followers`} className="hover:underline">
            <strong>{profileData.followers?.length || 0}</strong> Followers
          </Link>
        </div>
      </div>

      {/* Echoes */}
      <div className="max-w-xl mx-auto mt-6">
        {echoes.length > 0 ? (
          echoes.map((echo) => <PostCard key={echo.id} post={echo} />)
        ) : (
          <p className="text-center text-gray-500 mt-6">No echoes yet.</p>
        )}
      </div>
    </AppLayout>
  );
}
