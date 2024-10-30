import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PropertyCreateView } from 'src/sections/property/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Property - ${CONFIG.appName}`}</title>
      </Helmet>

      <PropertyCreateView />
    </>
  );
}
