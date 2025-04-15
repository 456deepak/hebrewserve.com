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

const task = {
  id: 'group-task',
  title: <FormattedMessage id="User" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'invest',
      title: <FormattedMessage id="Daily Tasks" />,
      type: 'item',
      url: '/user/dailytask',
      icon: icons.statistics
    },

    // {
    //   id: 'data',
    //   title: <FormattedMessage id="Transfer Funds" />,
    //   type: 'item',
    //   url: '/user/transferFunds',
    //   icon: icons.data
    // },

  ]
};

export default task;
