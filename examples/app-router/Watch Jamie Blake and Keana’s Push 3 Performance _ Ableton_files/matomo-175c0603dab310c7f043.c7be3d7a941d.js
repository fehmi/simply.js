window.mato=function(t){var e=Object.assign({},{trackerUrl:"https://analytics.ableton.com/matomo.php",tagManagerScript:"https://analytics.ableton.com/js/container_R5JVetMm.js",siteId:"1",applyCustomSettings:!0},window.matomoOptions||{});function n(){window._paq.push(Array.from(arguments))}function a(t){var e=document.createElement("script");e.type="text/javascript",e.src=t;var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)}return window._paq=window._paq||[],window._mtm=window._mtm||[],e.trackerUrl&&(n("requireConsent"),n("requireCookieConsent"),n("setTrackerUrl",e.trackerUrl),n("setSiteId",e.siteId),n("addDownloadExtensions",["alp","abl","ablbundle","adg","agr","adv","alc","als","ams","amxd","asd","ask"]),e.applyCustomSettings&&(n("enableLinkTracking"),n("enableHeartBeatTimer",5),n("setDomains",["*.ableton.com"]),n("enableCrossDomainLinking"),n("trackPageView")),e.tagManagerScript&&(window._mtm.push({"mtm.startTime":(new Date).getTime(),event:"mtm.Start"}),a(e.tagManagerScript)),e.script&&a(e.script),t.when("matomo",(function(){n("setConsentGiven"),n("setCookieConsentGiven")}),(function(){n("forgetConsentGiven"),n("forgetCookieConsentGiven")}))),n}(biscuits);
//# sourceMappingURL=matomo-175c0603dab310c7f043.js.map