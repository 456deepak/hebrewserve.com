import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT, REGISTER } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const init = async () => {
    try {
      const serviceToken = window.localStorage.getItem('serviceToken');
      if (serviceToken && verifyToken(serviceToken)) {
        setSession(serviceToken);
        const response = await axios.get('/user/profile');
        console.log(response);
        if (response.data?.status) window.localStorage.setItem('user', JSON.stringify(response.data?.result));
        const { result: user } = response.data;
        console.log(user);
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user
          }
        });
      } else {
        dispatch({
          type: LOGOUT
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: LOGOUT
      });
    }
  }

  useEffect(() => {
    init()
  }, []);

  const login = async (userAddress, password) => {
    // Clear any existing daily profit activation data
    localStorage.removeItem('dailyProfitActivated');
    localStorage.removeItem('activationDate');

    const response = await axios.post('/user/login', { userAddress, password });
    const { result: user } = response.data;
    setSession(user.token);
    init();
  };

  const user_login_request = async (hash) => {
    const response = await axios.post('/user/login/request', { hash });
    const { result: user } = response.data;
    setSession(user.token);
    init()
    // dispatch({
    //   type: LOGIN,
    //   payload: {
    //     isLoggedIn: true,
    //     user
    //   }
    // });
  };

  const register = async (userAddress, referralId) => {
    // todo: this flow need to be recode as it not verified
    const response = await axios.post('/user/signup', {
      userAddress,
      referralId
    });
    dispatch({
      type: REGISTER,
      payload: {
        ...response.data
      }
    })
    // if (response.data.status) return response.data;
    // else throw response.message;

    // if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
    //   const localUsers = window.localStorage.getItem('users');
    //   users = [
    //     ...JSON.parse(localUsers),
    //     {
    //       id,
    //       email,
    //       password,
    //       name: `${firstName} ${lastName}`
    //     }
    //   ];
    // }

    // window.localStorage.setItem('users', JSON.stringify(users));
  };

  const checkReferID = async (refer_id) => {
    return await axios.post('/user/checkReferID', {
      refer_id
    })
  }

  const logout = async () => {
    setSession(null)
    window.localStorage.removeItem('user')
    // Clear daily profit activation data
    localStorage.removeItem('dailyProfitActivated');
    localStorage.removeItem('activationDate');
    dispatch({ type: LOGOUT });
  };

  const logoutForRegister = async () => {
    setSession(null)
    window.localStorage.removeItem('user')
    // Clear daily profit activation data
    localStorage.removeItem('dailyProfitActivated');
    localStorage.removeItem('activationDate');
  };

  const forgotPassword = async (email) => {
    return await axios.post('/user/forgot/password', {
      email
    })
  }

  const resetPassword = async (token, password, confirm_password) => {
    return await axios.post('/user/reset/password', {
      token,
      password,
      confirm_password
    })
  }

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, checkReferID, logoutForRegister, login, logout, user_login_request, register, resetPassword, forgotPassword, updateProfile }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
