import React from 'react';
import Spline from '@splinetool/react-spline';

const UI = () => {
    return (
        <div>
            <Spline scene="https://prod.spline.design/kg7xjcgd-Uipck1H/scene.splinecode" className='absolute w-full h-[100vh] -z-10' />
            <div className='absolute z-2  bg-transparent ring-red-200 ring-8 bottom-[10%]'>


            </div>
        </div>
    );
};

export default UI;
