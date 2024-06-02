const strip = (str?: string) => (str ? str.replace(/['"\[\]]/g, '') : '');

export default strip;
