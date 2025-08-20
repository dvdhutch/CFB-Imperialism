import React, { useState, useEffect } from 'react';

const quotes = [
  {
    text: "Believe deep down in your heart that you're destined to do great things.",
    author: "Joe Paterno"
  },
  {
    text: "Success without honor is an unseasoned dish; it will satisfy your hunger, but it won't taste good.",
    author: "Joe Paterno"
  },
  {
    text: "Mediocre people don't like high achievers and high achievers don't like mediocre people.",
    author: "Nick Saban"
  },
  {
    text: "What happened yesterday is history. What happens tomorrow is a mystery. What we do today makes a difference.",
    author: "Nick Saban"
  },
  {
    text: "Process guarantees success. A good process produces good results.",
    author: "Nick Saban"
  },
  {
    text: "Winning isn't everything, but it sure beats anything that comes in second.",
    author: "Bear Bryant"
  },
  {
    text: "There's a lot of blood, sweat, and guts between dreams and success.",
    author: "Bear Bryant"
  },
  {
    text: "If I flop, let 'em pan me.",
    author: "Knute Rockne"
  },
  {
    text: "Nothing that comes easy is worth a dime.",
    author: "Woody Hayes"
  }
];

export const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(() => {
    // Select a random quote on component mount
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  useEffect(() => {
    // Hide the loading screen after a short delay
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '24px',
          animation: 'bounce 1s infinite'
        }}
      >
        🏈
      </div>
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '32px'
        }}
      >
        CFB Imperialism
      </div>
      <div
        style={{
          maxWidth: '600px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            fontSize: '18px',
            color: '#374151',
            fontStyle: 'italic',
            lineHeight: '1.5',
            marginBottom: '12px'
          }}
        >
          "{currentQuote.text}"
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '500'
          }}
        >
          — {currentQuote.author}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#6b7280'
        }}
      >
        Loading...
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
};
