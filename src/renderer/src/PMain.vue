<template>
  <div class="PMain">
    <KTitleBar />
    <KNavBar />
    <RouterView class="PCurrent"/>
    <PDetail />
    <KDrawerBar />
    <KMusicBar />
    <KTooltip />
  </div>
</template>

<style scoped lang="scss">
@use '@renderer/assets/var' as *;
@use '@renderer/assets/style' as *;
.PMain {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: $title-hei calc(100% - $title-hei - $music-hei) $music-hei;
  grid-template-columns: min-content 1fr 0;
  >.KTitleBar  { @include k-grid-item("1 / 2", "1 / 4"); }
  >.KNavBar    { @include k-grid-item("2 / 3", "1 / 2"); }
  >.PCurrent   { @include k-grid-item("2 / 3", "2 / 3"); }
  >.PDetail    { @include k-grid-item("1 / 3", "1 / 3"); }
  >.KDrawerBar { @include k-grid-item("2 / 3", "3 / 4"); }
  >.KMusicBar  { @include k-grid-item("3 / 4", "1 / 4"); }
}
</style>

<style lang="scss">
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
