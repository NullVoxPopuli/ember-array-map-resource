import EmberRouter from '@ember/routing/router';

import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('regular-arrays', function () {
    this.route('object-identity');
    this.route('keyed');
  });

  this.route('use-array-map', function () {
    this.route('object-identity');
    this.route('keyed');
  });
});
