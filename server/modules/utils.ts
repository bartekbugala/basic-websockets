export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

export const createPlayerObject = (name: string) => {
  return {
    name,
    health: 100,
    attack: 10,
    defence: 10,
  };
};
