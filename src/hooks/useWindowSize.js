import { useState, useLayoutEffect } from "react";

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([document.getElementById("innerDiv").offsetWidth, document.getElementById("innerDiv").offsetHeight]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

//https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
