// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: `http://localhost:8080/`,
  // SERVER_URL: `http://adminitest.717mm.com/`,



  // SERVER_URL: `https://itestadmin.ejiameng.cn`,
  // SERVER_URL: `https://admin.ejiameng.cn`,
  // SERVER_URL: `http://47.99.212.74:8888`,
  production: false,
  useHash: true,
  hmr: false,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
