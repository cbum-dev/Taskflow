import React from "react";

interface signinLayoutProps {
  children: React.ReactNode;
}
function layout({ children }: signinLayoutProps) {
  return <div>
    {children}
  </div>;
}

export default layout;
