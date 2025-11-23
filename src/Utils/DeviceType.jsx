import { useState, useEffect } from "react";

export const useDeviceType = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const touch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
  }, []);
  return isTouch ? "touch" : "keyboard";
};
