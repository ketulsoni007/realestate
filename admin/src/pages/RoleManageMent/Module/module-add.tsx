import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { ModuleCreateView } from 'src/sections/module/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Module - ${CONFIG.appName}`}</title>
      </Helmet>

      <ModuleCreateView />
    </>
  );
}
