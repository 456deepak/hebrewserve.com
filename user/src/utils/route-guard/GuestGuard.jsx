import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const { isLoggedIn, logout, user_login_request, logoutForRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  let [searchParams, setSearchParams] = useSearchParams();
  const [hash, setHash] = useState(searchParams.get("hash"))
  const [refID, setrefID] = useState(searchParams.get("refID"))

  useEffect(() => {
    if (hash)
      logout().then(async () => {
        await user_login_request(hash).then(() => {
          setHash(null)
        })
      })
    else if (refID)
      if (isLoggedIn)
        logoutForRegister().then(() => {
          setrefID(null)
        })
  }, [hash])

  useEffect(() => { 
    if (isLoggedIn && !hash && !refID) {
      navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH, {
        state: { from: '' },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };
