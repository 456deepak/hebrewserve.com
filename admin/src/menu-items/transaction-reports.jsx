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

const transactions = {
  id: 'group-investments',
  title: <FormattedMessage id="transaction reports" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    // {
    //   id: 'Deposits',
    //   title: <FormattedMessage id="Deposits" />,
    //   type: 'item',
    //   url: '/transaction-reports/deposits',
    //   icon: icons.data
    // },
    {
      id: 'Withdrawals',
      title: <FormattedMessage id="Withdrawals" />,
      type: 'item',
      url: '/transaction-reports/withdrawals',
      icon: icons.data
    },
    // {
    //   id: 'Investments',
    //   title: <FormattedMessage id="Investments" />,
    //   type: 'item',
    //   url: '/transaction-reports/invest-reports/',
    //   icon: icons.data
    // },
    // {
    //   id: 'Transfer Fund',
    //   title: <FormattedMessage id="Transfer Fund" />,
    //   type: 'item',
    //   url: '/transaction-reports/transfer-fund-reports',
    //   icon: icons.data
    // },
    // {
    //   id: 'Deduct Fund',
    //   title: <FormattedMessage id="Deduct Fund" />,
    //   type: 'item',
    //   url: '/transaction-reports/deduct-fund-reports',
    //   icon: icons.data
    // },
  ]
};

export default transactions;
