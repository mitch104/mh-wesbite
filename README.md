# mh-wesbite
This repo is the source code for Mitchell Harle's [personal website](https://mitchell-harle.dev). This has been built with Gridsome and Tailwind CSS.

## Development
To install node modules cd into `website` and run:
```
npm i
```

If you haven't done so before install the gridsome CLI:
```
npm install -g @gridsome/cli
```

To serve in development mode:
```
gridsome develop
```

## Deployment
The site is served on GitHub pages, https://mitch104.github.io, but redirects to https://mitchell-harle.dev.

To test a build before deploying cd into `website` and run:
```
npm run build
```
This will generate the static files in `website/dist`.

To deploy run the following command:
```
npm run deploy
```
