export const timeout = (ms = 0) => {
  let timeoutId: any;

  const promise = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, ms);
  });
  
  return { timeoutId, promise };
};
