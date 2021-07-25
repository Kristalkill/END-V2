Boolean.prototype.parse = function (val: string) {
    return !/^(?:f(?:alse)?|no|0+)$/i.test(val) && !!val;
};
export {}