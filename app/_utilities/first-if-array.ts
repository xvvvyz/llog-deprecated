const firstIfArray = <T>(data: T[] | T): T =>
  Array.isArray(data) ? data[0] : data;

export default firstIfArray;
