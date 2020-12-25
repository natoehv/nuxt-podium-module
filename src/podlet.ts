import Podlet from '@podium/podlet';
export interface podletOptions {
  name: string;
  version: string;
  pathname: string;
  manifest?: string;
  development?: boolean;
}
export default (options: podletOptions) => new Podlet(options);
