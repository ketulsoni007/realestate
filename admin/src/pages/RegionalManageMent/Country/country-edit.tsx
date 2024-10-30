import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { CountryEditView } from 'src/sections/country/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Property - ${CONFIG.appName}`}</title>
      </Helmet>

      <CountryEditView />
    </>
  );
}
