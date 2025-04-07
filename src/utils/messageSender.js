// 📄 src/utils/messageSender.js
//Purpose: Unified send logic that uses canSendDM.
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { canSendDM } from './dmPermissions';

const getThreadId = (uid1, uid2) =>
  [uid1, uid2].sort().join('_'); // Consistent thread ID

export const sendMessage = async (recipientId, text) => {
  const senderId = auth.currentUser?.uid;
  if (!senderId || !text) return false;

  const isAllowed = await canSendDM(recipientId);
  const createdAt = serverTimestamp();

  if (isAllowed) {
    const threadId = getThreadId(senderId, recipientId);
    await addDoc(collection(db, 'messages', threadId, 'chats'), {
      from: senderId,
      to: recipientId,
      text,
      createdAt
    });
  } else {
    await addDoc(collection(db, 'requests', recipientId, 'from', senderId, 'messages'), {
      from: senderId,
      to: recipientId,
      text,
      createdAt
    });
  }

  return isAllowed;
};
