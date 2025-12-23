import { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about using Yakout\'s real estate platform, property searches, bookings, and more.',
};

export default function FAQPage() {
  return <FAQClient />;
}

