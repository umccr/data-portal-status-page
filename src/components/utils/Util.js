export function toTitle(string) {
  return toKebab(string)
    .split("-")
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function toKebab(string) {
  return string
    .split("_")
    .map((letter, index) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }
      return letter;
    })
    .join("-")
    .trim();
}

export function isJSONObject(val) {
  if (Array.isArray(val)) {
    return false;
  }

  if (val == null) {
    return false;
  }

  if (typeof val == "object") {
    return true;
  }

  return false;
}
