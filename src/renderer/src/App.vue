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
    padding: 10px 0px 12px 12px;
    $btn-width: 30px;
    $close-right: 10px;
    .el-dialog__header {
      padding-bottom: 0;
      padding-right: $btn-width + $close-right;
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
      .select {
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
        .el-progress {
          margin-top: 8px;
          margin-right: $close-right;
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
      .no-select {
        display: flex;
        >div {
          >div {
            &:first-child {
              margin-bottom: 5px;
              display: flex;
              >span {
                &:first-of-type {
                  margin-right: 6px;
                }
                &:last-of-type {
                  flex: 1;
                }
              }
            }
            &:last-child {
              display: flex;
              align-items: center;
              column-gap: 6px;
              >span {
                margin-left: 25px;
              }
              .el-select {
                width: 100px;
                .el-select__wrapper {
                  box-shadow: none;
                }
              }
            }
          }
        }
        >button {
          align-self: center;
          margin-left: auto;
          height: 48px;
          width: $btn-width;
          padding: 0;
          border: none;
          background-color: transparent !important;
          color: white;
          &:hover {
            color: #b1b1b1;
            cursor: pointer;
          }
          .el-icon {
            top: calc(50% - 23.5px);
          }
        }
      }
      // 关闭按钮
      >button {
        top: calc(50% - 24px);
        margin-right: $close-right;
        width: $btn-width;
        .el-dialog__close {
          color: white;
        }
        &:hover {
          .el-dialog__close {
            color: #b1b1b1;
          }
        }
      }
    }
  }
}
</style>
