import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ProfileUpdateView } from 'src/sections/profile/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Profile - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProfileUpdateView />
    </>
  );
}
