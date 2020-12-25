import path from 'path';
import { Module } from '@nuxt/types';
import podiumMiddleware from './middleware';
import manifest from './manifest';
import generatePodlet, { podletOptions } from './podlet';
import render from './render';

interface Options {
  podletOptions: podletOptions;
}

const podium: Module<Options> = function (options) {
  const podlet = generatePodlet(options.podletOptions);

  let podiumCSS: string[] = [];
  let podiumJS: string[] = [];
  /**
   * Used to rename local template
   */
  this.nuxt.hook('render:before', (nuxt: any) => {
    nuxt.options.appTemplatePath = path.resolve(__dirname, 'podium.template.html');
  });

  this.nuxt.hook('render:route', (_url: any, result: any, { res }: any) => {
    const incoming = res.locals.podium || {};
    result.html = render({ incoming, html: result.html, podlet });
  });

  this.nuxt.hook('render:resourcesLoaded', ({ clientManifest } : any) => {
    if (clientManifest) {
      const { all, publicPath } = clientManifest;
      const filter = (type: string) => (asset: string) => asset.split('.')[asset.split('.').length - 1] === type;
      const filterInto = (compare: string[]) => (asset: string) => !compare.find(val => val === asset);
      const filteredJS = all.filter(filter('js')).filter(filterInto(podiumJS));
      const filteredCSS = all.filter(filter('css')).filter(filterInto(podiumCSS));
      podiumJS = Object.assign(podiumJS, filteredJS);
      podiumCSS = Object.assign(podiumCSS, filteredCSS);
      podlet.js(filteredJS.map((asset: string) => ({
        value: publicPath + asset,
        defer: true
      })));
      podlet.css(filteredCSS.map((asset: string) => ({
        value: publicPath + asset
      })));
    }
  });

  this.addServerMiddleware(podiumMiddleware({ podlet, options: this.options }));
  this.addServerMiddleware(manifest(podlet));
};

export default podium;

export const meta = require('./package.json');
