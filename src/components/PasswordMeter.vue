<template>
  <div class="progress-bar">
    <div class="item" :class="{'on': score > 0 }"></div>
    <div class="item" :class="{'on': score > 1 }"></div>
    <div class="item" :class="{'on': score > 2 }"></div>
    <div class="item" :class="{'on': score > 3 }"></div>
    <div class="item" :class="{'on': score > 4 }"></div>
  </div>
</template>

<script lang="ts">
import { Global } from '@/mixins/global'
import type { TypePasswordCheck } from '@/types/global-types';
import { defineComponent } from 'vue'
import type { PropType } from 'vue'


export default defineComponent({
  name: "PasswordMeter",
  mixins: [Global],

  data() {


    return {
      dropdownOpen: false,
    }
  },
  computed: {
    score() {
     if (!this.passwordChecks || Object.keys(this.passwordChecks).length == 0) {
      return 0
     }
     let score = 0
     let keys = Object.keys(this.passwordChecks)
     keys.forEach(key => {
      if (this.passwordChecks && (this.passwordChecks as any)[key].toUpperCase() == 'PASS') {
        score +=1;
      }
     })
     return score

    },
  },
  methods: {



  },
  props: {
    passwordChecks: {
      type: Object as PropType<TypePasswordCheck>
    }
  }
})
</script>

<style lang="scss" scoped>
.progress-bar {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 4px;
  margin-top: 2px;

  .item {
    height: 3px;
    flex: 1 0 0;
    background: #D9D9D9;
    border-radius: 2px;

  }

  .on {
    background:  #00C386;
  }


}

</style>
