const forceArray = <T>(data?: T | T[]) => {
  if (Array.isArray(data)) return data;
  if (data) return [data];
  return [];
};

export default forceArray;
