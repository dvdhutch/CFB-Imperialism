import React, { useEffect, useRef, useState } from 'react';

export const BuyMeACoffee: React.FC = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('BuyMeACoffee component mounted');
    
    // We're not using the script-based button anymore, just our custom buttons
    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={buttonRef}
      style={{ 
        display: 'flex',
        justifyContent: 'center',
        minHeight: '40px',
        border: '1px solid #ccc',
        padding: '8px',
        backgroundColor: '#f0f0f0',
        gap: '8px',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <a 
        href="https://www.buymeacoffee.com/hutchinson" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          backgroundColor: '#FFDD00',
          color: '#000000',
          textDecoration: 'none',
          borderRadius: '6px',
          border: '2px solid #000000',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        🏈 Buy me a coffee
      </a>
      <a 
        href="https://x.com/dvdhutch" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          backgroundColor: '#000000',
          color: '#ffffff',
          textDecoration: 'none',
          borderRadius: '6px',
          border: '2px solid #000000',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        𝕏
      </a>
      <a 
        href="https://github.com/dvdhutch/CFB-Imperialism" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          backgroundColor: '#ffffff',
          color: '#000000',
          textDecoration: 'none',
          borderRadius: '6px',
          border: '2px solid #000000',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" 
          alt="GitHub" 
          style={{
            width: '20px',
            height: '20px'
          }}
        />
      </a>
    </div>
  );
};
