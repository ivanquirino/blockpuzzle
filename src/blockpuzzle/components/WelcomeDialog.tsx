"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import Controls from "./Controls";
import Links from "./Links";
import { Overlay, Content, Close } from "./Dialog";

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openDialog = localStorage.getItem("welcome") !== "true";
    setOpen(openDialog);
  }, []);

  const handleClick = () => {
    localStorage.setItem("welcome", "true");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} modal onOpenChange={handleClick}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <div className="relative h-full">
            <Dialog.Title className="text-center mb-4 text-lg">
              Welcome!
            </Dialog.Title>
            <Dialog.Description className="text-sm mb-4">
              This is a simple clone of a famous game I did for fun and to showcase my
              programming skills. As the pieces fall one by one, fill rows to
              clear them and earn score.
            </Dialog.Description>
            <Controls />
            <Links />
            <h2 className="text-lg">Have fun!</h2>
            <Close className="absolute right-0 bottom-0">Got it!</Close>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WelcomeDialog;
