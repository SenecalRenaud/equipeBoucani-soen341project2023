import React, {useEffect, useRef} from 'react';
import { css } from '@emotion/react';
import * as reactSpinners from 'react-spinners'

import './LoadingScreen.css';
import {BounceLoader} from "react-spinners";
import {MouseCursorGradientTracking} from "../../utils/mouseTrackingGradient";


const override = css`
  display: block;
  top: 100px;
  border-color: red;
  position: center;
  padding-top: 100px;
`;

const LoadingScreen = (props) => {
    const mounted = useRef(false);
    //
    useEffect(() => {
        const navbarEl = document.getElementsByClassName("gpt3__navbar")[0];
        mounted.current = true;
        navbarEl.classList.add("hidden");

        return () => {
            navbarEl.classList.remove("hidden")
            mounted.current = false;

        };
    }, []);
    console.log(props.isFetching)


  return ( <>

    <div className="sweet-loading">
      <reactSpinners.BounceLoader color={'#81AFDD'} loading={true} id="spinner" size={120} />
    </div>
      </>
  );
};

export default LoadingScreen;
