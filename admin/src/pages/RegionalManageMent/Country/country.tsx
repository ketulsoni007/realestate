import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { CountryView } from 'src/sections/country/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Country - ${CONFIG.appName}`}</title>
      </Helmet>

      <CountryView />
    </>
  );
}
