<template>
  <div>
    <spinner v-model="showSpinner" v-bind:status="status"></spinner>
    <div class="container">
      <spinner v-model="showSpinner" v-bind:status="status"></spinner>
      <h2 class="title">{{typedData ?  $t('transaction.SIGN_TYPED_DATA')  :  $t('transaction.SIGN_MESSAGE')  }}</h2>
      <p class="subtitle">{{typedData ?  $t('transaction.SIGN_DESCRIPTION_TYPED')  :  $t('transaction.SIGN_DESCRIPTION')  }}</p>


      <div class="field">
        <label class="label">{{ typedData ?  $t('transaction.SIGN_DATA_TYPED')  :  $t('transaction.SIGN_DATA')  }}</label>
        <div class="settings-data user-details">
          <div class="details" v-html="messageFormatted">
            
          </div>
        </div>
      </div>

      <button class="button is-green big-button is-login transition-faster mt-5" @click="sign()">
        <span class="text">{{ $t('common.SIGN') }}</span>
      </button>

      <button
        @click="cancel()"
        class="button is-ghost is-blue big-button medium-text transition-faster"
      >
        <span class="text">{{ $t('common.CANCEL') }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { i18n } from '@/plugins/i18n'
import { hexToString, parseTransaction } from 'viem';

import { defineComponent } from 'vue'

export default defineComponent({
  mixins: [ Global],

  methods: {
    sign() {
      this.store.signResponse = 'confirm'
      this.$router.push('/').catch(() => undefined)
    },
    cancel() {
      this.store.signResponse = 'cancel'
      this.$router.push('/').catch(() => undefined)
    },
    formatMessage() {
      let message = this.store.messageDetails
      if ( message.includes('{')) {

        try {
          this.typedData = true
          let jObject = JSON.parse( message)
            if (jObject.message) {
            let mObject = jObject.message
            let keys = Object.keys(mObject)

            let msg = '';
            msg += `<b>${i18n.t('transaction.DOMAIN').toString()}:</b>&nbsp;${jObject.domain.name}<br>`
            msg += `<b>${i18n.t('transaction.CONTRACT').toString()}:</b>&nbsp;${jObject.domain.verifyingContract}<br><br>`            

            keys.forEach(key => {
              msg += `<b>${key}:</b>&nbsp;${mObject[key]}<br>`
            })


            this.messageFormatted = msg
          } else {
            this.messageFormatted = this.store.messageDetails
          }
        } catch (err) {
          this.messageFormatted = this.store.messageDetails
        }
      } else {

        if (message.includes('0x')) {
          try {
            let msg = hexToString(message)

            msg = msg.replace(/\n/g, '<br>')

            this.messageFormatted = msg

          } catch(err) {
            this.messageFormatted = message
          }

        } else {
          this.messageFormatted = message
        }
        

        
      }
      
      
    },
    messageUpdated() {
      this.formatMessage()
}
  },
  async mounted() {
    this.formatMessage()
  },
  data() {
    return {
      messageFormatted: '',
      typedData: false
    }
  },
  watch: {
    'store.messageDetails': [
      {
        handler: 'messageUpdated'
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.details {
  overflow-wrap: break-word;
}
.card {
  padding: 20px;
  border-radius: 10px;
  background: #f9f9f9;
  display: flex;
  padding: 10px 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 195, 134, 0.1);
  border: 1px solid #00c386;
  box-shadow:
    0 1px 2px 0 rgb(0 195 134 / 20%),
    0 5px 12px 0 rgb(0 0 0 / 10%);
  position: relative;
  z-index: 1;
}
</style>
