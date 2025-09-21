import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      {children}
    </div>
  );
};

export default PageContainer;
