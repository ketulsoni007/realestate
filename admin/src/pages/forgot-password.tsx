import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ForgotPasswordView } from 'src/sections/forgot-password';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Forgot Password - ${CONFIG.appName}`}</title>
      </Helmet>
      <ForgotPasswordView />
    </>
  );
}
