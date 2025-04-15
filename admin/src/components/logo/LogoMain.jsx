// material-ui
import { useTheme } from '@mui/material/styles';
import { Image } from 'react-bootstrap';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="icon logo" width="100" />
     *
     */
    <Image style={{ margin: "10px 0px 0px 0px" }} width={100} height={100} src={'/assets/images/logo.png'}></Image>
  );
}
