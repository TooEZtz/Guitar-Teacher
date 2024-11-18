import React from 'react';
import Spline from '@splinetool/react-spline';

const UI = () => {
    return (
        <div className='cursor-pointer bg-black w-full h-10'>
            <Spline scene="https://prod.spline.design/kg7xjcgd-Uipck1H/scene.splinecode" className='absolute w-full h-[100vh] -z-10 mt-10' />
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 pt-10'>
                <h1 className='text-[5rem] text-white font-extrabold font-main text-center'>Blind Melodies</h1>

            </div>
        </div>
    );
};

export default UI;
