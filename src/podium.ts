import path from 'path';
import { Module } from '@nuxt/types';
import podiumMiddleware from './middleware';
import manifest from './manifest';
import generatePodlet, { podletOptions } from './podlet';
import * as buildHooks from './hooks/build';
import * as renderHooks from './hooks/render';

type SandboxEvent = {
  channel: string,
  topic: string,
  payload: unknown,
}

type SandboxOptions = {
  events: SandboxEvent[],
}

interface Options {
  podletOptions: podletOptions;
  sandbox: boolean | SandboxOptions;
}

const defaultPodletOptions: podletOptions = {
  name: 'generic',
  version: '0.0.0',
  pathname: '/',
  manifest: '/manifest.json',
  development: false,
}

const podium: Module<Options> = function (options) {
  const podletOptions = { ...defaultPodletOptions, ...options.podletOptions };
  const podlet = generatePodlet(podletOptions);

  const sandbox = options.sandbox || false

  /**
   * Used to rename local template
   */
  this.nuxt.hook('build:before', buildHooks.before(podlet));

  this.nuxt.hook('render:route', renderHooks.route({podlet, sandbox}));

  this.nuxt.hook('render:resourcesLoaded', renderHooks.resourcesLoaded(podlet));

  if (sandbox) {
    this.addPlugin({
      src: path.resolve(__dirname, './plugins/sandbox.js'),
      mode: 'client',
    })
  }

  this.addServerMiddleware(podiumMiddleware({ podlet, options: this.options }));
  this.addServerMiddleware(manifest(podlet));
};

export default podium;

export const meta = require('../package.json');
