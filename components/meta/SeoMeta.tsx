import { NextSeo } from 'next-seo';

export function SeoMeta() {
  return (
    <NextSeo
      title="ý.at 🖕 // emojis for everyone // claim yours now"
      description="Your ý.at is your @ for whatever the hell you want. There's no waitlist, just come claim your emoji username right now."
      openGraph={{ site_name: 'ý.at', images: [{ url: 'https://ý.at/meta.png' }] }}
      twitter={{ cardType: 'summary_large_image' }}
    />
  );
}
