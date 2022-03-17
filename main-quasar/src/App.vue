<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>

        <q-toolbar-title> Qiankun 父应用 </q-toolbar-title>

        <q-btn flat round dense icon="whatshot" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="text-center">
          <q-btn color="primary" label="Quasar 子应用" @click="shQuasar" :disabled="showQuasar"></q-btn>
          <q-btn color="green" label="Vue 子应用" @click="shVue" class="q-ml-md" :disabled="showVue"></q-btn>
        </div>
        <div id="quasar" v-if="showQuasar"></div>
        <div id="vue" v-if="showVue"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { loadMicroApp, start, initGlobalState } from 'qiankun';
import { defineComponent, onBeforeUnmount, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    let actions;
    const showQuasar = ref(false);
    const showVue = ref(false);

    const shQuasar = () => {
      if (showVue.value)
        window.qiankunStarted = false;
      showQuasar.value = true;
      showVue.value = false;

      const initState = {};
      // action用来和子应用通信,每次mounted的时候都要初始化一遍
      actions = initGlobalState(initState);
      if (window.qiankunStarted === undefined) window.qiankunStarted = false;
      if (!window.qiankunStarted) {
        // 只需注册一次子应用
        window.qiankunStarted = true;
        // 注册子应用
        loadMicroApp({
          name: 'quasar', // app的名称
          entry: 'http://localhost:8000', // 加载子应用的入口url  如果是编译后部署，则这里应该为编译后的子应用访问地址，比如'./micro-workbench-dist/index.html'
          container: '#quasar', // 对应template中的<div id="quasar"></div>
          // props: {
          //   token: 'xx', // 向子应用传递的数据
          // },
        });
        start(); // 启动qiankun
      }
    };

    const shVue = () => {
      if (showQuasar.value)
        window.qiankunStarted = false;
      showQuasar.value = false;
      showVue.value = true;

      const initState = {};
      // action用来和子应用通信,每次mounted的时候都要初始化一遍
      actions = initGlobalState(initState);
      if (window.qiankunStarted === undefined) window.qiankunStarted = false;
      if (!window.qiankunStarted) {
        // 只需注册一次子应用
        window.qiankunStarted = true;
        // 注册子应用
        loadMicroApp({
          name: 'vue-cli-qiankun-sub', // app的名称
          entry: 'http://localhost:3344', // 加载子应用的入口url  如果是编译后部署，则这里应该为编译后的子应用访问地址，比如'./micro-workbench-dist/index.html'
          container: '#vue', // 对应template中的<div id="quasar"></div>
          // props: {
          //   token: 'xx', // 向子应用传递的数据
          // },
        });
        start(); // 启动qiankun
      }
    };

    onBeforeUnmount(() => {
      // 组件销毁的时候不要忘了offGlobalStateChange.否则会出现监听不到数据的情况
      // eslint-disable-next-line
      if (actions && actions.offGlobalStateChange) {
        // eslint-disable-next-line
        actions.offGlobalStateChange();
      }
    });

    return { showQuasar, showVue, shQuasar, shVue };
  },
});
</script>
