'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

const ChatwootWidget = () => {
  const locale = useLocale();

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || '';
    const WEBSITE_TOKEN =
      process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '';

    const initializeChatwoot = () => {
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: WEBSITE_TOKEN,
          baseUrl: BASE_URL
        });
      }
    };

    const loadChatwootScript = () => {
      // Add Chatwoot Settings
      window.chatwootSettings = {
        hideMessageBubble: false,
        position: locale === 'ar' ? 'left' : 'right',
        locale: locale,
        // type: 'expanded_bubble'
        type: 'standard'
      };

      // Create and append the script
      const script = document.createElement('script');
      script.src = `${BASE_URL}/packs/js/sdk.js`;
      script.async = true;
      script.defer = true;
      script.onload = initializeChatwoot;
      script.dataset.chatwoot = 'true'; // Custom attribute for identification
      document.body.appendChild(script);
    };

    // const cleanupChatwoot = () => {
    //   console.log('window?.chatwoot', window?.chatwoot);
    //   // Remove the Chatwoot script
    //   const existingScript = document.querySelector(
    //     'script[data-chatwoot="true"]'
    //   );
    //   console.log(existingScript);
    //   if (existingScript) {
    //     existingScript.remove();
    //   }
    //   console.log('window?.chatwootSDK', window?.chatwootSDK);
    //   console.log(typeof window?.chatwootSDK?.reset === 'function');
    //   // Reset the Chatwoot SDK
    //   if (
    //     window?.chatwootSDK &&
    //     typeof window?.chatwootSDK?.reset === 'function'
    //   ) {
    //     console.log('Resetting Chatwoot SDK...');
    //     window.chatwootSDK.reset();
    //   }
    // };

    // Perform cleanup and reinitialization
    // cleanupChatwoot();

    loadChatwootScript();
    // setTimeout(loadChatwootScript, 100); // Add a slight delay to ensure stability
  }, []);

  return null;
};

export default ChatwootWidget;
