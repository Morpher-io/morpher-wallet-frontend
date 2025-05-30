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
      <h2 data-cy="logInTitle" class="title">{{ $t('auth.LOGIN') }}</h2>
      <p data-cy="logInDescription" class="subtitle">{{ $t('auth.LOGIN_DESCRIPTION') }}</p>

      <!-- Pick signing method -->
      <div v-if="!passwordSignin">
        <LoginApple @processMethod="processMethod"></LoginApple>
        <LoginGoogle @processMethod="processMethod"></LoginGoogle>

        <button
          class="button big-button outlined-button facebook-button transition-faster"
          @click="
            logonError = '';
            showSignUp = false;
            passwordSignin = true;
          "
          data-cy="emailLoginButton"
        >
          <span class="icon img">
            <img src="@/assets/img/email_icon.svg" alt="Email Icon" />
          </span>
          <span>{{ $t('auth.LOGIN_EMAIL') }}</span>
        </button>

        <div class="error" v-if="logonError">
          <p data-cy="loginError">
            <img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span>
            <router-link v-if="showSignUp" to="/signup" class="login-router transition-faster"
              ><span class="ml-1">{{ $t('auth.SIGN_UP_WALLET_QUESTION') }}</span></router-link
            >
            <router-link v-if="showRecovery" to="/recovery" class="login-router transition-faster"
              ><span class="ml-1">{{ $t('auth.RECOVER_YOUR_WALLET_QUESTION') }}</span></router-link
            >
          </p>
        </div>
      </div>
      <!-- Signin with email/password -->
      <div v-else>
        <div class="field">
          <label class="label">{{ $t('common.EMAIL') }}</label>
          <div class="control">
            <input
              type="email"
              class="input"
              data-cy="walletEmail"
              @keydown="checkKeyPress"
              name="walletEmail"
              v-model="walletEmail"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">{{ $t('common.PASSWORD') }}</label>

          <div class="control">
            <input
              :type="passwordIsVisible ? 'text' : 'password'"
              ref="login_password"
              class="input"
              data-cy="walletPassword"
              @keydown="checkKeyPress"
              name="walletPassword"
              v-model="walletPassword"
            />
            
            <button class="password-toggle" v-on:click="togglePasswordVisibility" data-cy="password-toggle-button">
              <img v-if="passwordIsVisible" class="image" src="@/assets/img/password-hide.svg" alt="Visible Button" />
              <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
						</button>
          </div>
        </div>

        <div class="error" v-if="logonError">
          <div data-cy="loginError" class="errorbox">
            <img src="@/assets/img/warning.svg" alt="warning-icon">
            <div>
              <div v-html="logonError"></div>
              <router-link v-if="showSignUp" to="/signup" class="login-router transition-faster">
                {{ $t('auth.SIGN_UP_WALLET_QUESTION') }}
              </router-link>
              <router-link v-if="showRecovery" to="/recovery" class="login-router transition-faster">
                {{ $t('auth.RECOVER_YOUR_WALLET_QUESTION') }}
              </router-link>
            </div>
          </div>
        </div>

        <button
          type="submit"
          @click="login"
          data-cy="submit"
          class="button is-green big-button is-login transition-faster"
        >
          <span class="text">{{ $t('auth.LOGIN') }}</span>
        </button>

        <p class="forgot-password">
          {{ $t('auth.FORGOT_PASSWORD') }}
          <router-link to="/recovery" class="login-router transition-faster"
            ><span>{{ $t('auth.RECOVER_YOUR_WALLET') }}</span></router-link
          >
        </p>
      </div>

      <div class="login-link">
        <span>{{ $t('auth.DO_NOT_HAVE_WALLET') }}&nbsp;</span>
        <router-link to="/signup" class="login-router transition-faster">
          <span data-cy="signUpButton">
            {{ $t('auth.SIGNUP') }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Global } from '@/mixins/global'
