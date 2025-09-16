// components/InstallPrompt.jsx
import { Download } from "lucide-react";
import React, { useState, useEffect } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Show alert after 5 seconds
      if (!alertShown) {
        setTimeout(() => {
          const install = window.confirm(
            "🎰 Add Roulette Worlds to your home screen for quick access?"
          );

          if (install) {
            e.prompt();
            e.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === "accepted") {
                console.log("User accepted install");
                setIsInstallable(false);
              } else {
                console.log("User dismissed install");
              }
              setDeferredPrompt(null);
            });
          }
          setAlertShown(true);
        }, 5000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [alertShown]);

  const handleManualInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted manual install");
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("Install option not available. Try refreshing the page!");
    }
  };

  // Show manual install button only if installable
  if (!isInstallable) return null;

  return (
    <button onClick={handleManualInstall}>
      <Download className="text-white sm:p-2 p-1" />
    </button>
  );
};

export default InstallPrompt;
