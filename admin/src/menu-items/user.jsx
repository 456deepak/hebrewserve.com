// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart } from 'iconsax-react';

// type

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const profile = {
  id: 'group-profile',
  title: <FormattedMessage id="User" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'all-users',
      title: <FormattedMessage id="All Users" />,
      type: 'item',
      url: '/user/allUsers',
      icon: icons.statistics
    },
    {
      id: 'update-content',
      title: <FormattedMessage id="Update Content" />,
      type: 'item',
      url: '/user/updateContent',
      icon: icons.statistics
    },
    {
      id: 'fund-transfer',
      title: <FormattedMessage id="Fund Transfer Management" />,
      type: 'item',
      url: '/user/fundTransferManagement',
      icon: icons.data
    },
    // {
    //   id: 'deduct-funds',
    //   title: <FormattedMessage id="Deduct Funds" />,
    //   type: 'item',
    //   url: '/user/deductFunds',
    //   icon: icons.data
    // }
  ]
};

export default profile;
