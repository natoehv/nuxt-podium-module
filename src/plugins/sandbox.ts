import { MessageBus } from '@podium/browser';
export const Prop = ({ type = 'string'}): any => {
  return (target: any, propName: any) => {
      const attrName = camelToKebab(propName);
      function get() {
          switch(type) {
            case 'string': 
              return this.getAttribute(attrName);
            case 'array':
              try {
                return JSON.parse(this.getAttribute(attrName));
              } catch (e) {
                return [];
              }
            default:
              return this.getAttribute(attrName);
          }
      }

      function set(value: any) {
          if (typeof value === 'undefined') {
              this.removeAttribute(attrName);
          } else {
              this.setAttributte(attrName, value);
          }
      }
      Object.defineProperty(target, propName, { get, set });
  };
};

export const Element = (): any => {
  return (target: any, elementName: any) => {
      const attrName = camelToKebab(elementName);
      function get() {
          return this.querySelector('#' + attrName);
      }
      Object.defineProperty(target, elementName, { get });
  };
};

const camelToKebab = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

class SandBox extends HTMLElement {
  @Prop({type: 'array'})
  private events: any[];
  @Element()
  private buttonShow: HTMLElement;
  @Element()
  private eventForm: HTMLElement;
  @Element()
  private channel: HTMLInputElement;
  @Element()
  private topic: HTMLInputElement;
  @Element()
  private payload: HTMLInputElement;
  @Element()
  private send: HTMLElement;

  constructor() {
    super();
    this.consumeEvents(this.events);
    this.refresh();
    this.buttonShow.addEventListener('click', () => {
      if (this.eventForm.style.display === '') {
        this.eventForm.style.display = 'none';
        this.buttonShow.innerHTML = '+';
      } else {
        this.eventForm.style.display = '';
        this.buttonShow.innerHTML = '-';
      }
    })
    this.send.addEventListener('click', () => {
      const channel = this.channel.value;
      const topic = this.topic.value;
      let payload;
      try {
        payload = JSON.parse(this.payload.value);
      } catch {
        payload = this.payload.value;
      }

      const messageBus = new MessageBus();
      messageBus.publish(channel, topic, payload);
    });
  }

  private consumeEvents(events: any[]) {
    const messageBus = new MessageBus();
    console.log({events});
    events.forEach(({channel, topic, payload}) => {
      console.log('sending', {channel, topic, payload});
      messageBus.publish(channel, topic, payload);
    });
  }

  public render(): string {
    return `${this.template}
            ${this.cssStyle}
            `;
  }

  get cssStyle(): string {
    return `
      <style>
        .podium-sandbox {
          background: rgba(74, 74, 74, 0.8);
          position: fixed;
          bottom: 0;
          right: 0;
        }
        .podium-sandbox__form {
          display: flex;
          flex-wrap: wrap;
        }
        .podium-sandbox__input {
          width: 46%;
          height: 25px;
          line-height: 25px;
          margin: 5px;
        }
        .podium-sandbox__area-text {
          width: 100%;
          margin: 5px;
        }
        .podium-sandbox__form-send {
          height: 42px;
          margin: 5px;
        }
        .podium-sandbox__form-send {
          width: 100%;
        }
      </style>
    `;
  }

  get template(): string {
    return `
      <div class="podium-sandbox">
        <button id="button-show">+</button>
        ${this.form}
      </div>`;
  }

  get form(): string {
    return `<div id="event-form" class="podium-sandbox__form" style="display: none">
      <input class="podium-sandbox__input" id="channel" placeholder="channel"/>
      <input class="podium-sandbox__input" id="topic" placeholder="topic"/>
      <textarea class="podium-sandbox__area-text" id="payload" rows="4" cols="50" placeholder="payload"></textarea>
      <button class="podium-sandbox__form-send" id="send">send</button>
    </div>`;
  }

  public refresh() {
    this.innerHTML = this.render();
  }

  public attributeChangedCallback(attr: string, oldValue: any, newValue: any) {
    this.refresh();
  }
}

customElements.define('podium-sandbox', SandBox);
