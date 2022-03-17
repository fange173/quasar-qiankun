<template>
  <div>
    <q-btn color="primary" icon="check" label="OK" />
    <p v-for="n in 15" :key="n">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a
      adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos
      numquam rerum delectus commodi perferendis voluptate?
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    return {};
  },
});
</script>
