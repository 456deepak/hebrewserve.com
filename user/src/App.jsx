import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/Customization';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: process.env.VITE_APP_NAME,
  projectId: process.env.VITE_APP_PROJECT_ID,
  chains: [bsc],
  ssr: false
});

const queryClient = new QueryClient();

export default function App() {

  // route the user to login page
  

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeCustomization>
            <RTLLayout>
              <Locales>
                <ScrollTop>
                  <AuthProvider>
                    <>
                      <Notistack>
                        <RouterProvider router={router} />
                        {/* <Customization /> */}
                        <Snackbar />
                      </Notistack>
                    </>
                  </AuthProvider>
                </ScrollTop>
              </Locales>
            </RTLLayout>
          </ThemeCustomization>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
