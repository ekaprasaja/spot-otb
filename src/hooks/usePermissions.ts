"use client";

import { useState, useCallback } from 'react';

export type PermissionType = 'camera' | 'sensors';

export const usePermissions = () => {
  const [status, setStatus] = useState<{ [key in PermissionType]: 'prompt' | 'granted' | 'denied' }>({
    camera: 'prompt',
    sensors: 'prompt',
  });

  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setStatus(prev => ({ ...prev, camera: 'granted' }));
      return true;
    } catch (err) {
      console.error("Camera permission denied:", err);
      setStatus(prev => ({ ...prev, camera: 'denied' }));
      return false;
    }
  }, []);

  const requestSensors = useCallback(async () => {
    // Check for iOS 13+ requirement
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setStatus(prev => ({ ...prev, sensors: 'granted' }));
          return true;
        } else {
          setStatus(prev => ({ ...prev, sensors: 'denied' }));
          return false;
        }
      } catch (err) {
        console.error("Sensor permission denied:", err);
        setStatus(prev => ({ ...prev, sensors: 'denied' }));
        return false;
      }
    } else {
      // Non-iOS or older versions usually grant by default on HTTPS
      setStatus(prev => ({ ...prev, sensors: 'granted' }));
      return true;
    }
  }, []);

  return {
    status,
    requestCamera,
    requestSensors,
  };
};
