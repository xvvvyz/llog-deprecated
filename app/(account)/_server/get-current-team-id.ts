import getCurrentUser from './get-current-user';

const getCurrentTeamId = async () => (await getCurrentUser())?.id;

export default getCurrentTeamId;
