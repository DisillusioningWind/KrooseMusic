<template>
  <div class="PMain">
    <KTitleBar />
    <KNavBar />
    <RouterView class="KMainPage"/>
    <PDetail />
    <KListDrawer />
    <KMusicBar />
  </div>
</template>

<style scoped lang="scss">
@mixin k-grid($row, $col) {
  grid-row: #{$row};
  grid-column: #{$col};
}

.PMain {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 30px calc(100% - 152px) 122px;
  grid-template-columns: min-content 1fr 0;
  >.KTitleBar   { @include k-grid("1 / 2", "1 / 4"); }
  >.KNavBar     { @include k-grid("2 / 3", "1 / 2"); }
  >.KMainPage   { @include k-grid("2 / 3", "2 / 3"); }
  >.PDetail     { @include k-grid("1 / 3", "1 / 3"); }
  >.KListDrawer { @include k-grid("2 / 3", "3 / 4"); }
  >.KMusicBar   { @include k-grid("3 / 4", "1 / 4"); }
}
</style>
