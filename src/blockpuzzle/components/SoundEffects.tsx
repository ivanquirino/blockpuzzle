import { useEffect, useRef } from "react";
import { store } from "./GameClient";
import React from "react";

const SoundEffects = () => {
  const sounds = useRef({
    rotate: useRef<HTMLAudioElement>(null),
    move: useRef<HTMLAudioElement>(null),
    clear: useRef<HTMLAudioElement>(null),
    lvup: useRef<HTMLAudioElement>(null),
    landing: useRef<HTMLAudioElement>(null),
    drop: useRef<HTMLAudioElement>(null),
    gameover: useRef<HTMLAudioElement>(null),
  });

  useEffect(() => {
    const unsub = store.subscribe((state, prevState) => {
      if (state.status !== prevState.status && state.status === "gameover") {
        sounds.current.gameover.current?.play();
      }

      if (
        state.sound !== prevState.sound &&
        state.settings.fx &&
        state.status === "started" &&
        state.sound.fx !== "noop"
      ) {
        const soundFx = sounds.current[state.sound.fx]?.current;

        if (soundFx) {
          soundFx.currentTime = 0;
          soundFx.play();
          state.noopSound();
        }
      }
    });

    return unsub;
  }, []);

  return (
    <>
      <audio ref={sounds.current.rotate} src="rotate.ogg">
        Rotate sound Effect
      </audio>
      <audio ref={sounds.current.move} src="move.wav">
        Move sound Effect
      </audio>
      <audio ref={sounds.current.clear} src="clear.ogg">
        Clear sound Effect
      </audio>
      <audio ref={sounds.current.lvup} src="lvup.ogg">
        LevelUp sound Effect
      </audio>
      <audio ref={sounds.current.landing} src="landing.ogg">
        Landing sound Effect
      </audio>
      <audio ref={sounds.current.drop} src="drop.ogg">
        Drop sound Effect
      </audio>
      <audio ref={sounds.current.gameover} src="gameover.ogg">
        Game over sound Effect
      </audio>
    </>
  );
};

export default React.memo(SoundEffects);
