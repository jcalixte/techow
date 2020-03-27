<template>
  <div class="home">
    <button
      class="mdc-button foo-button"
      v-if="!isAuthenticated"
      @click="authenticate"
    >
      <div class="mdc-button__ripple"></div>
      <span class="mdc-button__label">se connecter</span>
    </button>
    <SelectBoard v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { trelloService } from '@/services/trello.service'

@Component({
  components: {
    SelectBoard: () => import('@/components/SelectBoard.vue')
  }
})
export default class Home extends Vue {
  private isAuthenticated = trelloService.isAuthenticated

  private authenticate() {
    trelloService.askPermission()
  }
}
</script>
