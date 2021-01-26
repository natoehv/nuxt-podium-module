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
  this.nuxt.hook('build:before', (nuxt: any) => {
    nuxt.options.appTemplatePath = path.resolve(__dirname, 'podium.template.html');
    const skip = asset => ({
      ...asset,
      skip: true
    });
    if (nuxt.options.head) {
      const js = nuxt.options.head.script || [];
      podlet.js(js.map(asset => ({
        value: asset.src,
        type: asset.type || 'default',
        nomodule: asset.nomodule
      })));
      nuxt.options.head.script = js.map(skip);
      const css = nuxt.options.head.link || [];
      podlet.css(css.map(asset => ({
        value: asset.href,
        rel: asset.rel || 'stylesheet'
      })));
      nuxt.options.head.link = css.map(skip);
    }
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

export const meta = require('../package.json');
