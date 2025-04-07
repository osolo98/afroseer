// 📄 src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import StreamsScreen from './screens/StreamsScreen';
import MessagesScreen from './screens/MessagesScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavBar from './layout/BottomNavBar';
import HashtagFeed from './screens/HashtagFeed';
import SettingsScreen from './screens/SettingsScreen';
import SettingsAccount from './screens/SettingsAccount';
import SettingsNotifications from './screens/SettingsNotifications';
import SettingsPrivacy from './screens/SettingsPrivacy';
import AuthScreen from './screens/AuthScreen';
import MessageRequests from './screens/MessageRequests';
import RequireAuthRoute from './components/auth/RequireAuthRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/streams" element={<StreamsScreen />} />
          
          <Route
            path="/messages"
            element={
              <RequireAuthRoute>
                <MessagesScreen />
              </RequireAuthRoute>
            }
          />
          <Route
            path="/messages/requests"
            element={
              <RequireAuthRoute>
                <MessageRequests />
              </RequireAuthRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuthRoute>
                <ProfileScreen />
              </RequireAuthRoute>
            }
          />
          <Route path="/profile/:id" element={<ProfileScreen />} />

          <Route path="/wallet" element={<WalletScreen />} />
          <Route path="/hashtag/:tag" element={<HashtagFeed />} />

          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/settings/account" element={<SettingsAccount />} />
          <Route path="/settings/notifications" element={<SettingsNotifications />} />
          <Route path="/settings/privacy" element={<SettingsPrivacy />} />
          <Route path="/auth" element={<AuthScreen />} />
        </Routes>
      </div>

      <BottomNavBar />
    </div>
  );
}

export default App;
