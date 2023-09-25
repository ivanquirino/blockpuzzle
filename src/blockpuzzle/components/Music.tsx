import { useEffect, useRef } from "react";
import { useGameStore } from "./GameClient";

const Music = () => {
  const status = useGameStore((state) => state.status);
  const isMusicEnabled = useGameStore((state) => state.settings.music);
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const music = musicRef.current;

    if (isMusicEnabled && music) {
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
  }, [status, isMusicEnabled]);

  return (
    <audio ref={musicRef} src="korobeiniki.ogg" loop>
      Korobeiniki theme music
    </audio>
  );
};

export default Music;
