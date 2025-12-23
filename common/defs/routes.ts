import Auth from '@/modules/auth/defs/routes';
import Users from '@/modules/users/defs/routes';
import Permissions from '@/modules/permissions/defs/routes';
import Properties from '@/modules/properties/defs/routes';
import Agents from '@/modules/agents/defs/routes';
import Locations from '@/modules/locations/defs/routes';
import Amenities from '@/modules/amenities/defs/routes';
import Posts from '@/modules/posts/defs/routes';

const Common = {
  Home: '/',
  NotFound: '/404',
  JoinUs: '/join-us',
  PrivacyPolicy: '/privacy',
  About: '/about',
  Contact: '/contact',
  FAQ: '/faq',
  TermsOfService: '/terms-of-service',
};

const Routes = {
  Common,
  Auth,
  Permissions,
  Users,
  Properties,
  Agents,
  Locations,
  Amenities,
  Posts,
};

export default Routes;
