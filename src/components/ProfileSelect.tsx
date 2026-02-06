import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

interface ProfileSelectProps {
  onProfileSelected: () => void;
}

const AVATARS = ['👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧔', '👱', '🧓', '👨‍🎓', '👩‍🎓'];

export default function ProfileSelect({ onProfileSelected }: ProfileSelectProps) {
  const { currentProfile, profiles, createProfile, switchProfile } = useProfile();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleCreateProfile = () => {
    if (username.trim()) {
      createProfile(username, selectedAvatar);
      setUsername('');
      setShowCreateForm(false);
      onProfileSelected();
    }
  };

  const handleSelectProfile = (profileId: string) => {
    switchProfile(profileId);
    onProfileSelected();
  };

  if (currentProfile && !showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 via-pink-600 to-red-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-5xl font-bold text-white mb-2">🎮 Game Hub</h1>
            <p className="text-white text-opacity-90">Welcome back!</p>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-8 mb-6 border-4 border-yellow-400">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4 animate-bounce">{currentProfile.avatar}</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentProfile.username}
              </h2>
              <p className="text-gray-600 mt-2 font-bold">
                Total Games: {
                  currentProfile.stats.tictactoe.gamesPlayed +
                  currentProfile.stats.sudoku.gamesPlayed +
                  currentProfile.stats.chess.gamesPlayed
                }
              </p>
            </div>

            <button
              onClick={onProfileSelected}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg"
            >
              Continue Playing
            </button>

            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 py-3 rounded-xl font-bold mt-3 hover:opacity-90 transition shadow-lg"
            >
              Switch Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-cyan-600 via-blue-600 to-purple-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-5xl font-bold text-white mb-2">🎮 Game Hub</h1>
            <p className="text-white text-opacity-90">Create New Profile</p>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-8 border-4 border-green-400">
            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-2 text-lg">👤 Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-300 text-lg"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-3 text-lg">😊 Choose Avatar</label>
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl py-3 rounded-lg border-2 transition transform hover:scale-110 ${
                      selectedAvatar === avatar
                        ? 'border-green-600 bg-gradient-to-br from-green-200 to-green-100 shadow-lg'
                        : 'border-gray-300 hover:border-green-400 bg-white'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateProfile}
                disabled={!username.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition shadow-lg"
              >
                Create Profile
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>

          {profiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-bold text-lg mb-4">Your Profiles</h3>
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile.id)}
                    className="w-full bg-white bg-opacity-20 text-white py-3 rounded-xl font-bold hover:bg-opacity-30 transition flex items-center gap-3 border-2 border-white border-opacity-30 hover:border-opacity-100"
                  >
                    <span className="text-3xl">{profile.avatar}</span>
                    <span>{profile.username}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 via-red-600 to-orange-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-2">🎮 Game Hub</h1>
          <p className="text-white text-opacity-90">Select or Create a Profile</p>
        </div>

        {profiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-4">Your Profiles</h3>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className="w-full bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition flex items-center gap-4 border-2 border-yellow-400 hover:border-yellow-300"
                >
                  <span className="text-5xl">{profile.avatar}</span>
                  <div className="text-left">
                    <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {profile.username}
                    </h4>
                    <p className="text-gray-600 font-bold">
                      {profile.stats.tictactoe.gamesPlayed +
                        profile.stats.sudoku.gamesPlayed +
                        profile.stats.chess.gamesPlayed} games played
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold text-lg border-2 border-white hover:bg-white hover:text-blue-600 transition shadow-lg"
        >
          + Create New Profile
        </button>
      </div>
    </div>
  );
}
