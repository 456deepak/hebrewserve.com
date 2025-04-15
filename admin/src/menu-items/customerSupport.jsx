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

const customerSupport = {
  id: 'group-customerSupport',
  title: <FormattedMessage id="Support" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'data',
      title: <FormattedMessage id="Chat" />,
      type: 'item',
      url: '/support/chat',
      icon: icons.data
    }
    // ,
    // {
    //   id: 'data',
    //   title: <FormattedMessage id="Contact Us" />,
    //   type: 'item',
    //   url: '/user/',
    //   icon: icons.data
    // }
  ]
};

export default customerSupport;
