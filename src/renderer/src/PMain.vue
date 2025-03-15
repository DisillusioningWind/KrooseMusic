<template>
  <div class="PMain">
    <KTitleBar />
    <KNavBar />
    <RouterView class="KMainView"/>
    <PDetail />
    <KDrawerBar />
    <KMusicBar />
  </div>
</template>

<style scoped lang="scss">
@use '@renderer/assets/style';

.PMain {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 30px calc(100% - 152px) 122px;
  grid-template-columns: min-content 1fr 0;
  >.KTitleBar   { @include style.k-grid-item("1 / 2", "1 / 4"); }
  >.KNavBar     { @include style.k-grid-item("2 / 3", "1 / 2"); }
  >.KMainView   { @include style.k-grid-item("2 / 3", "2 / 3"); }
  >.PDetail     { @include style.k-grid-item("1 / 3", "1 / 3"); }
  >.KDrawerBar  { @include style.k-grid-item("2 / 3", "3 / 4"); }
  >.KMusicBar   { @include style.k-grid-item("3 / 4", "1 / 4"); }
}
</style>

<style lang="scss">
// 设置全局样式
html, body, #app {
  height: 100%;
  font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
