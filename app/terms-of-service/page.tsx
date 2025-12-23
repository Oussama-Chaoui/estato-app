import { Metadata } from 'next';
import TermsOfServiceClient from './TermsOfServiceClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our Terms of Service to understand the rules and guidelines for using Yakout\'s real estate platform.',
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}



