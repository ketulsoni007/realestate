import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { CityEditView } from 'src/sections/city/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`City - ${CONFIG.appName}`}</title>
      </Helmet>

      <CityEditView />
    </>
  );
}
