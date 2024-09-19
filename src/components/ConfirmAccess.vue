<template>
  <div>
    <button @click="pageBack" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>
  
    
    <img src="@/assets/img/unlock-account.svg" :alt="$t('images.PASSWORD_IMAGE')" class="mt-1" />
    <h2 class="title">{{ $t('confirm.CONFIRM_ACCESS_TITLE') }}</h2>

    <p data-cy="confirmAccessTitle" v-if="!store.twoFaRequired.authenticator" class="subtitle">
      {{ $t('confirm.CONFIRM_ACCESS_DESCRIPTION') }}
    </p>
    <p data-cy="confirmAccessTitle" v-else class="subtitle">
      {{ $t('confirm.CONFIRM_ACCESS_DESCRIPTION_AUTHENTICATOR') }}
    </p>

    <div class="field">
      <label v-if="!store.twoFaRequired.authenticator" class="label">{{
        $t('2fa.VERIFICATION_CODE')
      }}</label>
      <label v-else class="label">{{ $t('2fa.AUTH_CODE') }}</label>

      <div class="control">
        <input
          data-cy="2faEmailCode"
          type="string"
          inputmode="numeric"
          class="input"
          v-model="authenticatorCode"
          @keypress="handleKeyPress"
        />
      </div>
    </div>

    <div class="error" v-if="logonError">
      <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span data-cy="passwordError" v-html="logonError"></span></p>
    </div>
    <button
      data-cy="confirmAccessButton"
      @click="accessConfirmed()"
      class="button is-green big-button is-login transition-faster mt-5"
      :disabled="!authenticatorCode || String(authenticatorCode).length != 6"
    >
      <span class="text">{{ $t('common.CONTINUE') }}</span>
    </button>

  </div>
  
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { sha256 } from '@/utils/cryptoFunctions'
import { verifyEmailCode, send2FAEmail, verifyAuthenticatorCode } from '@/utils/backupRestore'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  mixins: [Authenticated, Global],
  data() {
    return {
      walletPassword: '',
      logonError: '',
      authenticatorCode: '',
      initialized: false,
      confirmed: false
    }
  },
  async mounted() {
    try {
      send2FAEmail(this.store.walletEmail, this.store.fetch_key, 'ConfirmAccess')
        .then(() => {
          this.initialized = true
        })
        .catch((e) => {
          this.initialized = false
        })
    } catch (err) {
      console.log('init error', err)
    }
  },
  methods: {
    async accessConfirmed() {
      if (!this.authenticatorCode || String(this.authenticatorCode).length != 6) {
        return this.$emit('accessConfirmed', false)
      }
      let confirmCode
      if (this.store.twoFaRequired.authenticator) {
        confirmCode = await verifyAuthenticatorCode(
          this.store.fetch_key || this.store.email,
          String(this.authenticatorCode)
        )
      } else {
        confirmCode = await verifyEmailCode(
          this.store.fetch_key || this.store.email,
          String(this.authenticatorCode)
        )
      }

      if (confirmCode.success) {
        this.unlocked()
        this.logonError = ''
        return this.$emit('accessConfirmed', true)
      } else {
        this.logonError = getDictionaryValue(confirmCode.error)
        return this.$emit('accessConfirmed', false)
      }
    },
    pageBack() {
      return this.$emit('pageBack')
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        this.accessConfirmed()
      }
    },
    handleErorrChange(newValue: string) {
      if (newValue) this.logonError = newValue
    },
    authenticatorCodeChanged() {
      if (this.authenticatorCode.length === 6 && this.store.twoFaRequired.authenticator) {
        this.accessConfirmed()
      }
    }
  },
  props: {
    error: {
      type: String
    }
  },
  watch: {
    error: [
      {
        handler: 'handleErorrChange'
      }
    ],
    authenticatorCode: [
      {
        handler: 'authenticatorCodeChanged'
      }
    ]
  }
})
</script>
