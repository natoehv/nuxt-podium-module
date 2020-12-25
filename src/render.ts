import Podlet from '@podium/podlet';

type renderParams = {
  podlet: Podlet;
  html: string;
  incoming: any;
}

const removeScript = (html: string = '') => {
  const str = /<script [^>]*>((.|[\n\r])*)<\/script>/i;
  const matched = html.match(str);
  const scripts = (matched && matched[0]) || '';
  return html.replace(scripts, '');
};

export default ({ podlet, html, incoming }: renderParams) => {
  const bodyLessScript = removeScript(html);
  return podlet.render(incoming, bodyLessScript);
};
