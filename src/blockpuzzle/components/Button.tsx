import { ComposeProps } from "./types";

type ButtonProps = ComposeProps & {
  onClick?: () => void;
};

const buttonStyle = `
  border-neutral-300 
  border-solid 
  border-[1px] 
  rounded 
  p-2
  active:bg-neutral-300
  active:text-neutral-900
  hover:underline
`;

const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button className={`${buttonStyle} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
