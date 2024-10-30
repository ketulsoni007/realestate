import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { SubModuleEditView } from 'src/sections/submodule/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`SubModule - ${CONFIG.appName}`}</title>
      </Helmet>

      <SubModuleEditView />
    </>
  );
}
