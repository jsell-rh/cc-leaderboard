# [1.1.0](https://github.com/jsell-rh/cc-leaderboard/compare/v1.0.0...v1.1.0) (2025-10-18)


### Bug Fixes

* Correct migrations path in Dockerfile to web/migrations ([e8db4db](https://github.com/jsell-rh/cc-leaderboard/commit/e8db4db34911b7feb77047b479eb2c646125c337))
* **deploy:** Fix 403 on production Clowdapp route ([b6b1387](https://github.com/jsell-rh/cc-leaderboard/commit/b6b138724a502e6f8115a1752ab17ace7216ce55))
* **deploy:** Fix healthcheck ports ([f669a27](https://github.com/jsell-rh/cc-leaderboard/commit/f669a279df141aeedd0bbe85de3df3665e9ca01d))
* **deploy:** Use port 8000 ([68513fc](https://github.com/jsell-rh/cc-leaderboard/commit/68513fc8617d03ec4bf79c43384932f17e830fb0))
* Include basepath in GitHub OAuth redirect_uri ([daa9724](https://github.com/jsell-rh/cc-leaderboard/commit/daa9724ac0d0c0b0f0df574b273b0c967801d599))
* Read CLI version from package.json dynamically ([15ff528](https://github.com/jsell-rh/cc-leaderboard/commit/15ff528805bb55ec88adfdd457acafae49ad32c9))
* Standardize CLI name to 'cc-leaderboard' across codebase ([27228ae](https://github.com/jsell-rh/cc-leaderboard/commit/27228ae3e614c0530cd378645e56618f220642c6))
* Update Docker build for npm workspace structure ([c1346d6](https://github.com/jsell-rh/cc-leaderboard/commit/c1346d6dec72bba46b75afc4cfafee8cfc3f401e))
* Use basepath for health check endpoints ([95de30f](https://github.com/jsell-rh/cc-leaderboard/commit/95de30f195c5d10aef554fd33dab72c17c22071d))
* Use baseURL for GitHub OAuth links in frontend ([fcb5bba](https://github.com/jsell-rh/cc-leaderboard/commit/fcb5bbad05b4fa10fd0a58f419a484c7726e4da0))
* Use build:web script to build only web workspace in Docker ([26aa609](https://github.com/jsell-rh/cc-leaderboard/commit/26aa6096a6400c159334993fd3eea9f6671dc92e))


### Features

* Add comprehensive basepath support for deployment behind subpaths ([7d207bc](https://github.com/jsell-rh/cc-leaderboard/commit/7d207bc4bdd54f297a934a9ec1903e17f2a7f5d4))
* Improve CLI UX for API URL configuration ([c546db9](https://github.com/jsell-rh/cc-leaderboard/commit/c546db918e0886b2a98bfcc4c64c99586e4e24f9))

# 1.0.0 (2025-10-17)


### Bug Fixes

* Add comprehensive TypeScript type system for server and client ([a07e0f1](https://github.com/jsell-rh/cc-leaderboard/commit/a07e0f10b1b0b49fc71675a5e42b9efa8442c1d9))
* Add user:email scope to GitHub OAuth ([69a5606](https://github.com/jsell-rh/cc-leaderboard/commit/69a560639c9e6fb94a88f4e956213780648cb8dd))
* Configure Nuxt to use app/ as source directory ([94a1df5](https://github.com/jsell-rh/cc-leaderboard/commit/94a1df5a1bbb9eefdb0d7a0791393b506794d475))
* Consolidate database utilities and disable dev type checking ([1630947](https://github.com/jsell-rh/cc-leaderboard/commit/1630947a251a278a87730818576ae9083a7dfdea))
* Correct CSS path to include app directory ([24d919e](https://github.com/jsell-rh/cc-leaderboard/commit/24d919e0666e796d0d6f869371cdf13672189d6c))
* Correct import paths for Nuxt aliases ([88335e0](https://github.com/jsell-rh/cc-leaderboard/commit/88335e02e2f247434696819b49e13543218592c1))
* Enable class prop for DropdownMenuTrigger component ([27f51ec](https://github.com/jsell-rh/cc-leaderboard/commit/27f51ecd64ae2cfb80e5c0a11af51360a50202f5))
* Force dev server to run on port 3000 ([5ef1ef6](https://github.com/jsell-rh/cc-leaderboard/commit/5ef1ef643d8e0a6a073b5db34ad4a205e4a3cd44))
* make footer stick to bottom of page ([5ceb4f9](https://github.com/jsell-rh/cc-leaderboard/commit/5ceb4f9e5ca962238893f233cdcc0eb5a24229bf))
* Move global CSS to Nuxt config for proper loading ([294a642](https://github.com/jsell-rh/cc-leaderboard/commit/294a642f15d48c39f84f118f9f03f1beafbdba26))
* OAuth redirect issues and improve configuration ([0bc649e](https://github.com/jsell-rh/cc-leaderboard/commit/0bc649ede79ca26eb5f79f479c8a701a0ac10d48))
* Only show users with submissions in selected period ([310c224](https://github.com/jsell-rh/cc-leaderboard/commit/310c224bb3956b9e377b45102c873395418ce903))
* Remove as-child from DropdownMenuTrigger per radix-vue docs ([c72e346](https://github.com/jsell-rh/cc-leaderboard/commit/c72e34695b840e21723362d5f2a81e63a30f9d8a))
* Remove shadcn componentDir to avoid directory scanning warnings ([2d69d79](https://github.com/jsell-rh/cc-leaderboard/commit/2d69d79ef641f7bc067ba565f8ca57b6234f045d))
* Resolve GitHub OAuth 404 error ([aa2db80](https://github.com/jsell-rh/cc-leaderboard/commit/aa2db80acc8c3d625b7e99341e8e5ec03e0d70e7))
* Resolve TypeScript compilation errors in CLI ([447ef32](https://github.com/jsell-rh/cc-leaderboard/commit/447ef32dd9472c9709b4d00a1a39fb6a0c2e74cf))
* Restore index.ts files with variant definitions ([75348d5](https://github.com/jsell-rh/cc-leaderboard/commit/75348d58a46ed44c9ca3fa3688ee3a355b297856))
* Update CLI OAuth path and default port ([354b790](https://github.com/jsell-rh/cc-leaderboard/commit/354b7907c5786bd8a81f2808ff060b5ab3f7c746))
* Update CLI submit command to match ccusage JSON format ([e7f9ce5](https://github.com/jsell-rh/cc-leaderboard/commit/e7f9ce57db1f93ecbc09ab80a7657f971b9f0643))
* Update import paths after removing index.ts files ([caa2231](https://github.com/jsell-rh/cc-leaderboard/commit/caa2231fe9814f433dda96857bd106128b8f0520))
* update Node.js version to 20 in publish workflow ([6142450](https://github.com/jsell-rh/cc-leaderboard/commit/61424502059031f79980212dd7d3540245a667b0))
* update Node.js version to 22 for semantic-release compatibility ([419d7a1](https://github.com/jsell-rh/cc-leaderboard/commit/419d7a1090e4bc6728f1b500ea9a38b541bcacf9))
* Update packages and wrap dropdown in ClientOnly ([095c223](https://github.com/jsell-rh/cc-leaderboard/commit/095c223bc1b1b901f427312e3b84561a98d03d31))
* Use anchor tags for OAuth to prevent Vue Router interception ([378a096](https://github.com/jsell-rh/cc-leaderboard/commit/378a09670fc602c27a7a9caad0fa64bc895c766a))
* Use button element with as-child for dropdown trigger ([b4d340e](https://github.com/jsell-rh/cc-leaderboard/commit/b4d340e7c2068505acf4fe97f8dd8786470fd6df))
* Use localStorage for CLI login flow instead of query params ([4998248](https://github.com/jsell-rh/cc-leaderboard/commit/4998248b02adf6b390405282260eddd5d5549b12))
* Use raw radix-vue components directly for dropdown ([85bff6c](https://github.com/jsell-rh/cc-leaderboard/commit/85bff6c65f9d369d3ef2fdf55b615f81d2a0f9dd))


### Features

* Add --api-url option to config command ([afd6f71](https://github.com/jsell-rh/cc-leaderboard/commit/afd6f71925581cef00aa0f4df86802c34104999c))
* add automated npm publishing via GitHub Actions ([d4214e9](https://github.com/jsell-rh/cc-leaderboard/commit/d4214e9f1700a17f9a67ca503b51c2a4bd8edf78))
* add automated versioning and releases with semantic-release ([11a5e01](https://github.com/jsell-rh/cc-leaderboard/commit/11a5e01b8b0275177ed5ebb6669a29b64b623254))
* Add bulk import feature to CLI submit command ([e86cf95](https://github.com/jsell-rh/cc-leaderboard/commit/e86cf95da0abca0a684a6e558380e6467378a145))
* Add CLI-aware login flow with guided onboarding ([f5ef759](https://github.com/jsell-rh/cc-leaderboard/commit/f5ef75998f3f80d2baa38019caaff5332a1422e2))
* Add comprehensive CLI getting started guide ([50ecf43](https://github.com/jsell-rh/cc-leaderboard/commit/50ecf43d9d2341e9d51588b09735c13ccca9655f))
* Add comprehensive logging with pino ([e6786e0](https://github.com/jsell-rh/cc-leaderboard/commit/e6786e081717b5fd9eda7cacb409e2cd8ea43c1e))
* add expandable advanced options section ([ed5f55d](https://github.com/jsell-rh/cc-leaderboard/commit/ed5f55d3e0e78f55647f266006134cbcecb7b29b))
* add user dropdown menu and fix footer positioning ([c64d59b](https://github.com/jsell-rh/cc-leaderboard/commit/c64d59b491f39f66ac9f605f9b0250ee563799b9))
* Complete glassmorphic UI rebuild for leaderboard and settings pages ([9bde7fb](https://github.com/jsell-rh/cc-leaderboard/commit/9bde7fba1277d120e218cba8e15633e99e6c0bb2))
* Display dynamic API URL in CLI setup commands ([6e81f4f](https://github.com/jsell-rh/cc-leaderboard/commit/6e81f4f0185a59f50f301096eb98cfbf00e552ec))
* Display OAuth URL in CLI login command ([e94b9f1](https://github.com/jsell-rh/cc-leaderboard/commit/e94b9f12b7483af668adb3ce0aa949abd9bab505))
* Redesign onboarding UX to be more action-oriented ([6d0a426](https://github.com/jsell-rh/cc-leaderboard/commit/6d0a4260a57013858085f22618eac2f96d9c2dff))
* require authentication to view leaderboard ([3a48ca1](https://github.com/jsell-rh/cc-leaderboard/commit/3a48ca114f451f5928baeaf3bb3818fd536ddf65))
* Set up database migrations with Drizzle Kit ([3b6c733](https://github.com/jsell-rh/cc-leaderboard/commit/3b6c733b7d2c7f72178795ab9a957e52978fcdf7))


### BREAKING CHANGES

* Releases now happen automatically on push to main instead of manual tagging

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
