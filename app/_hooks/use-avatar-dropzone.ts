import { useDropzone } from 'react-dropzone';

const useAvatarDropzone = () =>
  useDropzone({
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    maxSize: 10000000,
    multiple: false,
    noClick: true,
  });

export default useAvatarDropzone;
