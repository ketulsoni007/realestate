import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { CityCreateView } from 'src/sections/city/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`City - ${CONFIG.appName}`}</title>
      </Helmet>

      <CityCreateView />
    </>
  );
}
