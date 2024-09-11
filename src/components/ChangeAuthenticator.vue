<template>
  <div>
    <h2 class="title">{{ $t('2fa.CHANGE_AUTH_TITLE') }}</h2>
    <p class="subtitle">{{ $t('2fa.CHANGE_AUTH_DESCRIPTION') }}</p>

    <div class="custom-card mt-1">
      <figure class="image" v-if="qrCode">
        <img v-bind:src="qrCode" :alt="$t('2fa.QR_CODE')" />
      </figure>
      <p style="margin-top: 10px">{{ $t('2fa.CHANGE_AUTH_SECRET') }}:</p>
      <p><b>{{ secret }}</b></p>
    </div>
    <div class="mt-1">
      {{ $t('2fa.NEED_AUTHENTICATOR_HELP') }}
    </div>
    <div>
      {{ $t('2fa.CAN_USE') }}
      <a href="https://authy.com/download/" target="_blank" class="login-router">Authy</a>
      {{ $t('2fa.NEED_AUTHENTICATOR_OR') }}
      <a
        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
        target="_blank"
        class="login-router"
        >Google Authenticator</a
      >.
    </div>

    <div class="field">
      <label class="label">{{ $t('2fa.AUTH_CODE') }}</label>

      <div class="control">
        <input
          data-cy="2faAuthenticatorCode"
          type="string"
          inputmode="numeric"
          class="input"
          v-model="authenticatorCode"
          :placeholder="$t('2fa.ENTER_APP_CODE')"
          @keypress="handleKeyPress"
        />
      </div>
    </div>

    <div class="error" v-if="logonError">
      <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span data-cy="2faAuthenticatorError" v-html="logonError"></span></p>
    </div>

    <button
      data-cy="confirm2faButton"
      @click="setCode()"
      class="button is-green big-button is-login transition-faster mt-5"
      :disabled="!authenticatorCode"
    >
      <span class="text">{{ $t('common.SUBMIT') }}</span>
    </button>

  </div>
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { verifyAuthenticatorCode } from '@/utils/backupRestore'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  mixins: [Authenticated, Global],
  data() {
    return {
      authenticatorCode: '',
      logonError: ''
    }
  },
  methods: {
    async setCode() {
      const isCodeValid = await this.confirmAuthenticator()
      if (isCodeValid) this.$emit('setCode', this.authenticatorCode)
      else  this.$emit('setCode', null)
    },
    pageBack() {
      this.$emit('pageBack')
    },
    async confirmAuthenticator() {
      const confirmCode = await verifyAuthenticatorCode(
        this.store.fetch_key || this.store.email,
        String(this.authenticatorCode)
      )

      if (confirmCode.success) {
        this.logonError = ''
        return true
      } else {
        this.logonError = getDictionaryValue(confirmCode.error)
        return false
      }
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        this.setCode()
      }
    },
    authenticatorCodeChanged() {
      if (this.authenticatorCode.length === 6) {
        this.setCode()
      }
    }
  },
  props: {
    qrCode: {
      type: String
    },
    secret: {
      type: String
    }
  },
  watch: {
    authenticatorCode: [
      {
        handler: 'authenticatorCodeChanged'
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.image {
  img {
    width: 140px;
    height: 140px;
    margin: -10px auto;
  }
}
</style>
