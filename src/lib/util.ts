export function convertToYMD(time: Date): [number, number, number] {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  return [year, month, day];
}
