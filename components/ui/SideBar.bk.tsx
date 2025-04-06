import React from 'react';

const SideBar = () => {
  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-100 p-4 shadow-md border-2 border-red-500">
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      {/* Navigation items will go here */}
      <p>Sidebar Content</p>
    </div>
  );
};

export default SideBar;
