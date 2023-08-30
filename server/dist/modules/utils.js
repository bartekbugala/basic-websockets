"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayerObject = exports.getRandomInt = void 0;
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};
exports.getRandomInt = getRandomInt;
const createPlayerObject = (name) => {
    return {
        name,
        health: 100,
        attack: 10,
        defence: 10,
    };
};
exports.createPlayerObject = createPlayerObject;
