// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Wallet, MoneyRecive } from 'iconsax-react';

// ==============================|| MENU ITEMS - WITHDRAWALS ||============================== //

const withdrawals = {
  id: 'group-withdrawals',
  title: <FormattedMessage id="withdrawals" defaultMessage="Withdrawals" />,
  type: 'group',
  icon: Wallet,
  children: [
    {
      id: 'withdrawal-management',
      title: <FormattedMessage id="withdrawal-management" defaultMessage="Withdrawal Management" />,
      type: 'item',
      url: '/withdrawals',
      icon: MoneyRecive,
      breadcrumbs: false
    }
  ]
};

export default withdrawals;
