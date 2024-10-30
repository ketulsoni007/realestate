import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { StateEditView } from 'src/sections/state/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Property - ${CONFIG.appName}`}</title>
      </Helmet>

      <StateEditView />
    </>
  );
}
