import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoClose, IoInformationCircle, IoServer } from 'react-icons/io5';

const ServerInfoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the popup before
    const dismissed = localStorage.getItem('serverInfoDismissed');
    if (!dismissed) {
      // Show popup after 1 second
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('serverInfoDismissed', 'true');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 relative">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <IoServer className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">Server Information</h3>
                  <p className="text-blue-100 text-sm">Important notice about our backend</p>
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <IoInformationCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Our backend is hosted on <span className="font-semibold text-blue-600">Render.com</span>. 
                    After periods of inactivity, the server may go to sleep to conserve resources.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-amber-800 text-sm font-medium mb-1">
                      If you're experiencing issues:
                    </p>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• No data loading</li>
                      <li>• Backend not responding</li>
                      <li>• API errors</li>
                    </ul>
                    <p className="text-amber-800 text-sm font-medium mt-2">
                      Simply wait <span className="font-bold">40 seconds</span> and the server will wake up automatically!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Don't show again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServerInfoPopup;