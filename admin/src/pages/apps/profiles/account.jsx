import { useLocation, Outlet } from 'react-router-dom';

// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| CHANGE PASSWORD ||============================== //

export default function AccountProfile() {
  const { pathname } = useLocation();

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Change Password' }
  ];

  return (
    <>
      {/* <Breadcrumbs custom heading="Change Password" links={breadcrumbLinks} /> */}
      <MainCard border={false}>
        <Outlet />
      </MainCard>
    </>
  );
}
