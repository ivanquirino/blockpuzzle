import { useEffect, useRef } from "react";
import { enhancedStore } from "../store";

/**
 * A Music component is needed for lifecycle reasons: stop the music
 * if navigates to another page
 * A <audio /> tag is needed for accessibility reasons
 * @returns
 */
const Music = () => {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const musicRef = ref.current;
    // calling load() on status changes resets the music
    // that's why it was needed to subscribe directly to the store
    musicRef?.load();

    if (musicRef) {
      musicRef.volume = 0.5;
    }

    let unsub: any;

    const onLoadedData = () => {
      unsub = enhancedStore.subscribe((state, prevState) => {
        if (prevState !== state) {
          const status = state.status;

          if (status === "started") {
            musicRef?.play();
          }
          if (status === "paused") {
            musicRef?.pause();
          }
          if (status === "gameover") {
            musicRef?.pause();
            musicRef?.fastSeek(0);
          }
        }
      });
    };

    musicRef?.addEventListener("loadeddata", onLoadedData);

    return () => {
      musicRef?.removeEventListener("loadeddata", onLoadedData);
      unsub();
    };
  }, []);

  return (
    <audio
      ref={ref}
      src="https://raw.githubusercontent.com/ivanquirino/blockpuzzle/main/public/korobeiniki.ogg"
      loop
    />
  );
};

export default Music;
