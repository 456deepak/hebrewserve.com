import { openSnackbar } from 'api/snackbar';
import axios from 'utils/axios';

const Handler = async (props) => {
  try {

    props.setState(true)
    
    let res
    if (props?.type === "GET")
      res = await axios.get(props.url, props.data)
    else
      res = await axios.post(props.url, props.data)

    if (!res.data?.status) throw res.data

    openSnackbar({
      open: true,
      message: res.data?.message,
      variant: 'alert',

      alert: {
        color: 'success'
      }
    })

  } catch (e) {

    openSnackbar({
      open: true,
      message: e?.message ?? 'Please try again!',
      variant: 'alert',

      alert: {
        color: 'error'
      }
    })

    throw { status: false, ...e };

  } finally {
    props.setState(false);
  }
};

export default Handler;
