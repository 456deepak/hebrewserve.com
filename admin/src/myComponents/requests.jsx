import { openSnackbar } from 'api/snackbar';
import axios from 'utils/axios';

const Handler = async (props) => {
  try {
    props.setState(true);
    const res = await axios.post(props.url, props.data);
    if (res.data?.status) {
      openSnackbar({
        open: true,
        message: res.data?.message,
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    } else {
      openSnackbar({
        open: true,
        message: res.data?.message ?? 'Please try again!',
        variant: 'alert',

        alert: {
          color: 'error'
        }
      });
      throw res.data;
    }
  } catch (e) {
    throw { status: false, ...e };
  } finally {
    props.setState(false);
  }
};

export default Handler;
