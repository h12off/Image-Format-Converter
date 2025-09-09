import type { Article } from '../types';
import { WhyConvertPngToJpg } from './why-convert-png-to-jpg';

export const articles: Article[] = [
  {
    slug: 'why-convert-png-to-jpg',
    title: 'Why Convert PNG to JPG? A Guide to Faster Websites',
    description: 'Learn the key differences between PNG and JPG and find out why a simple conversion can dramatically improve your website\'s loading speed. Use our free online tool to convert your images.',
    date: `Published on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    content: WhyConvertPngToJpg,
  },
  // Add new articles here in the future
];
