import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { AreaEditView } from 'src/sections/area/view';
import { ModuleEditView } from 'src/sections/module/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Module - ${CONFIG.appName}`}</title>
      </Helmet>

      <ModuleEditView />
    </>
  );
}
