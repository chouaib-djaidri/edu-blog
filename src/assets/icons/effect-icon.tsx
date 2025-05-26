import { SVGProps } from "react";

const EffectIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M48 24C28.3636 24 23.9999 19.6361 24 0C23.9999 19.6361 19.6364 24 0 24C19.6364 24 24 28.3636 24 48C24 28.3634 28.3637 24 48 24Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default EffectIcon;
