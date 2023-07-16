const dotsToParens = (arr: string[]) => {
  const map: any = {};

  arr.forEach(function (item: any) {
    const split = item.split('.');
    let last = map;

    for (let i = 0; i < split.length; i++) {
      if (!last[split[i]]) last[split[i]] = {};
      last = last[split[i]];
    }
  });

  const recurse = (obj: any): string => {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '';

    return keys
      .map(function (key) {
        if (Object.keys(obj[key]).length === 0) return key;
        else return key + '(' + recurse(obj[key]) + ')';
      })
      .join(', ');
  };

  return recurse(map);
};

export default dotsToParens;
