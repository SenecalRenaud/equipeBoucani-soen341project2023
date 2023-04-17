import React from "react";
import styled from "styled-components";



export const MouseCursorGradientTrackingTag = styled.div`
  & {
  position: relative;
  background: transparent;
  //border-radius: 97%;
  opacity: var(--opacity);  
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  //border: none;
  color: white;
  cursor: pointer;
  outline: none;
  overflow: visible;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #000, #333);
  background-clip: padding-box;
  border-radius: 37px 200px 0px 100px;
  //fill-opacity: 100%;  
  //border-radius: 50% / 10% 50% 10% 50%;
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
  //background: radial-gradient(circle at top, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 50%);
  background: radial-gradient(circle closest-side, pink, transparent);

  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
  opacity: var(--opacity);
}
//&::after {
//  --opacity: 0.0;
//}
&:hover::before {
  --size: 100px;
  --opacity: 1.0;
}
`
let mouseTrackingHandler = (element,event) => {
  let rect = event.target.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  element.style.setProperty('--x', x + 'px');
  element.style.setProperty('--y', y + 'px');
  var w = element.offsetWidth;
  var h = element.offsetHeight;
  var cx = w / 2;
  var cy = h / 2;
  var dx = Math.abs(x - cx);
  var dy = Math.abs(y - cy);
  var maxd = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2));
  var percent = (maxd - Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) / maxd;

  var size = percent * 100;
  // element.style.setProperty('--size', size + "px")
  element.style.setProperty('--opacity', 1-percent)
}
export function MouseCursorGradientTracking({markupContent}) {

  React.useEffect(() => {
    let element = document.getElementById("el24123")
    element.addEventListener('mousemove', mouseTrackingHandler.bind(null,element),true);
    element.addEventListener('mouseleave',
        () => {
          element.style.setProperty('--opacity', 1.0)
        },true)

    // cleanup this component

    return () => {

      element.removeEventListener('mousemove', mouseTrackingHandler.bind(null,element),true);

    };

  }, []);

  return <>

      <MouseCursorGradientTrackingTag id="el24123">
          <span> {markupContent} </span>
      </MouseCursorGradientTrackingTag>

  </>
}