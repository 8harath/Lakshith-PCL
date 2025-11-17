import React from 'react';

// Animated Plant Leaf Component
export const PlantLeaf = ({ className = '', style = {} }) => {
  return (
    <svg
      className={`plant-leaf ${className}`}
      style={{
        animation: 'float 6s ease-in-out infinite',
        ...style
      }}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 20C60 20 40 40 40 65C40 85 55 100 60 100C65 100 80 85 80 65C80 40 60 20 60 20Z"
        fill="url(#leafGradient)"
        opacity="0.7"
      />
      <path
        d="M60 20 L60 100"
        stroke="#2d6a4f"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#52b788" />
          <stop offset="100%" stopColor="#2d6a4f" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Animated Tree Component
export const Tree = ({ className = '', style = {} }) => {
  return (
    <svg
      className={`tree ${className}`}
      style={{
        animation: 'sway 8s ease-in-out infinite',
        ...style
      }}
      width="150"
      height="200"
      viewBox="0 0 150 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trunk */}
      <rect
        x="65"
        y="120"
        width="20"
        height="80"
        fill="#8b4513"
        rx="4"
      />

      {/* Foliage - Bottom Layer */}
      <ellipse
        cx="75"
        cy="110"
        rx="45"
        ry="40"
        fill="url(#treeGradient1)"
        opacity="0.8"
      />

      {/* Foliage - Middle Layer */}
      <ellipse
        cx="75"
        cy="80"
        rx="40"
        ry="35"
        fill="url(#treeGradient2)"
        opacity="0.9"
      />

      {/* Foliage - Top Layer */}
      <ellipse
        cx="75"
        cy="55"
        rx="30"
        ry="30"
        fill="url(#treeGradient3)"
      />

      <defs>
        <linearGradient id="treeGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#95d5b2" />
          <stop offset="100%" stopColor="#52b788" />
        </linearGradient>
        <linearGradient id="treeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#74c69d" />
          <stop offset="100%" stopColor="#40916c" />
        </linearGradient>
        <linearGradient id="treeGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#95d5b2" />
          <stop offset="100%" stopColor="#52b788" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Animated Sprout Component
export const Sprout = ({ className = '', style = {} }) => {
  return (
    <svg
      className={`sprout ${className}`}
      style={{
        animation: 'grow 4s ease-in-out infinite',
        ...style
      }}
      width="80"
      height="100"
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M40 100 Q35 60 40 40"
        stroke="#40916c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left Leaf */}
      <path
        d="M40 50 Q20 50 15 35 Q20 40 40 45"
        fill="url(#sproutGradient)"
        opacity="0.8"
      />

      {/* Right Leaf */}
      <path
        d="M40 45 Q60 45 65 30 Q60 35 40 40"
        fill="url(#sproutGradient)"
        opacity="0.8"
      />

      {/* Top Leaves */}
      <ellipse
        cx="35"
        cy="35"
        rx="12"
        ry="15"
        fill="url(#sproutGradient)"
        transform="rotate(-20 35 35)"
      />
      <ellipse
        cx="45"
        cy="32"
        rx="12"
        ry="15"
        fill="url(#sproutGradient)"
        transform="rotate(20 45 32)"
      />

      <defs>
        <linearGradient id="sproutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#95d5b2" />
          <stop offset="100%" stopColor="#40916c" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Wheat Stalk Component
export const WheatStalk = ({ className = '', style = {} }) => {
  return (
    <svg
      className={`wheat-stalk ${className}`}
      style={{
        animation: 'float 5s ease-in-out infinite',
        ...style
      }}
      width="60"
      height="150"
      viewBox="0 0 60 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <path
        d="M30 140 Q28 100 30 50 Q32 20 30 10"
        stroke="#b8860b"
        strokeWidth="2"
        fill="none"
      />

      {/* Grains */}
      {[10, 20, 30, 40, 50, 60, 70, 80].map((y, i) => (
        <g key={i}>
          <ellipse
            cx="30"
            cy={y}
            rx="8"
            ry="12"
            fill="#daa520"
            opacity="0.9"
          />
          <ellipse
            cx="22"
            cy={y + 8}
            rx="7"
            ry="10"
            fill="#daa520"
            opacity="0.8"
          />
          <ellipse
            cx="38"
            cy={y + 8}
            rx="7"
            ry="10"
            fill="#daa520"
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  );
};

// Flower Component
export const Flower = ({ className = '', style = {} }) => {
  return (
    <svg
      className={`flower ${className}`}
      style={{
        animation: 'bloom 6s ease-in-out infinite',
        ...style
      }}
      width="100"
      height="120"
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M50 120 Q45 80 50 60"
        stroke="#40916c"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaf */}
      <path
        d="M48 85 Q30 85 25 75 Q30 80 48 83"
        fill="#52b788"
        opacity="0.7"
      />

      {/* Center */}
      <circle cx="50" cy="50" r="8" fill="#fbbf24" />

      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 15;
        const y = 50 + Math.sin(rad) * 15;

        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="10"
            ry="15"
            fill="url(#petalGradient)"
            transform={`rotate(${angle} ${x} ${y})`}
            opacity="0.9"
          />
        );
      })}

      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Add CSS animations
const animations = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }

  @keyframes sway {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(2deg);
    }
    75% {
      transform: rotate(-2deg);
    }
  }

  @keyframes grow {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes bloom {
    0%, 100% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.15) rotate(10deg);
    }
  }
`;

// Inject animations into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = animations;
  document.head.appendChild(styleSheet);
}

export default { PlantLeaf, Tree, Sprout, WheatStalk, Flower };
