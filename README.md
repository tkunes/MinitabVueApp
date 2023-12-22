# MinitabVue

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

To test in vscode: [Vitest](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development
Please use this command to start the vue app. Once the app is started, it can be viewed at (http://localhost:5173/)
```sh
npm run dev
```

### Type-Check, Compile and Minify for Production
If the minified version is to be hosted, the URL in requestPresets must be updated to be a proper URL before the build.

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)
If the tests are being run through the command line, the vue app must be started. The presets json file is being hosted by vue and will be unreachable if the vue app is not started. 
```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
