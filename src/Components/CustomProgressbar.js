import React, { useContext, useEffect, useState, useRef, isValidElement } from "react";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const CustomProgressbar = (props) => {
    const { children, ...otherProps } = props;

    useEffect(() => {
        console.log(props);
    }, [])

    return (
        <div
            style={{
                minWidth: '400px',
                minHeightx: '400px',
                width: '400px',
                height: '400px',
            }}
        >
            <div style={{ minWidth: '400px', position: 'absolute' }}>
                <CircularProgressbar styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 0.25,

                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    // Text size
                    textSize: '16px',

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 1,

                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',

                    // Colors
                    pathColor: props.color,

                })} {...otherProps} />
            </div>
            <div
                style={{
                    height: '400px',
                    width: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {props.children}
            </div>
        </div>
    )
}

export default CustomProgressbar