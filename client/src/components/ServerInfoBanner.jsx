import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoClose, IoInformationCircle, IoServer } from 'react-icons/io5';

const ServerInfoBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('serverBannerDismissed');
    if (!dismissed) {
      // Show banner after 1 second
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('serverBannerDismissed', 'true');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <IoServer className="text-white text-xl flex-shrink-0" />
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">
                    <IoInformationCircle className="inline mr-1" />
                    Backend hosted on Render.com
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    Server may sleep after inactivity
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">
                    Wait 40 seconds if experiencing issues
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  Don't show again
                </button>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <IoClose className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServerInfoBanner;