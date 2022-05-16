export function boundaries(data) {
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;

  data.forEach((r) => {
    if (r < min) {
      min = r;
    }
    if (r > max) {
      max = r;
    }
  });

  return [min, max];
}

export function computeXRatio(width, length) {
  return width / length;
}

export function computeYRatio(height, max, min) {
  return (max - min) / height;
}
