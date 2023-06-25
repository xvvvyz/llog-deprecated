import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';

const NotFound = () => (
  <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-9 py-12 text-center">
    <GlobeEuropeAfricaIcon className="w-12" />
    <p>
      404: You seem to be lost.
      <br />
      <span className="text-fg-3">Page not found.</span>
    </p>
  </div>
);

export default NotFound;
