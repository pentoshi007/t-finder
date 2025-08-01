import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IoClose, IoInformationCircle, IoServer, IoWarning } from 'react-icons/io5';

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
          className="server-info-popup"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-4 relative">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="bg-white/20 rounded-full p-2">
                    <IoServer className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg truncate">Server Information</h3>
                  <p className="text-blue-100 text-sm truncate">Important notice about our backend</p>
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <IoInformationCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Our backend is hosted on <span className="font-semibold text-blue-600">Render.com</span>. 
                    After periods of inactivity, the server may go to sleep to conserve resources.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-amber-500 rounded-full p-1.5">
                      <IoWarning className="text-white text-sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-800 text-sm font-semibold mb-2">
                      If you're experiencing issues:
                    </p>
                    <ul className="text-amber-700 text-sm space-y-1 mb-3">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        No data loading
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Backend not responding
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        API errors
                      </li>
                    </ul>
                    <p className="text-amber-800 text-sm font-medium">
                      Simply wait <span className="font-bold text-amber-900">40 seconds</span> and the server will wake up automatically!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm hover:shadow-md active:scale-95"
                >
                  Don't show again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm hover:shadow-md active:scale-95"
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