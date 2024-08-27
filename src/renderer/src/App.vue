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
  .k-lib-dialog {
    background-color: #005a9e;
    color: white;
    font-size: 17px;
    border-radius: 0;
    padding: 10px 12px 0 12px;
    .el-dialog__header {
      padding-bottom: 14px;
      .el-icon {
        $icon-size: 21px;
        height: $icon-size;
        width: $icon-size;
        margin-right: 4px;
        vertical-align: text-bottom;
        svg {
          height: $icon-size;
          width: $icon-size;
        }
      }
      >.el-icon {
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        svg {
          animation: rotate 1s infinite;
        }
      }
      >button {
        top: calc(50% - 24px);
        .el-dialog__close {
          color: white;
        }
        &:hover {
          .el-dialog__close {
            color: #b1b1b1;
          }
        }
      }
      >.el-progress {
        margin-top: 8px;
        flex-direction: row-reverse;
        .el-progress-bar__outer {
          background-color: transparent;
          border-radius: 0;
          .el-progress-bar__inner {
            background-color: white;
            border-radius: 0;
          }
        }
        .el-progress__text {
          margin: 0 8px 0 0;
          min-width: fit-content;
          color: white;
        }
      }
    }
  }
}
</style>