import { getDictionaryValue } from '@/utils/dictionary'
import Recaptcha from '@/mixins/recaptcha'
import LoginGoogle from '@/components/LoginGoogleV2.vue'
import LoginApple from '@/components/LoginApple.vue'
import { sha256 } from '@/utils/cryptoFunctions'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    LoginApple: LoginApple as any,
    LoginGoogle: LoginGoogle as any
  },
  mixins: [Global, Recaptcha],
  data() {
    const loginUser: any = {}

    return {
      walletEmail: '',
      walletPassword: '',
      showRecovery: false,
      logonError: '',
      passwordSignin: false,
      showSignUp: false,
      loginUser,
      passwordIsVisible: false
    }
  },
  async mounted() {
    if (this.store.email) {
      this.walletEmail = this.store.email
    }
    if (!this.walletEmail) {
      const email = localStorage.getItem('lastEmail')
      if (email) this.walletEmail = email
    }

    if (this.store.status !== 'invalid password' && this.store.email) {
      // Check if the wallet can be unlocked using the local-storage stored password
      this.unlock()
    } else {
      this.unlockUpdate()
    }

    if (this.store.status === 'invalid password') {
      this.logonError = getDictionaryValue('DECRYPT_FAILED')
      if (this.walletEmail) this.loginErrorReturn(this.walletEmail, 'INVALID_PASSWORD')
      this.showRecovery = true
      if (this.isIframe() && this.store.connection && this.store.connection !== null) {
        const connection: any = await this.store.connection.promise
        connection.onError('DECRYPT_FAILED')
      }
    }

    this.executeHiddenLogin()
  },
  methods: {
    executeHiddenLogin() {
      try {
        if (
          this.store.hiddenLogin &&
          this.store.hiddenLogin.user &&
          this.store.hiddenLogin.action === 'login' &&
          this.store.hiddenLogin.password &&
          this.store.hiddenLogin.type == 'email'
        ) {
          this.passwordSignin = true
          this.walletEmail = this.store.hiddenLogin.user
          this.walletPassword = this.store.hiddenLogin.password
          this.login()
        } else if (
          this.store.hiddenLogin &&
          this.store.hiddenLogin.type &&
          this.store.hiddenLogin.action === 'login' &&
          this.store.hiddenLogin.type.type == 'google'
        ) {
          this.passwordSignin = false
          this.walletEmail = ''
          this.walletPassword = ''
          this.loginUser = this.store.hiddenLogin.type
          this.login()
        } else if (
          this.store.hiddenLogin &&
          this.store.hiddenLogin.type &&
          this.store.hiddenLogin.action === 'login' &&
          this.store.hiddenLogin.type.type == 'apple'
        ) {
          this.passwordSignin = false
          this.walletEmail = ''
          this.walletPassword = ''
          this.loginUser = this.store.hiddenLogin.type
          this.login()
        }
      } catch (err) {
        console.log('error processing hidden login', err)
      }
    },
    togglePasswordVisibility() {
      this.passwordIsVisible = !this.passwordIsVisible
    },
    unlock() {
      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.unlock)

      this.unlockWithStoredPassword(this.recaptchaToken)
        .then((result) => {
          if (result) {
            this.$router.push('/').catch(() => undefined)
          }
        })
        .catch((error) => {
          if (error.error === 'RECAPTCHA_REQUIRED') {
            this.executeRecaptcha(this.unlock)
            return
          }
          if (error !== true && error !== false) {
            // console.log('Error in unlock', error);
          }
        })
    },
    async processMethod(data: any) {
      this.logonError = ''
      this.showSignUp = false

      if (data.success) {
        this.loginUser = data

        this.login()
      } else {
        let error = ''
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
        if (this.walletPassword) {
          this.login()
        } else {
          // set focus to the password field if it is blanck
          window.setTimeout(() => {
            const passwordElement: any = this.$refs.login_password
            if (passwordElement) passwordElement.focus()
          }, 100)
        }
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
    async login() {
      let email = this.walletEmail
      if (!crypto || !crypto.subtle) {
        this.logonError = getDictionaryValue('CRYPTO_DESCYPT_ACCESS')
        this.loginErrorReturn(email, 'CRYPTO_DESCYPT_ACCESS')
        return
      }

      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.login)
      // block if login is already executing
      if (this.store.loading) {
        return
      }

      this.logonError = ''
      this.showSignUp = false
      this.showSpinner(this.$t('loader.LOADING_ACCOUNT').toString())
      this.store.loginComplete = false
      let password = this.walletPassword
      let recaptchaToken = this.recaptchaToken
      let recoveryTypeId = 1
      let token = null
      let fetch_key = email?.toLowerCase()

      sessionStorage.removeItem('signupUser')

      if (!this.passwordSignin && this.loginUser && this.loginUser.userID && this.loginUser.key) {
        fetch_key = this.loginUser.key
        email = this.loginUser?.email?.toLowerCase() || this.loginUser.key
        password = this.loginUser.userID
        recoveryTypeId = this.loginUser.recoveryTypeId
        recaptchaToken = this.recaptchaToken
        token = this.loginUser.token
      }

      // Call the fetchUser store action to process the wallet logon
      this.fetchUser({ email, password, recaptchaToken, token, recoveryTypeId, fetch_key })
        .then(() => {
          if (
            this.store.twoFaRequired.email ||
            this.store.twoFaRequired.authenticator ||
            this.store.twoFaRequired.needConfirmation
          ) {
            this.hideSpinner()
            // open 2fa page if 2fa is required
            this.$router.push('/2fa').catch(() => undefined)
          } else {
            this.unlockWithStoredPassword(this.recaptchaToken)
              .then(() => {
                this.hideSpinner()

                // open root page after logon success
                this.$router.push('/').catch(() => undefined)
              })
              .catch(async (error) => {
                this.hideSpinner()
                if (error.error === 'RECAPTCHA_REQUIRED') {
                  this.executeRecaptcha(this.login)
                  return
                }
                this.logonError = getDictionaryValue('DECRYPT_FAILED')
                this.loginErrorReturn(email, 'INVALID_PASSWORD')
                this.showRecovery = true

                if (this.isIframe() && this.store.connection && this.store.connection !== null) {
                  const connection: any = await this.store.connection.promise
                  connection.onError('DECRYPT_FAILED')
                }
              })
          }
        })
        .catch(async (error) => {
          this.hideSpinner()
          if (error.toString().toLowerCase().includes('too many r')) {
            error = 'TOO_MANY_REQUESTS'
          }

          if (error.toString() == 'Too Many Requests') {
            error = 'TOO_MANY_REQUESTS'
          }

          if (error.error === 'RECAPTCHA_REQUIRED') {
            this.executeRecaptcha(this.login)
            return
          }
          // Logon failed

          if (error && error.toString() === 'TypeError: Failed to fetch') {
            this.showNetworkError(true)
          } else {
            if (!error.error) {
              this.logSentryError('fetchUser', error.toString(), { email })
            }
          }

          if (error !== true && error !== false) {
            if (error.success === false) {
              if (error.error == 'USER_NOT_FOUND') {
                if (Number(recoveryTypeId) === 3) {
                  error.error = 'USER_NOT_FOUND_GOOGLE'
                  this.showSignUp = true
                  sessionStorage.setItem('signupUser', JSON.stringify(this.loginUser))
                }
                if (Number(recoveryTypeId) === 6) {
                  error.error = 'USER_NOT_FOUND_APPLE'
                  this.showSignUp = true
                  sessionStorage.setItem('signupUser', JSON.stringify(this.loginUser))
                }
              }
              this.loginErrorReturn(email, error.error)
              this.logonError = getDictionaryValue(error.error)

              if (this.isIframe() && this.store.connection && this.store.connection !== null) {
                const connection: any = await this.store.connection.promise
                connection.onError(error.error)
              }
            } else {
              this.loginErrorReturn(email, error)
              if (error.toString().includes('_')) {
                this.logonError = getDictionaryValue(error.toString())
              } else {
                this.logonError = error.toString()
              }

              if (this.isIframe() && this.store.connection && this.store.connection !== null) {
                const connection: any = await this.store.connection.promise
                connection.onError(error.toString())
              }

              // console.log('Error in login', error);
            }
          }
        })
    },
    onPropertyChanged(value: any) {
      this.executeHiddenLogin()
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
