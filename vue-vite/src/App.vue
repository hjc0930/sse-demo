<script setup>
import { onBeforeMount, reactive } from "vue";

const sourceData = reactive({
  message: null, //message返回值
  customEvents: null, //customEvents返回值
  source: null, //SSE实例
});

onBeforeMount(() => {
  init();
});

const init = () => {
  sourceData.source = new EventSource("http://localhost:8081/sse");

  sourceData.source.addEventListener("message", () => {
    const data = JSON.parse(res.data);
    sourceData.message = data;
  });
  // sourceData.source.onmessage = (res) => {
  //   const data = JSON.parse(res.data);
  //   sourceData.message = data;
  // };

  sourceData.source.addEventListener("demoEvent", (res) => {
    const data = JSON.parse(res.data);

    sourceData.customEvents = data;
  });
};

const close = () => {
  sourceData.source.close();
};
</script>

<template>
  <div>
    <h1>testSSE: <button @click="close">关闭</button></h1>
    <h2>默认事件Message返回值：{{ sourceData.message }}</h2>
    <h2>自定义事件customEvents返回值：{{ sourceData.customEvents }}</h2>
  </div>
</template>
