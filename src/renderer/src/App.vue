<template>
  <router-view />
</template>

<style lang="scss">
html, body {
  height: 100%;
  * {
    margin: 0px;
  }
  #kApp {
    height: 100%;
    font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  .k-popper {
    border-radius: 0;
    .el-select-dropdown__item {
      color: #000;
      &.is-selected {
        color: #0078d7;
      }
    }
    .el-dropdown-menu__item {
      color: #000;
      &:hover {
        color: #0078d7;
      }
    }
  }
}
</style>
