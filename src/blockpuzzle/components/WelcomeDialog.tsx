"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

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

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openDialog = localStorage.getItem("welcome") !== "true";
    setOpen(true);
  }, []);

  const handleClick = () => {
    localStorage.setItem("welcome", "true");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} modal onOpenChange={handleClick}>
      {/* <Dialog.Trigger /> */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 flex justify-center items-center w-full bg-black opacity-70" />
        <Dialog.Content className={dialogStyle}>
          <div className="relative h-full">
            <Dialog.Title className="text-center mb-4 text-lg">
              Welcome!
            </Dialog.Title>
            <Dialog.Description className="text-sm mb-4">
              This is a clone of a famous game I did for fun and to showcase my
              programming skills. As the pieces fall one by one, fill rows to
              clear them and earn score points.
            </Dialog.Description>
            <div className="text-sm mb-6">
              <p className="mb-2">Controls:</p>
              <ul>
                <li>Enter: start/pause game</li>
                <li>Arrow Left: move piece left</li>
                <li>Arrow Right: move piece right</li>
                <li>Arrow Down: drop pieces</li>
                <li>Arrow Up: rotate piece clockwise</li>
              </ul>
            </div>
            <div className="mb-6">
              <ul>
                <li>
                  <a
                    href="https://www.linkedin.com/in/ivanquirino/"
                    className="hover:underline"
                  >
                    My Linkedin Profile
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ivanquirino/blockpuzzle"
                    className="hover:underline"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
            <h2 className="text-log">Have fun!</h2>
            <Dialog.Close className="border-neutral-300 border-solid border-[1px] rounded p-2 absolute bottom-0 right-0 hover:bg-white">
              Got it!
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WelcomeDialog;
