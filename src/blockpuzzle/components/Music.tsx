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
        console.log("play music");
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
    <audio ref={musicRef} src="korobeiniki.ogg">
      Korobeiniki theme music
    </audio>
  );
};

export default Music;
