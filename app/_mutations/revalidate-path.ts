'use server';

import { revalidatePath as rp } from 'next/cache';

const revalidatePath = async () => rp('/', 'layout');

export default revalidatePath;
