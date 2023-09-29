import * as Dialog from "@radix-ui/react-dialog";
import { useGameStore } from "./GameClient";
import Controls from "./Controls";
import Links from "./Links";
import { Close, Content, Overlay } from "./Dialog";
import Button from "./Button";
import { useEffect } from "react";

const MenuDialog = () => {
  const open = useGameStore((state) => state.menu);
  const openMenu = useGameStore((state) => state.openMenu);
  const music = useGameStore((state) => state.settings.music);
  const fx = useGameStore((state) => state.settings.fx);
  const toggleMusic = useGameStore((state) => state.toggleMusic);
  const toggleFx = useGameStore((state) => state.toggleFx);

  useEffect(() => {
    const musicStorage = localStorage.getItem("music");
    const fxStorage = localStorage.getItem("fx");

    if (musicStorage === "false") {
      toggleMusic(false);
    }
    if (fxStorage === "false") {
      toggleFx(false);
    }
  }, [toggleFx, toggleMusic]);

  useEffect(() => {
    localStorage.setItem("music", music.toString());
    localStorage.setItem("fx", fx.toString());
  }, [music, fx]);

  const handleClick = () => {
    openMenu(!open);
  };

  const buttonStatus = (on: boolean) => (on ? "On" : "Off");

  return (
    <Dialog.Root open={open} modal onOpenChange={handleClick}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <div className="h-full">
            <div className="mb-4 flex justify-between">
              <div>
                <Button className="first:mr-4" onClick={toggleMusic}>
                  Music {buttonStatus(music)}
                </Button>
                <Button onClick={toggleFx}>Sound FX {buttonStatus(fx)}</Button>
              </div>
              <Close>Close</Close>
            </div>

            <Controls />
            <Links />

            <h2 className="text-lg mb-4">Have fun!</h2>
            <p>&copy; Copyright 2023 Ivan Quirino</p>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MenuDialog;
