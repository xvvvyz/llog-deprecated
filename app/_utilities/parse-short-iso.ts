const parseShortIso = <T>(iso?: T) => (iso ? `${iso}:00:00.000Z` : iso) as T;

export default parseShortIso;
