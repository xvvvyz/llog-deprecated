'use client';

import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon';

const NotFound = () => (
  <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-9 py-12 text-center">
    <FaceFrownIcon className="w-12" />
    <p>Page not found.</p>
  </div>
);

export default NotFound;
