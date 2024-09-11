<template>
  <div>
    <img src="@/assets/img/email_verification.svg" alt="Email 2FA image" class="mb-3" />
    <h2 data-cy="emailConfirmationTitle" class="title">{{ $t('2fa.EMAIL_CONFIRMATION_TITLE') }}</h2>
    <p class="subtitle">{{ $t('2fa.EMAIL_CONFIRMATION_DESCRIPTION') }}</p>

    <div class="field">
      <label class="label">{{ $t('2fa.VERIFICATION_CODE') }}</label>

      <div class="control">
        <input
          data-cy="2faEmailCode"
          type="string"
          inputmode="numeric"
          class="input"
          :placeholder="$t('common.ENTER_CODE')"
          v-model="authenticatorCode"
          @keypress="handleKeyPress"
        />
      </div>
    </div>

    <div class="error" v-if="logonError">
      <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span data-cy="2faEmailError" v-html="logonError"></span></p>
    </div>

    <button
      data-cy="confirmButton"
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
import { verifyEmailCode } from '@/utils/backupRestore'
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
      if (this.verifyCode === false) {
        this.$emit('setCode', this.authenticatorCode)
      } else {
        this.logonError = ''

        const isCodeValid = await this.confirmAuthenticator()
        if (isCodeValid) return this.authenticatorCode
        else this.$emit('setCode', null)
      }
    },
    pageBack() {
      this.$emit('pageBack')
    },
    async confirmAuthenticator() {
      if (this.verifyCode !== false) {
        const confirmCode = await verifyEmailCode(
          this.store.fetch_key || this.store.email,
          this.authenticatorCode
        )

        if (confirmCode.success) {
          this.logonError = ''
          return true
        } else {
          this.logonError = getDictionaryValue(confirmCode.error)
          return false
        }
      }
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        this.setCode()
      }
    },
    handleErorrChange(newValue: string) {
      if (newValue) this.logonError = newValue
    }
  },
  props: {
    error: {
      type: String
    },
    verifyCode: {
      type: Boolean
    }
  },
  watch: {
    error: [
      {
        handler: 'handleErorrChange'
      }
    ]
  }
})
</script>
