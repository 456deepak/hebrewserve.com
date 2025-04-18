// project-imports
import applications from './applications';
import widget from './widget';
import formsTables from './forms-tables';
import samplePage from './sample-page';
import chartsMap from './charts-map';
import support from './support';
import pages from './pages';

import transactions from './transaction-reports'
import incomes from './incomes'
import user from './user'
import task from './task'
import investments from './investment'
import customerSupport from './customerSupport'
import withdrawals from './withdrawals'

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [user, investments, withdrawals, transactions, incomes]
  // items: [user, investments, incomes, customerSupport]
};

export default menuItems;
