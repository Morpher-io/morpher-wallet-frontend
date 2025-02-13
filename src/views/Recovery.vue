<template>
  <div>
    <button @click="redirectUser" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>
    <div v-if="currentPage === 0">
      <div v-if="store.email" class="container">
        
        
        <img
          src="@/assets/img/recover_wallet.svg"
          :alt="$t('images.RECOVER_WALLET')"
          class="mb-3"
        />
        <h2 class="title">{{ $t('recovery.RECOVERY_TITLE') }}</h2>
        <p class="subtitle">{{ $t('recovery.RECOVERY_DESCRIPTION') }}</p>

        <div class="error alert warning is-size-7" v-if="logonError">
          <p data-cy="loginError"><img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"> <span v-html="logonError || '&nbsp;'"></span></p>
          <a
            v-if="showMore"
            href="https://support.morpher.com/en/article/recovering-your-wallet-forgot-password-snvhxu/"
            target="__blank"
            class="login-router transition-faster"
            ><span>{{ $t('common.LEARN_MORE') }}</span></a
          >
        </div>

        <div class="field is-grouped">
          <RecoverWalletGoogle @setPassword="setPassword"></RecoverWalletGoogle>
        </div>
        <div class="field is-grouped">
          <RecoverWalletApple @setPassword="setPassword"></RecoverWalletApple>
        </div>
        <div class="field is-grouped">
          <RecoverWalletFacebook @setPassword="setPassword"></RecoverWalletFacebook>
        </div>
        <div class="field is-grouped">
          <RecoverWalletVkontakte @setPassword="setPassword"></RecoverWalletVkontakte>
        </div>

        <p class="is-size-7 mt-5 transition-faster">
          {{ $t('recovery.RECOVERY_NEED_HELP') }}&nbsp;
          <a
            href="https://support.morpher.com/en/article/recovering-your-wallet-forgot-password-snvhxu/"
            target="__blank"
            class="login-router"
            >{{ $t('common.LEARN_MORE') }}</a
          >
        </p>
      </div>
      <div v-else class="container">
        <img
          src="@/assets/img/recover_wallet.svg"
          :alt="$t('images.RECOVER_WALLET')"
          class="mb-3"
        />
        <h2 class="title">{{ $t('recovery.RECOVERY_TITLE') }}</h2>
        <p class="subtitle">{{ $t('recovery.ENTER_EMAIL') }}</p>
        <form v-on:submit.prevent="checkEmail" novalidate>
          <div class="field">
            <label class="label">{{ $t('common.EMAIL') }}</label>
            <div class="control">
              <input
                type="email"
                class="input"
                name="newEmail"
                v-model="newEmail"
                :placeholder="$t('common.ENTER_EMAIL')"
                @keypress="handleKeyPress"
              />
            </div>
          </div>

          <div class="error" v-if="logonError">
            <p data-cy="loginError"><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span></p>
          </div>

          <button
            data-cy="confirmButton"
            type="submit"
            class="button is-green big-button is-login transition-faster"
          >
            <span class="text">{{ $t('common.CONTINUE') }}</span>
          </button>

        </form>
        <p class="is-size-7 mt-5 transition-faster">
          {{ $t('recovery.RECOVERY_NEED_HELP') }}&nbsp;
          <a
            href="https://support.morpher.com/en/article/recovering-your-wallet-forgot-password-snvhxu/"
            target="__blank"
            class="login-router"
            >{{ $t('common.LEARN_MORE') }}</a
          >
        </p>

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
      </div>
    </div>
    <div class="container">
      <ChangePassword v-if="currentPage === 1" :presetOldPassword="oldPassword"></ChangePassword>
    </div>
  </div>
</template>

