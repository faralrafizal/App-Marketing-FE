import React, { useState, useEffect } from 'react';

export default function SwitcherDarkLight() {
  const [darkMode, setDarkMode] = useState(false);
  const stateLightText = 'ライトモード';
  const stateDarkText = 'ダークモード';

  const handleDarkmodeOff = () => {
    setDarkMode(false);
    localStorage.setItem('prefers_color_scheme_set', 'light');
  };

  const handleDarkmodeOn = () => {
    setDarkMode(true);
    localStorage.setItem('prefers_color_scheme_set', 'dark');
  };

  useEffect(() => {
    const localDarkMode = localStorage.getItem('prefers_color_scheme_set');
    // const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // console.log(prefersDarkMode, "=====");
    // console.log(localDarkMode, "=====");

    setDarkMode(localDarkMode == 'dark');
  }, []);

  return (
    <div className={`flex h-7 w-14 rounded-full bg-white ${darkMode ? '!bg-gray-900' : ''}`}>
      <span className="sr-only">現在のモード：<span id="darkmode-state">{darkMode ? stateDarkText : stateLightText}</span></span>
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center h-6 w-6">
          <button
            type="button"
            id="handle-darkmode-off"
            className={`flex justify-center items-center h-6 w-6 rounded-full bg-yellow-300 text-gray-900 ${
              darkMode == false ?  '' : 'switcher-animation !bg-transparent !text-gray-200'
            }`}
            onClick={handleDarkmodeOff}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span className="sr-only">ライトモードに切り替える</span>
          </button>
        </div>
        <div className="flex justify-center items-center h-6 w-6">
          <button
            type="button"
            id="handle-darkmode-on"
            className={`flex justify-center items-center h-6 w-6 rounded-full bg-transparent text-gray-900 ${
              darkMode == false ?  '' : 'switcher-animation !bg-white !text-gray-900'
            }`}
            onClick={handleDarkmodeOn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              ></path>
            </svg>
            <span className="sr-only">ダークモードに切り替える</span>
          </button>
        </div>
      </div>
    </div>
  );
}
