import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function FollowersFollowing({ targetUserId }) {
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const userRef = doc(db, 'users', targetUserId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.error('User not found!');
          return;
        }

        const userData = userSnap.data();
        const { followers = [], following = [] } = userData;

        const followersProfiles = await fetchUserProfiles(followers);
        const followingProfiles = await fetchUserProfiles(following);

        setFollowersList(followersProfiles);
        setFollowingList(followingProfiles);
      } catch (error) {
        console.error('Error fetching followers/following:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowersAndFollowing();
  }, [targetUserId]);

  const fetchUserProfiles = async (userIds) => {
    const profiles = [];

    for (let userId of userIds) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          profiles.push({ id: userId, ...userSnap.data() });
        }
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
      }
    }

    return profiles;
  };

  if (loading) return <p>Loading followers/following...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>Followers ({followersList.length})</h3>
      {followersList.length === 0 ? (
        <p>No followers yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {followersList.map(user => (
            <li key={user.id} style={{ marginBottom: '10px' }}>
              <strong>{user.name}</strong>
              <p>{user.bio}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>Following ({followingList.length})</h3>
      {followingList.length === 0 ? (
        <p>Not following anyone yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {followingList.map(user => (
            <li key={user.id} style={{ marginBottom: '10px' }}>
              <strong>{user.name}</strong>
              <p>{user.bio}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
