import { useState, useEffect } from 'react';

export const useDetectOutClickOrEsc = (elementRef, initialState) => {
  const [isToggled, setIsToggled] = useState(initialState);

  useEffect(() => {
    const pageOrLinkClickEvent = (event) => {

      if (event.target.tagName === 'A' ||
          (elementRef.current !== null && !elementRef.current.contains(event.target))) {
        setIsToggled(!isToggled);
      }
    };
    const escapePressEvent = (event) => {
      if (event.key === "Escape") {
        setIsToggled(!isToggled);
      }
    };

    if (isToggled) {
      window.addEventListener('click', pageOrLinkClickEvent,true); //capturing phase. Events will get to this handler before getting to its children.
      window.addEventListener('keydown', escapePressEvent,true);
    }


    return () => {
      window.removeEventListener('click', pageOrLinkClickEvent,true); //capturing phase. Events will get to this handler before getting to its children.
      window.removeEventListener('keydown', escapePressEvent,true);
    }

  }, [isToggled, elementRef]);
  return [isToggled, setIsToggled];
}