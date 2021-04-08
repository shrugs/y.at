import { NextSeo } from 'next-seo';

export function SeoMeta() {
  return (
    <NextSeo
      title="ý.at 🖕 // everybody owns emojis // claim yours now"
      description="Your ý.at is your @ for whatever the hell you want. There's no waitlist, just come claim your emoji username right now."
      openGraph={{ site_name: 'ý.at' }}
      twitter={{ cardType: 'summary_large_image' }}
    />
  );
}
