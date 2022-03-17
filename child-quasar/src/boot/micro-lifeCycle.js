import { boot } from 'quasar/wrappers';
// 重要:由于需要在mount的时候需要重新实例化app(即 new Vue),但是quasar应用不是通过new Vue()实现的,而是调用.quasar/client-entry.js内的方法,所以根据.quasar/*新建了src/quasar-init/*
// src/quasar-init/*的内容和./quasar/*的内容几乎是一致的,区别:src/quasar-init/client-entry导出了init方法
import { init } from 'src/quasar-init/client-entry';
// import * as Types from 'src/store/consts';

// 如果该应用是作为子应用运行
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__; // 参考:https://qiankun.umijs.org/zh/faq#a-%E4%BD%BF%E7%94%A8-webpack-%E8%BF%90%E8%A1%8C%E6%97%B6-publicpath-%E9%85%8D%E7%BD%AE
  render();
}

window.zwfw_new = {
  bootstrap: props => {
    // eslint-disable-next-line no-console
    console.log('子应用初始化', props);
    return Promise.resolve(props);
  },
  mount: props => {
    // eslint-disable-next-line no-console
    console.log('子应用挂载', props);
    return Promise.resolve(props);
  },
  unmount: props => {
    // eslint-disable-next-line no-console
    console.log('子应用卸载', props);
    return Promise.resolve(props);
  },
};

class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: () => {},
    setGlobalState: () => {},
  };
  /**
   * 设置 actions
   */
  setActions(actions) {
    this.actions = actions;
  }
  /**
   * 映射
   */
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }
  /**
   * 映射
   */
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();

// render第一次和第二次被调用是: if (window.__POWERED_BY_QIANKUN__) { render(); }, // props为{}
// 后面被调用是微前端生命周期钩子的mount: async function mount(props) {render(props);} // props不再事空对象,有container属性和值
function render(props = {}) {
  const { container } = props; // props来自父应用,container是注册子前端时,设置的container
  // container有值,表示子应用找到落脚点了,需要重新初始化;
  // init方法相当于执行了一遍./quasar/client-entry.js
  if (container) {
    init();
    // action的作用：和主应用通信
    actions.setActions(props);
    actions.onGlobalStateChange(state => {
      const { xxx } = state;
      // todo something
    }, true);
  }
}

async function bootstrap() {
  console.log('vue app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
async function mount(props) {
  console.log('vue app mount');
  render(props); // 相当于new Vue
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
async function unmount() {
  console.log('vue app unmount');
  if (window._POINT_STORE_APP_INSTANCE) {
    window._POINT_STORE_APP_INSTANCE.unmount(); // 一定要卸载
  }
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
async function update(props) {
  console.log('update props', props);
}

export default boot(({ app, store }) => {
  // 如果有实例,unmount
  if (window._POINT_STORE_APP_INSTANCE) {
    window._POINT_STORE_APP_INSTANCE.unmount();
  }
  window._POINT_STORE_APP_INSTANCE = app;
  window._POINT_STORE_STORE = store; // store保存到window下,如果有用到store的话
});

export { bootstrap, mount, unmount, update };
