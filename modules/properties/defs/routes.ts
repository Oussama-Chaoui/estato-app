const prefix = '/listing';
const Routes = {
  DailyRent: {
    ReadAll: prefix + '/daily-rent',
    ReadOne: prefix + '/daily-rent/{id}',
  },
  MonthlyRent: {
    ReadAll: prefix + '/monthly-rent',
    ReadOne: prefix + '/monthly-rent/{id}',
  },
  HomeSale: {
    ReadAll: prefix + '/home-sale',
    ReadOne: prefix + '/home-sale/{id}',
  },
};

export default Routes;
