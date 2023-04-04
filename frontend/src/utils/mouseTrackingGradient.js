import React from "react";
import styled from "styled-components";


export const MouseCursorGradientTrackingTag = styled.div`
  & {
  position: relative;
  background: transparent;
  //border-radius: 97%;
    
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border: none;
    
  color: white;
  cursor: pointer;
  outline: none;
  overflow: hidden;
}

& span {
  position: relative;
  
}

&::before {
  --size: 0;
  content: '';
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle closest-side, pink, transparent);
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease;
}

&:hover::before {
  --size: 200px;
}
`
let mouseTrackingHandler = (element,event) => {
  let rect = event.target.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  element.style.setProperty('--x', x + 'px');
  element.style.setProperty('--y', y + 'px');
}
export function MouseCursorGradientTracking({markupContent}) {

  React.useEffect(() => {
    let element = document.getElementById("el24123")
    element.addEventListener('mousemove', mouseTrackingHandler.bind(null,element),true);


    // cleanup this component

    return () => {

      element.removeEventListener('mousemove', mouseTrackingHandler.bind(null,element),true);

    };

  }, []);

  return <>
      <MouseCursorGradientTrackingTag id="el24123">
          <span> {markupContent}</span>
      </MouseCursorGradientTrackingTag>
  </>
}
