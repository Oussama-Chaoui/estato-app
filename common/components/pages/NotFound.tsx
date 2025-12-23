import NotFoundIllustration from '../../assets/svgs/NotFoundIllustration';
import Link from 'next/link';
import Routes from '../../defs/routes';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation(['404']);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-200/50 via-white to-primary-200/30">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t('404:not_found')}
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {t('404:description')}
            <br />
            {t('404:suggestion')}
          </p>
          
          <div className="w-full mb-8">
            <NotFoundIllustration className="w-full h-auto" />
          </div>
          
          <div className="text-center">
            <Link 
              href={Routes.Common.Home}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {t('404:return_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
