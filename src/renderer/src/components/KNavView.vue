<template>
  <div class="KNavView">
    <KNavBar />
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.KNavView {
  width: 100%;
  display: flex;
  >div:last-child {
    width: 0;
    flex: 1;
  }
}
</style>
