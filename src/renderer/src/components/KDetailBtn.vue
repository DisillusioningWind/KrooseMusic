<template>
  <div class="KDetailBtn">
    <KImage v-show="showPic" class="img" :url="picURL" />
    <div class="inf">
      <span class="title">{{ title }}</span>
      <span class="artist">{{ artist }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title?: string, artist?: string, picURL?: string, showPic?: boolean }>()
const title = computed(() => props.title || '')
const artist = computed(() => props.artist || '')
const picURL = computed(() => props.picURL || '')
const showPic = computed(() => props.showPic)
</script>

<style scoped lang="scss">
$btn-height: 90px;
$margin-width: 12px;
@mixin k-text($size, $weight) {
  font-size: $size;
  font-weight: $weight;
  color: white;
  white-space: nowrap;
}

.KDetailBtn {
  height: $btn-height;
  width: min-content;
  max-width: 100%;
  user-select: none;
  display: flex;
  &:hover { background-color: #00000030; }
  &:active { background-color: #00000050; }
  .img {
    flex-shrink: 0;
    width: $btn-height;
  }
  .inf {
    margin: 0 $margin-width;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .title { @include k-text(17.5px, 100); }
    .artist { @include k-text(15px, 600); }
  }
}
</style>
