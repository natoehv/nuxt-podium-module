import path from 'path';
import Podlet from '@podium/podlet';

const before = (podlet: Podlet) => (nuxt: any) => {
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
};

export {
  before
};
