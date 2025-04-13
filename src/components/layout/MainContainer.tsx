
import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen lg:ml-[70px] transition-all duration-300">
      {children}
    </div>
  );
};

export default MainContainer;
