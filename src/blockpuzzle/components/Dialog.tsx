import * as Dialog from "@radix-ui/react-dialog";
import { ComposeProps } from "./types";
import { forwardRef } from "react";

const overlayStyle = `
  fixed 
  inset-0 
  flex 
  justify-center 
  items-center 
  w-full 
  bg-black 
  opacity-70
  z-40
`;

export const Overlay = forwardRef(function Overlay(_, ref: any) {
  return <Dialog.Overlay ref={ref} className={overlayStyle} />;
});

const dialogStyle = `
  z-50 
  bg-neutral-900 
  w-[90%]
  sm:w-[80%]
  md:w-[70%]
  lg:w-[60%]
  xl:w-[50%]
  2xl:w-[30%]
  h-[50%] 
  fixed 
  top-[50%] 
  left-[50%]  
  translate-x-[-50%] 
  translate-y-[-50%] 
  border-neutral-200
  border-[1px]
  rounded
  p-4
`;

export const Content = forwardRef(function Content(
  { children }: ComposeProps,
  ref: any
) {
  return (
    <Dialog.Content ref={ref} className={dialogStyle}>
      {children}
    </Dialog.Content>
  );
});

const closeStyle = `
  border-neutral-300 
  border-solid 
  border-[1px] 
  rounded 
  p-2
  active:bg-neutral-300
  active:text-neutral-900
  hover:underline
`;

export const Close = ({ children, className }: ComposeProps) => {
  return (
    <Dialog.Close className={`outline-none ${closeStyle} ${className}`}>
      {children}
    </Dialog.Close>
  );
};
