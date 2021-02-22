import { Module } from '@nuxt/types';
import podiumMiddleware from './middleware';
import manifest from './manifest';
import generatePodlet, { podletOptions } from './podlet';
import * as buildHooks from './hooks/build';
import * as renderHooks from './hooks/render';

interface Options {
  podletOptions: podletOptions;
}

const podium: Module<Options> = function (options) {
  const podlet = generatePodlet(options.podletOptions);

  /**
   * Used to rename local template
   */
  this.nuxt.hook('build:before', buildHooks.before(podlet));

  this.nuxt.hook('render:route', renderHooks.route(podlet));

  this.nuxt.hook('render:resourcesLoaded', renderHooks.resourcesLoaded(podlet));

  this.addServerMiddleware(podiumMiddleware({ podlet, options: this.options }));
  this.addServerMiddleware(manifest(podlet));
};

export default podium;

export const meta = require('../package.json');
