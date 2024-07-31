const formatImageUrl = (file?: string | File | null) => {
  if (!file) {
    return undefined;
  }

  if (typeof file === 'string') {
    if (file.startsWith('http')) return file;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${file}`;
  }

  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
};

export default formatImageUrl;
