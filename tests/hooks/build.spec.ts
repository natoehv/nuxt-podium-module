var path = require('path');
import * as build from '../../src/hooks/build';

describe('build', () => {
  const podletMock: any = {
    js: jest.fn(),
    css: jest.fn(),
  }

  const nuxtMock = {
    options: {
      appTemplatePath: 'mock_template',
    }
  }
  describe(':before', () => {
    afterEach(() => {
      podletMock.js.mockClear();
      podletMock.css.mockClear();
    });
    test('appTemplatePath should have the podium template path', () => {
      const beforeHook = build.before(podletMock);
      beforeHook(nuxtMock);
      const relativePath = path.relative('nuxt-podium-module', nuxtMock.options.appTemplatePath);
  
      expect(relativePath).toEqual('../src/podium.template.html');
    });

    test('should inject to podium scripts', () => {
      const head = {
        script: [
          {
            src: 'test',
            type: 'module',
            nomodule: false,
          }
        ]
      };
      const beforeHook = build.before(podletMock);
      const nuxtAssets = {...nuxtMock, options: {...nuxtMock.options, head}};
      beforeHook(nuxtAssets);
      
      expect(nuxtAssets.options.head.script).toMatchObject([
        {... head.script[0], skip: true}
      ]);
      expect(podletMock.js).toBeCalledWith([
        {
          value: 'test',
          type: 'module',
          nomodule: false,
        }
      ])
    });
  })
})