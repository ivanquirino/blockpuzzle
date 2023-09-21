import { useCallback, useEffect, useRef } from "react";
import { acceptedKeys, idleInput } from "../constants";
import { useGameStore } from "./GameClient";
import { GameInput } from "../types";
import { clearInterval } from "timers";
import { timeout } from "../tools";

const buttonStyle =
  "border-white border-[1px] rounded aspect-square text-center align-middle w-[64px] first:mr-3 flex justify-center items-center text-[32px] active:bg-white active:text-black select-none";

const isMobile = () => {
  return navigator.userAgent.match(/mobile|iphone|android|ipad/i);
  500;
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

      return {
        start: async (inputObj: GameInput) => {
          isPressed = true;

          while (isPressed) {
            input(inputObj);

            await timeout(33);
          }
        },
        end: () => {
          isPressed = false;
          input(idleInput);
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

  const handleClick = (inputObj: GameInput) => () => {
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
    <div className="flex justify-between w-full mt-2">
      <div className="flex">
        <button ref={leftRef} className={buttonStyle} onClick={leftClick}>
          &lsaquo;
        </button>
        <button ref={rightRef} className={buttonStyle} onClick={rightClick}>
          &rsaquo;
        </button>
      </div>
      <div className="flex">
        <button ref={upRef} className={buttonStyle} onClick={upClick}>
          &#x27F3;
        </button>
        <button ref={downRef} className={buttonStyle} onClick={downClick}>
          &#x2304;
        </button>
      </div>
    </div>
  );
};

export default Gamepad;
