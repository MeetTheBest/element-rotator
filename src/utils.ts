export const uid = () => {
  return `ID_${Math.floor(Math.random() * 100)}`;
};

export const toPrecision = (v: number | string, precision: number = 2) => {
  if (Number.isNaN(+v)) return v;

  return +(+v).toFixed(precision);
};
