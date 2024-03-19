const formatShortIso = (date: Date) => date.toISOString().split(':')[0];

export default formatShortIso;
