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

const incomeWording = "Bonus"

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const incomes = {
  id: 'group-incomes',
  title: <FormattedMessage id="Income Reports" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    // {
    //   id: 'token-reports',
    //   title: <FormattedMessage id={`Deposit Funds`} />,
    //   type: 'item',
    //   url: '/incomes/token-reports',
    //   icon: icons.statistics
    // },
    // {
    //   id: 'level-reports',
    //   title: <FormattedMessage id={`Withdraw Funds`} />,
    //   type: 'item',
    //   url: '/incomes/level-reports',
    //   icon: icons.data
    // },
    // {
    //   id: 'invest',
    //   title: <FormattedMessage id={`ROI ${incomeWording}`} />,
    //   type: 'item',
    //   url: '/incomes/roi',
    //   icon: icons.statistics
    // },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id={`Direct ${incomeWording}`} />,
    //   type: 'item',
    //   url: '/incomes/direct',
    //   icon: icons.data
    // },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id={`VIP ${incomeWording}`} />,
    //   type: 'item',
    //   url: '/incomes/vip',
    //   icon: icons.data
    // },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id={`Team ${incomeWording}`} />,
    //   type: 'item',
    //   url: '/incomes/team',
    //   icon: icons.data
    // }
  ]
};

export default incomes;
