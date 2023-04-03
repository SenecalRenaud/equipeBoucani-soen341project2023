import React from 'react';
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
    // console.log(props.isFetching)
  return ( <>

    <div className="sweet-loading">
      <reactSpinners.BounceLoader color={'#36D7B7'} loading={true} id="spinner" size={100} />
    </div>
      </>
  );
};

export default LoadingScreen;
