<template>
  <div>
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
    <div class="container">
      <h2 data-cy="signUpTitle" class="title">{{ $t('auth.SIGNUP') }}</h2>
      <p data-cy="signUpDescription" class="subtitle">{{ $t('auth.SIGNUP_DESCRIPTION') }}</p>

      <!-- Pick signing method -->
      <div v-if="!passwordSignin">
        <LoginApple @processMethod="processMethod" :signIn="true"></LoginApple>
        <LoginGoogle @processMethod="processMethod" :signIn="true"></LoginGoogle>

        <button
          class="button big-button outlined-button facebook-button transition-faster"
          @click="passwordSignin = true"
          data-cy="emailSignUpButton"
        >
          <span class="icon img">
            <img src="@/assets/img/email_icon.svg" alt="Email Icon" />
          </span>
          <span>{{ $t('auth.SIGN_UP_USING_EMAIL') }}</span>
        </button>

        <div class="error" v-if="logonError">
          <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span></p>
        </div>
      </div>
      <!-- Signin with email/password -->
      <div v-else>
        <div class="field">
          <label class="label">{{ $t('common.EMAIL') }}</label>
          <div class="control">
            <input
              ref="login_email"
              @keydown="checkKeyPress"
              type="email"
              class="input"
              name="walletEmail"
              data-cy="walletEmail"
              v-model="walletEmail"
              :placeholder="$t('common.ENTER_EMAIL')"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">{{ $t('common.PASSWORD') }}</label>

          <div class="control">
            <input
              ref="login_password"
              @keydown="checkKeyPress"
              :type="passwordIsVisible ? 'text' : 'password'"
              class="input password-input"
              name="walletPassword"
              data-cy="walletPassword"
              v-model="walletPassword"
              :placeholder="$t('common.ENTER_PASSWORD')"
            />

            <button class="password-toggle" v-on:click="togglePasswordVisibility" data-cy="password-toggle-button">
              <img v-if="passwordIsVisible" class="image" src="@/assets/img/password-hide.svg" alt="Visible Button" />
              <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
						</button>
          </div>
          <div>
            <password-meter
              :passwordChecks="passwordChecks"
              style="max-width: initial"
            />
            <div class="password-help">
              <p><b>{{ $t('password.REQUIREMENTS') }}</b></p>
              <ul class="items">
                <li
                  :class="{
                    done: passwordChecks.min === 'pass',
                    fail: passwordChecks.min === 'fail'
                  }"
                >
                  {{ $t('password.MIN_CHARACTERS') }}
                </li>
                <li
                  :class="{
                    done: passwordChecks.lowercase === 'pass',
                    fail: passwordChecks.lowercase === 'fail'
                  }"
                >
                  {{ $t('password.LOWERCASE_LETTER') }}
                </li>
                <li
                  :class="{
                    done: passwordChecks.uppercase === 'pass',
                    fail: passwordChecks.uppercase === 'fail'
                  }"
                >
                  {{ $t('password.UPPERCASE_LETTER') }}
                </li>
                <li
                  :class="{
                    done: passwordChecks.number === 'pass',
                    fail: passwordChecks.number === 'fail'
                  }"
                >
                  {{ $t('password.NUMBER') }}
                </li>
                <li
                  :class="{
                    done: passwordChecks.match === 'pass',
                    fail: passwordChecks.match === 'fail'
                  }"
                >
                  {{ $t('password.PASSWORD_MATCH') }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t('common.CONFIRM_PASSWORD') }}</label>
          <div class="control">
            <input
              :type="passwordConfirmIsVisible ? 'text' : 'password'"
              ref="login_password_repeat"
              @keydown="checkKeyPress"
              class="input"
              name="walletPasswordRepeat"
              data-cy="walletPasswordRepeat"
              v-model="walletPasswordRepeat"
            />
            <button class="password-toggle" v-on:click="toggleConfirmPasswordVisibility" data-cy="password-toggle-button">
              <img v-if="passwordConfirmIsVisible" class="image" src="@/assets/img/password-hide.svg" alt="Visible Button" />
              <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
						</button>

          </div>
        </div>

        <div class="error" v-if="logonError">
          <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span></p>
        </div>

        <button
          type="submit"
          @click="signupExecute"
          data-cy="createNewWallet"
          class="button is-green big-button is-login transition-faster"
        >
          <span class="text">{{ $t('auth.CREATE_WALLET') }}</span>
        </button>
      </div>

      <div class="login-link">
        <span>{{ $t('auth.ALREADY_HAVE_WALLET') }}&nbsp;</span>
        <router-link to="/login" class="login-router transition-faster">
          <span data-cy="logInButton">
            {{ $t('auth.LOGIN') }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import PasswordMeter from '@/components/PasswordMeter.vue'
import { validateInput } from '@/utils/backupRestore'
import { Global } from '@/mixins/global'
import Recaptcha from '@/mixins/recaptcha'
import { getDictionaryValue } from '@/utils/dictionary'
import LoginGoogle from '@/components/LoginGoogleV2.vue'
import LoginApple from '@/components/LoginApple.vue'
import { sha256 } from '@/utils/cryptoFunctions'
import { defineComponent } from 'vue'
import type { TypePasswordCheck } from '@/types/global-types'

export default defineComponent({
  components: {
    PasswordMeter: PasswordMeter as any,
    LoginApple: LoginApple as any,
    LoginGoogle: LoginGoogle as any
  },
  mixins: [Global, Recaptcha],
  data() {
    const passwordChecks: TypePasswordCheck = {
      min: '',
      uppercase: '',
      lowercase: '',
      number: '',
      match: ''
    }
    const loginUser: any = {}

    return {
      walletEmail: '',
      walletPassword: '',
      walletPasswordRepeat: '',
      signup: false,
      logonError: '',
      loginUser,
      passwordSignin: false,
      passwordChecks,
      passwordIsVisible: false,
      passwordConfirmIsVisible: false
    }
  },
  mounted() {
    this.executeHiddenLogin()

    let signupUser = sessionStorage.getItem('signupUser')
    if (signupUser) {
      sessionStorage.removeItem('signupUser')
      signupUser = JSON.parse(signupUser)
      if (signupUser) {
        this.loginUser = signupUser

        this.signupExecute(false)
      }
    }
  },
  methods: {
    executeHiddenLogin() {
      try {
        if (
          this.store.hiddenLogin &&
          this.store.hiddenLogin.action === 'singup' &&
          this.store.hiddenLogin.walletEmail &&
          this.store.hiddenLogin.walletPassword &&
          this.store.hiddenLogin.type == 'email'
        ) {
          this.passwordSignin = true
          this.walletEmail = this.store.hiddenLogin.walletEmail
          this.walletPassword = this.store.hiddenLogin.walletPassword
          this.walletPasswordRepeat = this.store.hiddenLogin.walletPasswordRepeat
          this.signupExecute(false)
        } else if (
          this.store.hiddenLogin &&
          this.store.hiddenLogin.type &&
          this.store.hiddenLogin.action === 'singup' &&
          this.store.hiddenLogin.type.type == 'google'
        ) {
          this.passwordSignin = false
          this.walletEmail = ''
          this.walletPassword = ''
          this.walletPasswordRepeat = ''

          this.loginUser = this.store.hiddenLogin.type
          this.signupExecute(false)
        } else if (
          this.store.hiddenLogin &&
          this.store.hiddenLogin.type &&
          this.store.hiddenLogin.action === 'singup' &&
          this.store.hiddenLogin.type.type == 'apple'
        ) {
          this.passwordSignin = false
          this.walletEmail = ''
          this.walletPassword = ''
          this.walletPasswordRepeat = ''
          this.loginUser = this.store.hiddenLogin.type
          this.signupExecute(false)
        }
      } catch (err) {
        console.log('error processing hidden login', err)
      }
    },
    async processMethod(data: any) {
      this.logonError = ''

      if (data.success) {
        this.loginUser = data

        this.signupExecute(false)
      } else {
        let error
        if (data.error === 'popup_closed_by_user') {
          this.logonError = getDictionaryValue('GOOGLE_COOKIES_BLOCKED')
          error = 'GOOGLE_COOKIES_BLOCKED'
        } else if (data.error === 'google_script_blocked') {
          this.logonError = getDictionaryValue('GOOGLE_SCRIPT_BLOCKED')
          error = 'GOOGLE_SCRIPT_BLOCKED'
        } else {
          this.logonError = data.method + ': ' + getDictionaryValue(data.error)
          error = data.error
        }

        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(error)
        }
      }
    },
    checkKeyPress(e: any) {
      if (e.key == 'Enter') {
        if (this.walletEmail && this.walletPassword && this.walletPasswordRepeat) {
          this.signupExecute(false)
        } else {
          // set focus to the password field if it is blanck
          if (!this.walletEmail) {
            window.setTimeout(() => {
              const passwordElement: any = this.$refs.login_email
              if (passwordElement) passwordElement.focus()
            }, 100)
          } else if (!this.walletPassword) {
            window.setTimeout(() => {
              const passwordElement: any = this.$refs.login_password
              if (passwordElement) passwordElement.focus()
            }, 100)
          } else if (!this.walletPasswordRepeat) {
            window.setTimeout(() => {
              const passwordElement: any = this.$refs.login_password_repeat
              if (passwordElement) passwordElement.focus()
            }, 100)
          }
        }
      }
    },
    async signupExecute(e: any) {
      if (!crypto || !crypto.subtle) {
        this.logonError = getDictionaryValue('CRYPTO_DESCYPT_ACCESS')

        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(this.logonError)
        }
        return
      }

      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.signupExecute)

      // block if signup is already executing
      if (this.store.loading) {
        return
      }
      if (e) e.preventDefault()
      this.logonError = ''

      let email = this.walletEmail
      let password = this.walletPassword
      let recoveryTypeId = 1
      let token = ''
      let fetch_key = email?.toLowerCase()

      if (!this.passwordSignin && this.loginUser && this.loginUser.userID && this.loginUser.key) {
        fetch_key = this.loginUser.key
        email = this.loginUser?.email?.toLowerCase() || this.loginUser.key
        password = this.loginUser.userID
        recoveryTypeId = this.loginUser.recoveryTypeId

        token = this.loginUser.token
      }

      if (recoveryTypeId == 1) {
        this.passwordChecks = this.checkPassword(
          this.walletPassword,
          true,
          this.passwordChecks,
          this.walletPasswordRepeat
        )

        if (
          Object.keys(this.passwordChecks).some(
            (value: string) => (this.passwordChecks as any)[value] !== 'pass'
          )
        ) {
          return
        }

        /**
         * Validating Email
         */
        const emailMessage = await validateInput('email', this.walletEmail)
        if (emailMessage) {
          this.hideSpinner()
          this.logonError = emailMessage
          if (this.isIframe() && this.store.connection && this.store.connection !== null) {
            const connection: any = await this.store.connection.promise
            connection.onError(emailMessage)
          }
          return
        }

        /**
         * Validating Password
         */
        const passwordMessage = await validateInput('password', this.walletPassword)
        if (passwordMessage) {
          this.hideSpinner()
          this.logonError = passwordMessage
          if (this.isIframe() && this.store.connection && this.store.connection !== null) {
            const connection: any = await this.store.connection.promise
            connection.onError(passwordMessage)
          }
          return
        }
      }

      const recaptchaToken = this.recaptchaToken

      this.showSpinner('Creating Wallet...')
      this.createWallet({
        email,
        password: password,
        recaptchaToken,
        token: token,
        recoveryTypeId: recoveryTypeId,
        fetch_key
      })
        .then(() => {
          this.hideSpinner()
          if (
            this.store.twoFaRequired.email ||
            this.store.twoFaRequired.authenticator ||
            this.store.twoFaRequired.needConfirmation
          ) {
            // open 2fa page if 2fa is required
            this.$router.push('/2fa').catch(() => undefined)
          } else {
            this.$router.push('/').catch(() => undefined)
          }
        })
        .catch(async (error) => {
          if (error.toString().toLowerCase().includes('too many r')) {
            error = 'TOO_MANY_REQUESTS'
          }

          this.hideSpinner()
          if (error.error === 'RECAPTCHA_REQUIRED') {
            this.executeRecaptcha(this.signupExecute)
            return
          }

          if (error && error.toString() === 'TypeError: Failed to fetch') {
            this.showNetworkError(true)
          } else {
            this.logSentryError(
              'createWallet',
              error.error || error.message || error.toString(),
              {}
            )
          }

          this.logonError = getDictionaryValue(error.toString())
          if (this.isIframe() && this.store.connection && this.store.connection !== null) {
            const connection: any = await this.store.connection.promise
            connection.onError(error.toString())
          }
        })
    },
    handlePasswordChange(newValue: string) {
      this.passwordChecks = this.checkPassword(
        newValue,
        false,
        this.passwordChecks,
        this.walletPasswordRepeat
      )
    },
    togglePasswordVisibility() {
      this.passwordIsVisible = !this.passwordIsVisible
    },
    toggleConfirmPasswordVisibility() {
      this.passwordConfirmIsVisible = !this.passwordConfirmIsVisible
    },
    handlePasswordRepeatChange(newValue: string) {
      this.passwordChecks = this.checkPassword(
        this.walletPassword,
        false,
        this.passwordChecks,
        newValue,
        true
      )
    },
    onPropertyChanged(value: any) {
      this.executeHiddenLogin()
    }
  },
  watch: {
    walletPassword: [
      {
        handler: 'handlePasswordChange'
      }
    ],
    walletPasswordRepeat: [
      {
        handler: 'handlePasswordRepeatChange'
      }
    ],
    'store.hiddenLogin': [
      {
        handler: 'onPropertyChanged'
      }
    ]
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
