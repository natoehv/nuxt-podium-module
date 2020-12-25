import Podlet from '@podium/podlet';

export default (podlet: Podlet) => ({
  path: podlet.manifest(),
  handler: (_req: any, res: any) => {
    res.write(JSON.stringify(podlet));
    res.end();
  }
});
