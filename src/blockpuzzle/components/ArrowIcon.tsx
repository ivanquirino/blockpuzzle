interface IconProps {
  className?: string;
}

const ArrowIcon = ({ className }: IconProps) => {
  const classes = `h-[32px] w-[32px] text-white group-active:text-black ${className}`;

  return (
    <svg
      className={classes}
      fill="currentColor"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      enable-background="new 0 0 512 512"
    >
      <polygon points="289.7,341.3 289.7,0 204.3,0 204.3,341.3 33.7,170.7 33.7,298.7 247,512 460.3,298.7 460.3,170.7 " />
    </svg>
  );
};

export default ArrowIcon;
