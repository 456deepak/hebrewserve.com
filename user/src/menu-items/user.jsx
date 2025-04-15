// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  Story,
  Fatrows,
  PresentionChart,
  WalletMoney,
  MoneyRecive,
  MoneySend,
  ArrowRight,
  DocumentText
} from 'iconsax-react';

// type

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
  deposit: MoneyRecive,
  withdraw: MoneySend,
  transfer: ArrowRight,
  wallet: WalletMoney,
  history: DocumentText
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const profile = {
  id: 'group-profile',
  title: <FormattedMessage id="User" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'profile',
      title: <FormattedMessage id="Profile" />,
      type: 'item',
      url: '/user/profile/',
      icon: icons.statistics
    },
    {
      id: 'trading',
      title: <FormattedMessage id="Trading Package" />,
      type: 'item',
      url: '/user/trading-package/',
      icon: icons.chart
    },
    {
      id: 'directs',
      title: <FormattedMessage id="Direct Referrals" />,
      type: 'item',
      url: '/user/directs/',
      icon: icons.chart
    },
    {
      id: 'team',
      title: <FormattedMessage id="Team" />,
      type: 'item',
      url: '/user/team/',
      icon: icons.widgets
    },
    {
      id: 'direct-referral-bonus',
      title: <FormattedMessage id="Direct Referral Bonus" />,
      type: 'item',
      url: '/user/direct-referral-bonus/',
      icon: icons.data
    },
    {
      id: 'first-deposit-bonus',
      title: <FormattedMessage id="First Deposit Bonus" />,
      type: 'item',
      url: '/user/first-deposit-bonus/',
      icon: icons.data
    },
    {
      id: 'team-commission',
      title: <FormattedMessage id="Team Commission" />,
      type: 'item',
      url: '/user/team-commission/',
      icon: icons.data
    },
    {
      id: 'active-member-reward',
      title: <FormattedMessage id="Active Member Reward" />,
      type: 'item',
      url: '/user/active-member-reward/',
      icon: icons.data
    },
    {
      id: 'daily-profit',
      title: <FormattedMessage id="Daily Trading Profit" />,
      type: 'item',
      url: '/user/daily-profit/',
      icon: icons.data
    },
    {
      id: 'rank',
      title: <FormattedMessage id="User Rank" />,
      type: 'item',
      url: '/user/rank/',
      icon: icons.chart
    },
    {
      id: 'team-reward',
      title: <FormattedMessage id="Team Rewards" />,
      type: 'item',
      url: '/user/team-reward/',
      icon: icons.data
    },
    // ,
    // {
    //   id: 'terms',
    //   title: <FormattedMessage id="Terms & Conditions" />,
    //   type: 'item',
    //   url: '/user/terms/',
    //   icon: icons.widgets
    // },
    // {
    //   id: 'test-api',
    //   title: <FormattedMessage id="Test API" />,
    //   type: 'item',
    //   url: '/user/test-api/',
    //   icon: icons.data
    // },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id="Level Income" />,
    //   type: 'item',
    //   url: '/investments/invest-reports/',
    //   icon: icons.data
    // },
    // {
    //   id: 'Stakeico',
    //   title: <FormattedMessage id="Deposit Funds" />,
    //   type: 'item',
    //   url: '/user/add-funds',
    //   icon: icons.data
    // },
    // {
    //   id: 'Stakedicoreport',
    //   title: <FormattedMessage id="Active Package" />,
    //   type: 'item',
    //   url: '/investments/stacked-report/',
    //   icon: icons.data
    // },
    // {
    //    id: 'packages',
    //    title: <FormattedMessage id="Packages" />,
    //    type: 'item',
    //    url: '/packages/x3',
    //    icon: icons.data
    // },
    // {
    //   id: 'stackedtoken',
    //   title: <FormattedMessage id="Stake Token" />,
    //   type: 'item',
    //   url: '/user/stake-token',
    //   icon: icons.data
    // },
    // {
    //   id: 'Stakedtokenreport',
    //   title: <FormattedMessage id="TXN History" />,
    //   type: 'item',
    //   url: '/investments/stacked-token-report/',
    //   icon: icons.data
    // },
    // {
    //   id: 'ICO Transfer',
    //   title: <FormattedMessage id="Withdraw Funds" />,
    //   type: 'item',
    //   url: '/user/ico-transfer/',
    //   icon: icons.data
    // },
    {
      id: 'depositFunds',
      title: <FormattedMessage id="Deposit Funds" />,
      type: 'item',
      url: '/user/deposit-funds',
      icon: icons.deposit
    },
    {
      id: 'transferFunds',
      title: <FormattedMessage id="Transfer Funds" />,
      type: 'item',
      url: '/user/transfer-funds',
      icon: icons.transfer
    },
    {
      id: 'withdrawFunds',
      title: <FormattedMessage id="Withdraw Funds" />,
      type: 'item',
      url: '/user/withdraw-funds',
      icon: icons.withdraw
    },
    {
      id: 'transactionHistory',
      title: <FormattedMessage id="Transaction History" />,
      type: 'item',
      url: '/user/transaction-history',
      icon: icons.history
    }

    // {
    //   id: 'social-media',
    //   title: <FormattedMessage id="Verify & Get Tokens" />,
    //   type: 'item',
    //   url: '/user/social-media/',
    //   icon: icons.statistics
    // }
    // {
    //   id: 'w2wTransfers',
    //   title: <FormattedMessage id="W2W Transfers" />,
    //   type: 'item',
    //   url: '/user/w3w-transfers',
    //   icon: icons.data
    // },
    // {
    //   id: 'p2pTransfers',
    //   title: <FormattedMessage id="P2P Transfers" />,
    //   type: 'item',
    //   url: '/user/p2p-transfers',
    //   icon: icons.data
    // }
  ]
};

export default profile;
