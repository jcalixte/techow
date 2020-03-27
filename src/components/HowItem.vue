<template>
  <div class="how-item">
    <md-field class="field">
      <md-input v-model="newHowItem" />
    </md-field>
    <md-button
      class="md-icon-button md-raised"
      @click="removeNewHowItem(index)"
    >
      <md-icon>remove</md-icon>
    </md-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { debounce } from 'lodash-es'

@Component
export default class HowItem extends Vue {
  @Prop()
  private index!: number
  @Getter
  private newHowItems!: string[]
  @Action
  private setNewHowItem!: (props: { newHowItem: string; index: number }) => void
  @Action
  private removeNewHowItem!: (index: number) => void

  private updateNewHow = debounce(
    (home: HowItem, newHowItem: string) =>
      home.setNewHowItem({ newHowItem, index: this.index }),
    250
  )

  private get newHowItem() {
    return this.newHowItems[this.index]
  }
  private set newHowItem(item: string) {
    this.updateNewHow(this, item)
  }
}
</script>

<style scoped lang="scss">
.how-item {
  display: flex;
  max-width: 600px;
  margin: auto;
}
</style>
