import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { StateView } from 'src/sections/state/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`State - ${CONFIG.appName}`}</title>
      </Helmet>

      <StateView />
    </>
  );
}
