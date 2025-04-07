import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import StreamCard from '../components/StreamCard';
import StreamUploaderModal from '../components/StreamUploaderModal';
import StreamBottomNavBar from '../components/StreamBottomNavBar';
import StreamLeftSidebar from '../components/StreamLeftSidebar';
import StreamCommentsSidebar from '../components/StreamCommentsSidebar';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function StreamsScreen() {
  const [streams, setStreams] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeStreamId, setActiveStreamId] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const q = query(collection(db, 'streams'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStreams(docs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen w-full flex relative">
      {/* Left nav */}
      <StreamLeftSidebar />

      {/* Main feed */}
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory ml-16 mr-[320px]">
        {streams.map((stream) => (
          <div key={stream.id} onClick={() => setActiveStreamId(stream.id)}>
            <StreamCard stream={stream} />
          </div>
        ))}
      </div>

      {/* Right comment sidebar */}
      <StreamCommentsSidebar streamId={activeStreamId} />

      {/* Bottom nav for mobile */}
      <StreamBottomNavBar openUploader={() => setUploadOpen(true)} />

      {/* Floating camera button for desktop (auth only) */}
      {user && (
        <div
          className="hidden lg:block fixed bottom-6 right-6 z-50 group"
          title="Upload new video"
        >
          <button
            onClick={() => setUploadOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform group-hover:scale-110 hover:bg-blue-700"
          >
            📷
          </button>
        </div>
      )}

      {/* Upload modal */}
      <StreamUploaderModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
