import { useState, useEffect } from 'react';

export const useDetectOutClickOrEsc = (elementRef, initialState) => {
  const [isToggled, setIsToggled] = useState(initialState);

  useEffect(() => {
    const pageClickEvent = (event) => {
      if (elementRef.current !== null && !elementRef.current.contains(event.target)) {
        setIsToggled(!isToggled);
      }
    };

    if (isToggled) {
      window.addEventListener('click', pageClickEvent,true); //capturing phase. Events will get to this handler before getting to its children.
    }

    return () => {
      window.removeEventListener('click', pageClickEvent,true); //capturing phase. Events will get to this handler before getting to its children.
    }

  }, [isToggled, elementRef]);
  return [isToggled, setIsToggled];
}