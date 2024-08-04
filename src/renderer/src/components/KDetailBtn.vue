<template>
  <div class="KDetailBtn">
    <button>
      <el-image :src="picURL" v-show="showPic" fit="cover">
        <template #error>
          <div class="ImgFail">
            <svg viewBox="0 0 1024 1024">
              <path d="M875.008 295.424a34.133333 34.133333 0 1 0-58.197333 35.669333c35.328 57.514667 53.930667 123.562667 53.930666 191.488 0 201.898667-164.352 366.250667-366.250666 366.250667S138.24 724.48 138.24 522.581333 302.592 156.330667 504.490667 156.330667c18.773333 0 34.133333-15.36 34.133333-34.133334s-15.36-34.133333-34.133333-34.133333C264.874667 88.064 69.973333 282.965333 69.973333 522.581333s194.901333 434.517333 434.517334 434.517334 434.517333-194.901333 434.517333-434.517334c0.170667-80.384-22.016-159.061333-64-227.157333z"/>
              <path d="M501.248 389.973333c-77.653333 0-140.8 63.146667-140.8 140.8s63.146667 140.8 140.8 140.8 140.8-63.146667 140.8-140.8V224.256c0-19.456 15.872-35.328 35.328-35.328 19.456 0 35.328 15.872 35.328 35.328 0 18.773333 15.36 34.133333 34.133333 34.133333s34.133333-15.36 34.133334-34.133333c0-57.173333-46.421333-103.594667-103.594667-103.594667s-103.594667 46.421333-103.594667 103.594667v186.026667a140.526933 140.526933 0 0 0-72.533333-20.309334z m0 213.333334a72.704 72.704 0 0 1-72.533333-72.533334 72.704 72.704 0 0 1 72.533333-72.533333 72.704 72.704 0 0 1 72.533333 72.533333 72.704 72.704 0 0 1-72.533333 72.533334z"/>
            </svg>
          </div>
        </template>
      </el-image>
      <div class="Info">
        <span>{{ title }}</span>
        <span>{{ artist }}</span>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'KDetailBtn',
  props: {
    title: String,
    artist: String,
    picURL: String,
    showPic: Boolean
  },
  setup(props) {
    const title = computed(() => props.title || '')
    const artist = computed(() => props.artist || '')
    const picURL = computed(() => props.picURL || '')
    const showPic = computed(() => props.showPic)
    return { title, artist, picURL, showPic }
  }
})
</script>

<style scoped lang="scss">
$btnHeight: 90px;
$marginWidth: 12px;
.KDetailBtn {
  max-width: 100%;
  height: $btnHeight;
  width: fit-content;
  background-color: transparent;
  &:hover {
    background-color: #00000030;
  }
  &:active {
    background-color: #00000050;
  }
  &>button {
    height: 100%;
    max-width: calc(100% - $marginWidth);
    overflow: hidden;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0 $marginWidth 0 0;
    display: flex;
    align-items: center;
    .el-image {
      width: $btnHeight;
      height: $btnHeight;
      .ImgFail {
        height: 100%;
        background-color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          height: 30px;
          fill: #616161;
        }
      }
    }
    .Info {
      height: 100%;
      width: calc(100% - $btnHeight - $marginWidth);
      margin: 0 0 0 $marginWidth;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      span {
        @mixin text($size, $weight) {
          font-size: $size;
          font-weight: $weight;
          color: white;
          min-width: max-content;
        }
        &:first-child {
          @include text(17.5px, 100);
        }
        &:last-child {
          @include text(15px, 600);
        }
      }
    }
  }
}
</style>
