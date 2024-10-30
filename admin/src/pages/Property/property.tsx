import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//

import { PropertyView } from 'src/sections/property/view/';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Property - ${CONFIG.appName}`}</title>
      </Helmet>

      <PropertyView />
    </>
  );
}
