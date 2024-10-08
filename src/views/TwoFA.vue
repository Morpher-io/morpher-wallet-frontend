<template>
  <div class="container">

    <button @click="logout()" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>

    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="recaptchaSiteKey"
      :load-recaptcha-script="true"
      @verify="onCaptchaVerified"
      @error="onCaptchaError"
      @expired="onCaptchaExpired"
      @render="onCaptchaLoaded"
      style="display: none"
    />
    <img
      v-if="
        (store.twoFaRequired.email || store.twoFaRequired.needConfirmation) &&
        !store.twoFaRequired.authenticator
      "
      src="@/assets/img/email_verification.svg"
      alt="Email 2FA image"
      class="mb-3"
    />
    <img
      v-if="store.twoFaRequired.authenticator"
      src="@/assets/img/authenticator.svg"
      alt="Phone authenticator image"
      class="mb-3"
    />
    <h2 v-if="emailSent" data-cy="verificationTitle" class="title">
      {{ $t('settings.2_STEP_VERIFICATION') }}
    </h2>
    <p
      v-if="
        (store.twoFaRequired.email || store.twoFaRequired.needConfirmation) &&
        !store.twoFaRequired.authenticator
      "
      class="subtitle"
    >
      {{ $t('2fa.ENTER_EMAIL_CODE') }}
    </p>
    <p
      v-if="
        store.twoFaRequired.authenticator &&
        !store.twoFaRequired.email &&
        !store.twoFaRequired.needConfirmation
      "
      class="subtitle"
    >
      {{ $t('2fa.ENTER_AUTH_CODE') }}
    </p>
    <p v-if="store.twoFaRequired.email && store.twoFaRequired.authenticator" class="subtitle">
      {{ $t('2fa.ENTER_BOTH_CODES') }}
    </p>
    <form v-on:submit.prevent="validateCode" novalidate>
      <div class="field" v-if="store.twoFaRequired.email || store.twoFaRequired.needConfirmation">
        <label class="label">{{ $t('2fa.EMAIL_CODE') }}</label>
        <div class="control">
          <input
            type="string"
            inputmode="numeric"
            min="100000"
            max="999999"
            class="input"
            name="emailCode"
            id="emailCode"
            data-cy="emailCode"
            v-model="emailCode"
            :placeholder="$t('common.ENTER_CODE_EMAIL')"
            ref="email_code"
            @keypress="handleKeyPress"
          />
        </div>
      </div>
      <div class="field" v-if="store.twoFaRequired.authenticator">
        <label class="label">{{ $t('2fa.AUTH_CODE') }}</label>
        <div class="control">
          <input
            type="string"
            inputmode="numeric"
            class="input"
            name="authenticatorCode"
            id="authenticatorCode"
            data-cy="authenticatorCode"
            ref="auth_code"
            v-model="authenticatorCode"
            @keypress="handleKeyPress"
          />
        </div>
      </div>

      <div class="error" v-if="logonError">
        <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span></p>
      </div>

      <button
        class="button is-green big-button is-login transition-faster mt-5"
        type="submit"
        data-cy="unlock"
      >
        <span class="text">{{ $t('common.SUBMIT') }}</span>
      </button>

   
    </form>

    <p class="mt-5 transition-faster">
      {{ $t('2fa.HAVING_PROBLEMS') }}
      <a
        href="https://support.morpher.com/en/article/2fa-2-step-verification-troubleshooting-ejmssf/"
        target="__blank"
        class="login-router"
        >{{ $t('2fa.2_STEP_SUPPORT') }}</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import { Global } from '@/mixins/global'
import { getDictionaryValue } from '@/utils/dictionary'
import Recaptcha from '@/mixins/recaptcha'
import { send2FAEmail } from '@/utils/backupRestore'
import { defineComponent } from 'vue'

