import React from "react";

const NavbarLogo = () => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00B8FF" />
          <stop offset="100%" stopColor="#00FFC6" />
        </linearGradient>
      </defs>
      {/* Hexagon background */}
      <polygon
        points="50,8 88,28 88,72 50,92 12,72 12,28"
        fill="url(#logoGradient)"
        stroke="#fff"
        strokeWidth="3"
      />
      {/* Vault/Lock element: a small circle with a keyhole shape */}
      <circle cx="50" cy="40" r="6" fill="#121212" />
      <path
        d="M50,37 a1,1 0 0,1 0,6"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* "TV" Text inside the hexagon */}
      <text
        x="50%"
        y="80%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Roboto', sans-serif"
        fontSize="16"
        fill="#121212"
        fontWeight="bold"
      >
        TV
      </text>
    </svg>
  );
};

export default NavbarLogo;
