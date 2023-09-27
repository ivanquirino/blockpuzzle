import { MouseEvent, useEffect, useRef } from "react";
import { acceptedKeys, idleInput } from "../constants";
import { useGameStore } from "./GameClient";
import { GameInput } from "../types";
import ArrowIcon from "./ArrowIcon";
import { timeout } from "../tools";
import RotateIcon from "./RotateIcon";
import React from "react";

const buttonStyle = `border-white 
  border-[1px] 
  rounded 
  aspect-square 
  text-center
  align-middle 
  w-[64px] 
  first:mr-3 
  flex 
  justify-center 
  items-center 
  text-[32px] 
  active:bg-neutral-300 
  active:text-neutral-900 
  select-none 
  group`;

const isMobile = () => {
  return navigator.userAgent.match(/mobile|iphone|android|ipad/i);
};

const Gamepad = () => {
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const upRef = useRef<HTMLButtonElement>(null);
  const downRef = useRef<HTMLButtonElement>(null);

  const input = useGameStore((state) => state.input);

  useEffect(() => {
    const handleKeyboardDown = (event: KeyboardEvent) => {
      if (!acceptedKeys.includes(event.key)) {
        return;
      }

      const inputObj = { ...idleInput };

      if (event.key === "ArrowDown") {
        inputObj.down = true;
      }
      if (event.key === "ArrowLeft") {
        inputObj.left = true;
      }
      if (event.key === "ArrowRight") {
        inputObj.right = true;
      }
      if (event.key === "ArrowUp") {
        inputObj.up = true;
      }
      if (event.key === "Enter") {
        inputObj.start = true;
      }

      input(inputObj);
    };

    window.addEventListener("keydown", handleKeyboardDown);

    const leftC = leftRef?.current;
    const rightC = rightRef?.current;
    const upC = upRef?.current;
    const downC = downRef?.current;

    const inputLimiter = () => {
      let isPressed = false;
      let timeoutid: any;

      return {
        start: async (inputObj: GameInput) => {
          isPressed = true;

          while (isPressed) {
            input(inputObj);

            const {timeoutId: t , promise } = timeout(50);
            timeoutid = t;
            await promise;
          }
        },
        end: () => {
          isPressed = false;
          clearTimeout(timeoutid);8
        },
      };
    };

    const limiter = inputLimiter();

    const left = () => limiter.start({ ...idleInput, left: true });
    const right = () => limiter.start({ ...idleInput, right: true });
    const up = () => limiter.start({ ...idleInput, up: true });
    const down = () => limiter.start({ ...idleInput, down: true });

    leftC?.addEventListener("touchstart", left);
    rightC?.addEventListener("touchstart", right);
    downC?.addEventListener("touchstart", down);

    leftC?.addEventListener("touchend", limiter.end);
    rightC?.addEventListener("touchend", limiter.end);
    downC?.addEventListener("touchend", limiter.end);

    return () => {
      window.removeEventListener("keydown", handleKeyboardDown);

      leftC?.removeEventListener("touchstart", left);
      rightC?.removeEventListener("touchstart", right);
      downC?.removeEventListener("touchstart", down);

      leftC?.removeEventListener("touchend", limiter.end);
      rightC?.removeEventListener("touchend", limiter.end);
      downC?.removeEventListener("touchend", limiter.end);
    };
  }, [input]);

  const handleClick = (inputObj: GameInput) => (event: MouseEvent) => {
    event.stopPropagation();

    if (isMobile() && inputObj.up) {
      input(inputObj);
    }

    if (isMobile()) return;

    input(inputObj);
  };

  const leftClick = handleClick({ ...idleInput, left: true });
  const rightClick = handleClick({ ...idleInput, right: true });
  const upClick = handleClick({ ...idleInput, up: true });
  const downClick = handleClick({ ...idleInput, down: true });

  return (
    <div className="flex justify-between w-full mt-2 absolute -bottom-[80px]">
      <div className="flex">
        <button ref={leftRef} className={buttonStyle} onClick={leftClick}>
          <ArrowIcon className="rotate-90" />
        </button>
        <button ref={rightRef} className={buttonStyle} onClick={rightClick}>
          <ArrowIcon className="-rotate-90" />
        </button>
      </div>
      <div className="flex">
        <button ref={upRef} className={buttonStyle} onClick={upClick}>
          <RotateIcon />
        </button>
        <button ref={downRef} className={buttonStyle} onClick={downClick}>
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Gamepad);
