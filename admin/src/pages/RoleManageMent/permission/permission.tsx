import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
//
import { PermissionCreateView } from 'src/sections/permission/view';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Module - ${CONFIG.appName}`}</title>
      </Helmet>

      <PermissionCreateView />
    </>
  );
}
