// 📄 src/utils/dmPermissions.js
//Purpose: Reusable logic to check if a message can be sent.
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const canSendDM = async (recipientId) => {
  const senderId = auth.currentUser?.uid;
  if (!senderId) return false;

  const ref = doc(db, 'users', recipientId);
  const snap = await getDoc(ref);
  const user = snap.data();

  if (!user) return false;

  if (user.dmPermission === 'everyone') return true;

  const isFriend =
    user.followers?.includes(senderId) &&
    user.following?.includes(senderId);

  return isFriend;
};
