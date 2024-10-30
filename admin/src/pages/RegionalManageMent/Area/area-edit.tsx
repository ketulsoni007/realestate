import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { AreaEditView } from 'src/sections/area/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Area - ${CONFIG.appName}`}</title>
      </Helmet>

      <AreaEditView />
    </>
  );
}
