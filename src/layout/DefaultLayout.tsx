import React, { ReactNode, useState, useEffect } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  onBack?: () => void;
  showHeader?: boolean;
  showFooter?: boolean;
  usePageBackground?: boolean; // New prop to allow pages to control their own background
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,

  usePageBackground = false, // Default to false to maintain existing behavior
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileKeywords =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileKeywords.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (usePageBackground) {
    // For pages that want to handle their own full-screen background
    return <div className="min-h-screen">{children}</div>;
  }

  // Default layout with bgdot.jpg background
  return (
    <div
      className="flex justify-center min-h-screen"
      style={{
        backgroundImage: "url('/bgdot.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#60a5fa", // Fallback blue color
      }}
    >
      {/* Container - responsive sizing based on device type */}
      <div
        className={`${
          isMobile ? "w-full" : "w-full max-w-[375px]"
        } min-h-screen flex flex-col`}
      >
        <main className="flex-1">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
