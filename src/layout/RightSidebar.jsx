// 📄 File: src/components/layout/RightSidebar.jsx

import React from 'react';

export default function RightSidebar({ echoes }) {
  const hashtagMap = {};

  echoes.forEach((post) => {
    const hashtags = post.text?.match(/#[a-zA-Z0-9_]+/g) || [];
    hashtags.forEach((tag) => {
      hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
    });
  });

  const trending = Object.entries(hashtagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="hidden lg:block fixed right-4 top-20 w-64 bg-white shadow p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-3">Trending</h3>
      <ul className="space-y-2">
        {trending.map(([tag, count]) => (
          <li key={tag} className="text-blue-600 cursor-pointer hover:underline text-sm">
            {tag} <span className="text-gray-400">({count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
