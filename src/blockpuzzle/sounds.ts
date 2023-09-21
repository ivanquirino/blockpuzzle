export const initSounds = () => {
  if (typeof window === "undefined") {
    return;
  }

  const context = new AudioContext();

  const rotate = new Audio("/rotate.ogg");
  const rotateTrack = context.createMediaElementSource(rotate);
  rotateTrack.connect(context.destination);

  const move = new Audio("/move.wav");
  const moveTrack = context.createMediaElementSource(move);
  moveTrack.connect(context.destination);

  const single = new Audio("/single.ogg");
  const singleTrack = context.createMediaElementSource(single);
  singleTrack.connect(context.destination);

  const levelUp = new Audio("lvup.ogg");
  const lvupTrack = context.createMediaElementSource(levelUp);
  lvupTrack.connect(context.destination);

  const gameover = new Audio("tetris.ogg");
  gameover.load();
  const gameoverTrack = context.createMediaElementSource(gameover);
  gameoverTrack.connect(context.destination);

  const landing = new Audio("/landing.ogg");
  const landingTrack = context.createMediaElementSource(landing);
  landingTrack.connect(context.destination);

  const fall = new Audio("/bfall.ogg");
  const fallTrack = context.createMediaElementSource(fall);
  fallTrack.connect(context.destination);

  const music = new Audio(
    "korobeiniki.ogg"
    // "https://raw.githubusercontent.com/ivanquirino/blockpuzzle/main/public/korobeiniki.ogg"
  );
  music.volume = 0.3;
  music.loop = true;
  const musicTrack = context.createMediaElementSource(music);
  musicTrack.connect(context.destination);

  const sounds = {
    context,
    rotate: () => {
      rotate.currentTime = 0;
      rotate.play();
    },
    move: () => {
      move.currentTime = 0;
      move.play();
    },
    single: () => {
      single.currentTime = 0;
      single.play();
    },
    levelUp: () => {
      levelUp.currentTime = 0;
      levelUp.play();
    },
    gameOver: () => {
      gameover.currentTime = 0;
      gameover.play();
    },

    landing: () => {
      landing.currentTime = 0;
      landing.play();
    },
    fall: () => {
      fall.currentTime = 0;
      fall.play();
    },

    music: {
      play: () => {
        context.resume();
        music.play();
      },
      pause: () => music.pause(),
      reset: () => {
        music.currentTime = 0;
      },
    },
  };

  return sounds;
};
