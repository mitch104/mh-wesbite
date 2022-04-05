---
title: Scan to Listen
path: /scan-to-listen
date: 2020-03-14
summary: Article on the development of a React Native mobile app Scan to Listen, for scanning books to find audiobooks on Audible and scanning CDs and vinyl to find albums on Spotify  
tags: ['React-Native', 'Expo', 'Bottle', 'Trello', 'Segment']
---

Scan to Listen is the first personal project I have taken from conception all the way to production, it originally started out as an app for scanning the barcode of a physical book to find if there is a matching audiobook on [Audible](https://www.audible.co.uk/). Since then new features have evolved such as the ability to scan the barcode of CDs and vinyl to find the matching album on [Spotify](https://www.spotify.com) and generating barcodes to share your finds with other people that use the app. At the time of writing it has over 150 active downloads on the [Android Play Store](https://play.google.com/store/apps/details?id=com.mitchellharle.scan_to_listen).

Here is a quick video of it in action:
`youtube:https://www.youtube.com/embed/K03q3ejI3kA`

## Motivation

I am an avid audiobook listener but I still enjoy browsing book stores to find new releases. What I found myself doing was taking pictures of books that looked interesting and when I got home manually checking each one to see if there was an audiobook version. I knew there must be a more efficient way to do this! What if you could use your phone to detect if a physical book had an equivalent audiobook?

After searching through the Play Store to see if there was an application that already did this, I found a lot of barcode scanning apps taking you to websites for buying the book but not the audiobook. At this point I thought this could be an opportunity to create something of value for myself and for others.

## The Build
As this project was not focused on personal development my technology choices we're heavily dictates by tools I was already comfortable with, they were also very well suited to the task at hand.

The app is built in [React Native](https://reactnative.dev/), this is a tool from Facebook for creating mobile applications in JavaScript that are compatible with both Android and iOS. I spent 2 years working with this technology at [Zoetrope](https://zoetrope.io) so I was already very familiar with React Native. Since then however a set of development tools, [Expo](https://expo.io/), had emerged. This has features like [over the air updates](https://docs.expo.io/versions/latest/guides/configuring-ota-updates/#__next) which greatly increases the speed of the release cycle compared to a full Play Store release.

This system also needed a backend API, I planned to keep all user data on the phone by saving the redux state to local storage, so for foreseeable future this project didn't need a database. A full scale web framework like Django seemed excessive for what was needed here, instead the lightweight Python micro web-framework [Bottle](https://bottlepy.org/docs/dev/) was used.

[Segment.io](https://segment.com/) was used for event collection, this tool provides a single API to collect event data, you can then configure this to be sent to over 200 different destinations such as analytics tools [Google Analytics](https://analytics.google.com) and [mixpanel](https://mixpanel.com/) or even [Slack](https://slack.com/intl/en-gb/) or [MailChimp](https://mailchimp.com/) if you wanted to.

A selection of other tools that were used:
 - [Sentry](https://sentry.io) for error reporting
 - [Digital Ocean](https://www.digitalocean.com/) for server hosting
 - [Letsencrypt](https://letsencrypt.org/) for certificate management
 - [NGINX](https://www.nginx.com/) for the web server
 - [Pipenv](https://github.com/pypa/pipenv) for Python virtualenv and dependency management
 - [Black](https://github.com/psf/black) for autoformatting Python code
 - [PyTest](https://docs.pytest.org/en/latest/) for Python unit testing
 - [Trello](https://trello.com/) for project management

## User Feedback
Since it's release to the public I have been promoting it on various forms of social media; Instagram, Facebook and LinkedIn but by far the biggest reach and engagement was on reddit. An example post can be seen [here](https://www.reddit.com/r/reactjs/comments/eu416p/scan_to_listen_react_native_app_for_scanning_cds/) which became the top post of the week on r/reactjs. These posts allowed a direct channel of communication between myself and users, where their feedback was crucial, especially in the early stages after release where critical bugs were identified. For example, users outside of the UK were having trouble opening the Audible urls that were being sent back from the API, it became apparent that this was because everyone was receiving a Audible.co.uk url and were being redirected to the homepage for the country they were in e.g. Audible.com for the US. This lead to quick action, ensuring the user could choose which international version of Audible they were using so they received the correct top level domain.

![Active Users](/active-users.png)

The screenshot above is active users over time since release, the large jumps directly correlate with the times at which the app was promoted on reddit.

## FAQs
 - What technology is used for scanning barcodes? - The [Expo BarCodeScanner](https://docs.expo.io/versions/latest/sdk/bar-code-scanner/) component which is intuitive to implement and efficient to use, however the spinning logo animation during the API request used bespoke code.
 - Which API's are in use? - [GoodReads API](https://www.goodreads.com/api) for identifying books by ISBN number, [Discogs API](https://www.discogs.com/developers) for identifying albums by barcode ID and [Spotify API](https://developer.spotify.com/documentation/web-api/) to find Spotify urls.
 - How long did this take to develop? - I developed this application in my spare time whilst working a full-time job, so on average only 5-6 hours a week were allocated towards it's development, meaning it took ~6 months to get to it's first release with another 6 months of on and off bug fixing and new feature development.

## Limitations
One major limitation of the app is that a lot of records before the 1980s do not have barcodes, rendering the app useless for these cases. Sometimes in second hand stores, new barcodes or price stickers will be placed over the original barcode. There is the option of using reverse search technology like [TinyEye](https://tineye.com/) to identify products from their cover but this would require much larger bandwidth, computation and effort than just using a barcode identification.

At the moment the app only supports the platforms Audible and Spotify, the app has been built in such a way that it is extendable to additional platforms such as Apple Music.

Whilst this project has been very enjoyable and rewarding to work on, it of course would be nice for this to make a bit of money on the side. So far it has proved very tricky to monetize. Both the [Amazon Affiliate Program](https://affiliate-program.amazon.co.uk/) and the [Audible Affiliate Program](https://www.audible.com/ep/affiliate-intro) are unsuitable:
 - The Amazon program allows you to advertise specific product links however these will open Amazon in a browser rather than into the Audible app itself which would be a big strain on usability.
 - The Audible program have advertising links that deep link into Audible however they cannot be targeted towards a specific product, only deals or new sign-ups.

This leaves only a few imperfect options:
 - Put an immediate pay wall on the app, this could unfortunately deter a lot of people from ever using the app.
 - Have users pay for scans after a few trial of a few scans, which again may have a low conversion rate.
 - Have a paid premium version which provides extra functionality, this would require more time investment for further development.
 - In app advertisements, this is my last resort as the app will reduce the user satisfaction and would need to increase it's user base by a large amount to be effective.

If anyone has any other ideas for monetization I'm all ears, you can contact me [here](mailto:mitch104@protonmail.com).

## Next Steps
Currently the app has only been released on [Android Play Store](https://play.google.com/store/apps/details?id=com.mitchellharle.scan_to_listen), the most common user feedback was asking for it be released on iOS. Since it was written in React Native the same code can be used for iOS which means little to no extra development time. I develop on Linux so the main problem is that unfortunately you still need to use a Mac and Xcode to deploy to the App Store as well as paying a $100 per year fee to become an Apple developer. I'm hoping to release an iOS version in the near future!

I have a backlog of new feature ideas in a [Trello](https://trello.com/) board, including the ability to see YouTube music videos for the albums you have scanned and transferring scan history between devices. I'm hoping to be able to dedicate some more time to these in the near future.

Thanks for reading about Scan to Listen, if you're on Android please give it a [download](https://play.google.com/store/apps/details?id=com.mitchellharle.scan_to_listen) and [let me know what you think](mailto:mitch104@protonmail.com), I'd love to hear you feedback!
