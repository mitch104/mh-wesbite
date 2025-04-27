# mh-wesbite
This repo is the source code for Mitchell Harle's [personal website](https://mitchell-harle.dev). This has been built with Gridsome and Tailwind CSS.

## Development
Change directory:

```bash
cd website
```

Mac prerequisites:
```bash
brew install python-setuptools
brew install vips
```


Make sure you are using node version 16:
```bash
nvm install 16
nvm use 16
```

Install node modules:
```bash
npm i
```

If you haven't done so before install the gridsome CLI:
```bash
npm install -g @gridsome/cli
```

To serve in development mode:
```bash
gridsome develop
```

## Deployment
The site is served on GitHub pages, https://mitch104.github.io, but redirects to https://mitchell-harle.dev.

To test a build before deploying cd into `website` and run:
```bash
npm run build
```
This will generate the static files in `website/dist`.

To deploy run the following command:
```bash
npm run deploy
```
