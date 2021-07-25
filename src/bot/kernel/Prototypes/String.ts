String.prototype.clear = function (this: string) {
  return this.normalize('NFD')
    .replace(
      /[^\p{Letter}\p{Number}]/gu, // \p{Emoji_Modifier_Base}\p{Emoji_Modifier}\p{Emoji_Presentation}\p{Emoji}\uFE0F <>:
      ''
    )
    // .capitalize();
}
String.prototype.capitalize = function (this: string) {
  return this.replace(/^./, (match) => match.toUpperCase())
}
String.prototype.chunk = function (this: string, len: number) {
  const arr = this.split(/(?=\n)/g)
  const result = []
  for (const line of arr) {
    if (result.length === 0 || result[result.length - 1].length + line.length > len) {
      result.push(line)
    } else {
      result[result.length - 1] += line
    }
  }
  return result
}
String.prototype.translate = function (vars) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let str = this
  for (const [KEY, value] of Object.entries(vars)) {
    str = str.replace(new RegExp(`%${KEY}%`, 'g'), value)
  }
  return str
}
export {}
