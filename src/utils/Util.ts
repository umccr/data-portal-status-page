export function toTitle(string: string): string {
  return toKebab(string)
    .split('-')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function toKebab(string: string): string {
  return string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

export function isJSONObject(val: any): boolean {
  if (Array.isArray(val)) {
    return false;
  }

  if (val == null) {
    return false;
  }

  return typeof val === 'object';
}
