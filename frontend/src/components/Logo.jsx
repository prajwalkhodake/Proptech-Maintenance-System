export const LogoSVG = ({ className = "" }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: "100%", height: "100%" }}
  >
    <path
      d="M20 5L5 15L9 35H31L35 15L20 5Z"
      stroke="url(#paint0_linear)"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M14 22L20 16L26 22"
      stroke="url(#paint1_linear)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 16V30"
      stroke="url(#paint2_linear)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="20"
        y1="5"
        x2="20"
        y2="35"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="20"
        y1="16"
        x2="20"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#fde047" />
      </linearGradient>
      <linearGradient
        id="paint2_linear"
        x1="20"
        y1="16"
        x2="20"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#facc15" />
      </linearGradient>
    </defs>
  </svg>
)
