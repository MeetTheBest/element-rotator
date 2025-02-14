export const uid = (prefix = "uid") => {
  return `${prefix}_${Math.random().toString(16).substring(2)}`;
};

export const toPrecision = (v: number | string, precision: number = 2) => {
  if (Number.isNaN(+v)) return v;

  return +(+v).toFixed(precision);
};
