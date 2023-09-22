import { initSounds } from "./sounds";

const callbacks = () => {
  const sounds = initSounds();

  return {
    onGameOver: () => {
      sounds?.gameOver();
      sounds?.music.pause();
      sounds?.music.reset()
    },
    onMove: () => {
      sounds?.move();
    },
    onRotate: () => {
      sounds?.rotate();
    },
    onClear: () => {
      sounds?.single();
    },
    onLevelUp: () => {
      sounds?.levelUp();
    },
    onLanding: () => {
      sounds?.landing();
    },
    onFall: () => {
      sounds?.fall();
    },
    onStart: () => {
      sounds?.music.play();
    },
    onPause: () => {
      sounds?.music.pause();
    },
  };
};

export default callbacks;
