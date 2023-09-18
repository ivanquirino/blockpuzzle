import { useEffect, useRef } from "react";
import { idleInput } from "../constants";
import { useGameStore } from "../store";
import { KeyboardInput } from "../types";

const buttonStyle =
  "border-white border-[1px] rounded aspect-square text-center align-middle w-[64px] first:mr-3 flex justify-center items-center text-[32px] active:bg-white active:text-black transition select-none";

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
    if (isMobile()) {
      const leftC = leftRef?.current;
      const rightC = rightRef?.current;
      const upC = upRef?.current;
      const downC = downRef?.current;

      const handler = (inputObj: KeyboardInput) => {
        let interval: any;

        return {
          start: () => {
            interval = setInterval(() => input(inputObj), 100);
          },
          end: () => {
            clearInterval(interval);
          },
        };
      };

      const left = handler({ ...idleInput, left: true });
      const right = handler({ ...idleInput, right: true });
      const up = handler({ ...idleInput, up: true });
      const down = handler({ ...idleInput, down: true });

      leftC?.addEventListener("touchstart", left.start);
      rightC?.addEventListener("touchstart", right.start);
      upC?.addEventListener("touchstart", up.start);
      downC?.addEventListener("touchstart", down.start);

      leftC?.addEventListener("touchend", left.end);
      rightC?.addEventListener("touchend", right.end);
      upC?.addEventListener("touchend", up.end);
      downC?.addEventListener("touchend", down.end);

      return () => {
        leftC?.removeEventListener("touchstart", left.start);
        rightC?.removeEventListener("touchstart", right.start);
        upC?.removeEventListener("touchstart", up.start);
        downC?.removeEventListener("touchstart", down.start);

        leftC?.removeEventListener("touchend", left.end);
        rightC?.removeEventListener("touchend", right.end);
        upC?.removeEventListener("touchend", up.end);
        downC?.removeEventListener("touchend", down.end);
      };
    }

    return () => {};
  }, [input]);

  const handleClick = (inputObj: KeyboardInput) => () => {
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
