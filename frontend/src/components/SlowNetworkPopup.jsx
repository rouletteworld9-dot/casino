import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, X } from "lucide-react";

export default function SlowNetworkPopup() {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Network speed detection using Network Information API (when available)
  useEffect(() => {
    if ("connection" in navigator) {
      const connection = navigator.connection;

      const updateConnectionInfo = () => {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;

        setNetworkSpeed({ effectiveType, downlink });

        // Consider network slow if:
        // - Effective type is 'slow-2g' or '2g'
        // - Downlink is less than 1 Mbps
        const isSlow =
          effectiveType === "slow-2g" || effectiveType === "2g" || downlink < 1;

        if (isSlow && !isSlowNetwork) {
          setIsSlowNetwork(true);
          setShowPopup(true);
        } else if (!isSlow && isSlowNetwork) {
          setIsSlowNetwork(false);
        }
      };

      updateConnectionInfo();
      connection.addEventListener("change", updateConnectionInfo);

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }
  }, [isSlowNetwork]);

  // Fallback: Monitor request timing for speed detection
  useEffect(() => {
    let timeoutId;

    const checkNetworkSpeed = async () => {
      try {
        const startTime = performance.now();

        // Use a small image or favicon for speed test
        const response = await fetch("/favicon.ico?" + Math.random(), {
          method: "HEAD",
          cache: "no-cache",
        });

        const endTime = performance.now();
        const duration = endTime - startTime;

        // If request takes more than 3 seconds, consider it slow
        if (duration > 3000 && !isSlowNetwork) {
          setIsSlowNetwork(true);
          setShowPopup(true);
        } else if (duration <= 1000 && isSlowNetwork) {
          setIsSlowNetwork(false);
        }
      } catch (error) {
        // Network error - could indicate slow or no connection
        if (!isSlowNetwork) {
          setIsSlowNetwork(true);
          setShowPopup(true);
        }
      }

      // Check every 30 seconds
      timeoutId = setTimeout(checkNetworkSpeed, 30000);
    };

    // Initial check after 5 seconds
    timeoutId = setTimeout(checkNetworkSpeed, 5000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSlowNetwork]);

  // Auto-hide popup after 10 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const getConnectionText = () => {
    if (!isOnline) {
      return "No internet connection";
    }

    if (networkSpeed) {
      return `Connection: ${networkSpeed.effectiveType.toUpperCase()} (${networkSpeed.downlink} Mbps)`;
    }

    return "Slow network detected";
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Popup */}
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 animate-pulse">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-orange-500" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                Connection Issue
              </h3>
            </div>
            <button
              onClick={closePopup}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                {!isOnline
                  ? "You're currently offline. Please check your internet connection."
                  : "Your internet connection appears to be slow. This may affect loading times and performance."}
              </p>
              <div className="text-sm text-gray-500">{getConnectionText()}</div>
            </div>

            {/* Speed indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Connection Quality</span>
                <span>
                  {isOnline ? (isSlowNetwork ? "Poor" : "Good") : "Offline"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    !isOnline
                      ? "bg-red-500 w-0"
                      : isSlowNetwork
                        ? "bg-orange-500 w-1/4"
                        : "bg-green-500 w-3/4"
                  }`}
                ></div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Suggestions:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {!isOnline ? (
                  <>
                    <li>• Check your Wi-Fi or mobile data connection</li>
                    <li>• Try switching between Wi-Fi and mobile data</li>
                  </>
                ) : (
                  <>
                    <li>• Close other apps using internet</li>
                    <li>• Move closer to your Wi-Fi router</li>
                    <li>• Try refreshing the page</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
        <h4 className="font-medium mb-3">Demo Controls</h4>
        <div className="space-y-2">
          <button
            onClick={() => {
              setIsSlowNetwork(true);
              setShowPopup(true);
            }}
            className="block w-full px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
          >
            Show Slow Network
          </button>
          <button
            onClick={() => {
              setIsSlowNetwork(false);
              setShowPopup(false);
            }}
            className="block w-full px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
          >
            Hide Popup
          </button>
          <div className="text-xs text-gray-600 mt-2">
            Status: {isOnline ? (isSlowNetwork ? "Slow" : "Good") : "Offline"}
          </div>
        </div>
      </div>
    </>
  );
}