<script lang="ts">
import RecoverWalletVkontakte from '@/components/RecoverWalletVkontakte.vue'
import RecoverWalletGoogle from '@/components/RecoverWalletGoogle.vue'
import RecoverWalletApple from '@/components/RecoverWalletApple.vue'
import RecoverWalletFacebook from '@/components/RecoverWalletFacebook.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import Recaptcha from '@/mixins/recaptcha'
import { getPayload, validateInput } from '@/utils/backupRestore'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    RecoverWalletVkontakte: RecoverWalletVkontakte as any,
    RecoverWalletFacebook: RecoverWalletFacebook as any,
    RecoverWalletGoogle: RecoverWalletGoogle as any,
    RecoverWalletApple: RecoverWalletApple as any,
    ChangePassword: ChangePassword as any
  },
  mixins: [Authenticated, Global, Recaptcha],
  data() {
    return {
      currentPage: 0,
      newEmail: '',
      logonError: '',
      oldPassword: '',
      showMore: true
    }
  },
  async mounted() {
    this.executeHiddenRecovery()
  },
  methods: {
    executeHiddenRecovery() {
      if (this.store.hiddenLogin && this.store.hiddenLogin.type == 'recovery') {
        let recoveryData = this.store.hiddenLogin.recovery
        if (recoveryData.type == 'email' && recoveryData.data && recoveryData.data.email) {
          let email = recoveryData.data.email
          this.newEmail = email
          this.checkEmail()
        }
      }
    },
    async checkEmail() {
      this.logonError = ''

      if (!this.newEmail) {
        return
      }
      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.checkEmail)

      const emailMessage = await validateInput('email', this.newEmail)

      if (emailMessage) {
        this.logonError = emailMessage
        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(emailMessage)
        }
        this.loginErrorReturn(this.newEmail, emailMessage)
        return
      }

      try {
        const result: any = await getPayload(this.newEmail, this.recaptchaToken)

        if (result.success) {
          this.setUsersEmail(this.newEmail)

          if (this.isIframe() && this.store.connection && this.store.connection !== null) {
            const connection: any = await this.store.connection.promise
            connection.onRecovery('emailValidated', this.newEmail)
          }
        } else {
          if (result && result.toString() === 'TypeError: Failed to fetch') {
            this.showNetworkError(true)
          }

          this.loginErrorReturn(this.newEmail, result.toString())
          this.logonError = getDictionaryValue(result.toString())
        }
      } catch (error: any) {
        if (error.error === 'RECAPTCHA_REQUIRED') {
          this.loginErrorReturn(this.newEmail, 'RECAPTCHA_REQUIRED')
          this.executeRecaptcha(this.checkEmail)
          return
        }

        if (error && error.toString() === 'TypeError: Failed to fetch') {
          this.loginErrorReturn(this.newEmail, error.toString())
          this.showNetworkError(true)
        } else {
          if (!error.error) {
            this.loginErrorReturn(this.newEmail, error.toString())
            this.logSentryError('checkEmail', error.toString(), {})
          }
        }

        let err = ''
        if (error.error) {
          this.loginErrorReturn(this.newEmail, error.error)
          this.logonError = getDictionaryValue(error.error)
          err = error.error
        } else {
          this.loginErrorReturn(this.newEmail, error.toString())
          this.logonError = getDictionaryValue(error.toString())
          err = error.toString()
        }

        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(err)
        }
      }
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        this.checkEmail()
      }
    },
    redirectUser() {
      if (this.store.email) {
        this.$router.push('/unlock')
      } else {
        this.$router.push('/login')
      }
      
    },
    async setPassword(data: any) {
      this.logonError = ''

      if (data.success) {
        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onRecovery('setPassword', this.newEmail)
        }

        this.oldPassword = data.oldPassword
        this.currentPage = 1
      } else {
        let error = ''
        if (data.error === 'popup_closed_by_user') {
          error = 'GOOGLE_COOKIES_BLOCKED'
          this.logonError = getDictionaryValue('GOOGLE_COOKIES_BLOCKED')
        } else if (data.error === 'google_script_blocked') {
          error = 'GOOGLE_SCRIPT_BLOCKED'
          this.logonError = getDictionaryValue('GOOGLE_SCRIPT_BLOCKED')
        } else {
          error = 'RECOVERY_UNLOCK_ERROR'
          this.logonError = getDictionaryValue('RECOVERY_UNLOCK_ERROR')
        }

        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(error)
        }
        this.currentPage = 0
      }
    },
    async loginErrorReturn(email: string, err: any) {
      if (this.isIframe()) {
        if (this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise

          connection.onLoginError(email, err)
        }
      }
    },
    onPropertyChanged(value: any) {
      this.executeHiddenRecovery()
    }
  },
  watch: {
    'store.hiddenLogin': [
      {
        handler: 'onPropertyChanged'
      }
    ]
  }
})
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
