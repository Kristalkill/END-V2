Array.prototype.shuffled = function () {
    return this.sort(() => Math.random() - 0.5);
};
export {}