import Podlet from '@podium/podlet';

type renderParams = {
  podlet: Podlet;
  html: string;
  incoming: any;
  sandbox: any;
}

const removeScript = (html: string = '') => {
  const str = /<script [^>]*>((.|[\n\r])*)<\/script>/i;
  const matched = html.match(str);
  const scripts = (matched && matched[0]) || '';
  return html.replace(scripts, '');
};

export default ({ podlet, html, incoming, sandbox }: renderParams) => {
  const bodyLessScript = removeScript(html);
  let sandboxHtml = '';
  if (sandbox && incoming.development) {
    const events = sandbox.events || [];
    sandboxHtml = `<podium-sandbox events='${JSON.stringify(events)}'></podium-sandbox>`;
  }
  return podlet.render(incoming, bodyLessScript + sandboxHtml);
};