export default defineComponent({
  mixins: [Global, Recaptcha],
  data() {
    return {
      emailCode: '',
      authenticatorCode: '',
      showRecovery: false,
      logonError: '',
      retry: 0,
      emailSent: false
    }
  },
  async mounted() {
    this.retry = 0

    window.setTimeout(() => {
      const email: any = this.$refs.email_code
      const auth: any = this.$refs.auth_code
      if (email) email.focus()
      else if (auth) auth.focus()
    }, 100)

    if (this.isIframe()) {
      if (this.store.connection && this.store.connection !== null) {
        const connection: any = await this.store.connection.promise

        connection.on2FA({
          email: this.store.twoFaRequired.email || this.store.twoFaRequired.needConfirmation,
          authenticator: this.store.twoFaRequired.authenticator
        })
      }
    }

    if (this.store.hiddenLogin && this.store.hiddenLogin.type == '2fa') {
      this.executeHiddenLogin()
    } else {
      if (this.store.twoFaRequired.email || this.store.twoFaRequired.needConfirmation) {
        this.executeEmailSend()
      } else {
        if (!this.store.twoFaRequired.authenticator) {
          this.$router.push('/login').catch(() => undefined)
          return
        } else {
          this.emailSent = true
        }
      }
    }
  },
  methods: {
    async executeEmailSend() {
      const walletEmail = this.store.email
      if (!walletEmail) {
        this.$router.push('/login').catch(() => undefined)
        return
      }

      try {
        const result = await send2FAEmail(walletEmail, this.store.fetch_key, 'TwoFA')

        if (!result || !result.sent == true) {
          this.retry = this.retry + 1
          if (this.retry < 4) {
            setTimeout(this.executeEmailSend, 2000)
          } else {
            this.$router.push('/login').catch(() => undefined)
            return
          }
        } else {
          this.emailSent = true
        }
      } catch (err) {
        this.retry = this.retry + 1
        if (this.retry < 4) {
          setTimeout(this.executeEmailSend, 2000)
        } else {
          this.$router.push('/login').catch(() => undefined)
          return
        }
      }
    },
    executeHiddenLogin() {
      try {
        if (this.store.hiddenLogin) {
          if (this.store.twoFaRequired.authenticator) {
            this.authenticatorCode = this.store.hiddenLogin.twoFACode
          } else {
            this.emailCode = this.store.hiddenLogin.twoFACode
          }

          this.validateCode()
        }
      } catch (err) {
        console.log('error processing hidden login', err)
      }
    },
    async validateCode() {
      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.validateCode)

      // block if 2fa validation is already executing
      if (this.store.loading) {
        return
      }
      this.logonError = ''
      this.showSpinner(this.$t('loader.VALIDATING_CODE').toString())
      this.unlock2FA({
        email2FA: this.emailCode,
        authenticator2FA: String(this.authenticatorCode),
        recaptchaToken: this.recaptchaToken
      })
        .then((nextroute) => {
          this.hideSpinner()
          this.router.push(nextroute as string).catch(() => undefined)
        })
        .catch(async (error) => {
          this.hideSpinner()
          if (error.error === 'RECAPTCHA_REQUIRED') {
            this.executeRecaptcha(this.validateCode)
            return
          }

          if (error && error.toString() === 'TypeError: Failed to fetch') {
            this.showNetworkError(true)
          }

          if (error.toString() === 'invalid password') {
            this.store.status = 'invalid password'
            this.router.push('/login').catch(() => undefined)
          }
          if (this.isIframe()) {
            if (this.store.connection && this.store.connection !== null) {
              const connection: any = await this.store.connection.promise
              connection.onError(error.toString())
            }
          }
          this.logonError = getDictionaryValue(error.toString())
        })
    },
    logout() {
      this.logoutWallet()
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        this.validateCode()
      }
    },
    onPropertyChanged(value: any) {
      if (this.store.hiddenLogin && this.store.hiddenLogin.type == '2fasend') {
        this.executeEmailSend()
      } else {
        this.executeHiddenLogin()
      }
    },
    authenticatorCodeChanged() {
      if (String(this.authenticatorCode).length === 6) {
        this.validateCode()
      }
    }
  },
  watch: {
    'store.hiddenLogin': [
      {
        handler: 'onPropertyChanged'
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
