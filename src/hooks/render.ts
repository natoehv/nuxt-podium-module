import Podlet from '@podium/podlet';
import render from '../render';

type RouteOptions = {
  podlet: Podlet,
  sandbox: any
}

const route = ({podlet, sandbox}: RouteOptions) => (_url: any, result: any, { res }: any) => {
  const incoming = res.locals.podium || {};
  result.html = render({ incoming, html: result.html, podlet, sandbox });
};

let podiumCSS: string[] = [];
let podiumJS: string[] = [];

const resourcesLoaded = (podlet: Podlet) => ({ clientManifest } : any) => {
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
};

export {
  route,
  resourcesLoaded
};
