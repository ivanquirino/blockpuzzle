import { useEffect, useRef } from "react";
import { store } from "./GameClient";

const Music = () => {
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const music = musicRef.current;
    if (music) music.volume = 0.3;

    const unsub = store.subscribe((state, prevState) => {
      if (state.settings.music && state.status !== prevState.status) {
        if (music) {
          if (state.status === "started") {
            music.play();
          }
          if (state.status === "paused") {
            music.pause();
          }
          if (state.status === "gameover") {
            music.pause();
            music.currentTime = 0;
          }
        }
      }
    });

    return unsub;
  }, []);

  return (
    <audio ref={musicRef} src="korobeiniki.ogg" loop>
      Korobeiniki theme music
    </audio>
  );
};

export default Music;
