import { useEffect, useRef } from "react";
import { useGameStore } from "./GameClient";

const Music = () => {
  const status = useGameStore((state) => state.status);
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const music = musicRef.current;

    if (music) {
      music.volume = 0.3;

      if (status === "started") {
        music.play();
      }
      if (status === "paused") {
        music.pause();
      }
      if (status === "gameover") {
        music.pause();
        music.currentTime = 0;
      }
    }
  }, [status]);

  return (
    <audio ref={musicRef} src="korobeiniki.ogg" loop>
      Korobeiniki theme music
    </audio>
  );
};

export default Music;
