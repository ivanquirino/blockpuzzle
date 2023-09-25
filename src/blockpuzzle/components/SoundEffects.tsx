import { useEffect, useRef } from "react";
import { useGameStore } from "./GameClient";

const SoundEffects = () => {
  const sound = useGameStore((state) => state.sound);
  const status = useGameStore((state) => state.status);
  const noopSound = useGameStore((state) => state.noopSound);
  const isFxEnabled = useGameStore((state) => state.settings.fx);

  const sounds = useRef({
    rotate: useRef<HTMLAudioElement>(null),
    move: useRef<HTMLAudioElement>(null),
    clear: useRef<HTMLAudioElement>(null),
    lvup: useRef<HTMLAudioElement>(null),
    landing: useRef<HTMLAudioElement>(null),
    drop: useRef<HTMLAudioElement>(null),
    gameover: useRef<HTMLAudioElement>(null),
    noop: null,
  });

  useEffect(() => {
    const soundFx = sounds.current[sound.fx]?.current;

    if (isFxEnabled && soundFx && status === "started") {
      soundFx.currentTime = 0;
      soundFx.play();
      noopSound();
    }
  }, [sound, status, noopSound, isFxEnabled]);

  useEffect(() => {
    if (status === "gameover") {
      sounds.current.gameover.current?.play();
    }
  }, [status]);

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

export default SoundEffects;
