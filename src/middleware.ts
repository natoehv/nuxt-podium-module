import Podlet from '@podium/podlet';
interface middlewareOptions {
  podlet: Podlet;
  options: any;
}
export default ({ podlet, options }: middlewareOptions) => ({
  prefix: false, // http-proxy-middleware uses req.originalUrl
  handler: async (req: any, res: any, next: any) => {
    const { head = {}, htmlAttrs = {} } = options;
    req.get = (str: string) => req[str] ? req[str] : '';
    await podlet.middleware()(req, res, next);
    const incoming = res.locals.podium;
    if (head.title) {
      incoming.view.title = head.title;
    }
    if (head.meta && head.meta.charset) {
      incoming.view.encoding = head.meta.charset;
    }
    if (htmlAttrs.lang) {
      incoming.context.locale = htmlAttrs.lang;
    }
  }
});
