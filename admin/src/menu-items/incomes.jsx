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

// ==============================|| MENU ITEMS - INCOME REPORTS ||============================== //

const incomes = {
  id: 'group-incomes',
  title: <FormattedMessage id="Income Reports" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'daily-trading-profit',
      title: <FormattedMessage id="Daily Trading Profit" />,
      type: 'item',
      url: '/incomes/roi',
      icon: icons.statistics
    },
    {
      id: 'direct-referral',
      title: <FormattedMessage id="Direct Referral Bonus" />,
      type: 'item',
      url: '/incomes/direct',
      icon: icons.data
    },
    {
      id: 'first-deposit-bonus',
      title: <FormattedMessage id="First Deposit Bonus" />,
      type: 'item',
      url: '/incomes/token-reports',
      icon: icons.statistics
    },
    {
      id: 'team-commission',
      title: <FormattedMessage id="Team Commission" />,
      type: 'item',
      url: '/incomes/level-reports',
      icon: icons.data
    },
    {
      id: 'active-member-rewards',
      title: <FormattedMessage id="Active Member Rewards" />,
      type: 'item',
      url: '/incomes/prime-income',
      icon: icons.data
    },
    {
      id: 'booster-income',
      title: <FormattedMessage id="Booster Income" />,
      type: 'item',
      url: '/incomes/founder-income',
      icon: icons.data
    },
    {
      id: 'team-rewards',
      title: <FormattedMessage id="Team Rewards" />,
      type: 'item',
      url: '/incomes/team',
      icon: icons.data
    },
    {
      id: 'general-settings',
      title: <FormattedMessage id="General Settings" />,
      type: 'item',
      url: '/incomes/general-settings',
      icon: icons.data
    },
  ]
};

export default incomes;
