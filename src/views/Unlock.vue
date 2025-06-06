<template>
  <div class="container">
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
    <spinner v-model="showSpinner" v-bind:status="store.status"></spinner>

    <h2 class="title">👋 {{ $t('auth.UNLOCK_TITLE') }}</h2>
    <p class="subtitle">{{ $t('auth.UNLOCK_DESCRIPTION') }}</p>

    <div class="user-details settings-data">
      <div class="details">
        <div class="is-flex has-text-left">
          <jazzicon :address="store.accounts[0]" class="jazz-icon" :diameter="32" />

          <div class="ml-3">
            <p>{{ walletEmail }}</p>
            <div @click="logout()" class="login-router transition-faster reset-line-height">
              {{ $t('auth.SWITCH_ACCOUNT') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="recoveryTypeId == 3">
      <LoginGoogle :unlock="true" @processMethod="processMethod"></LoginGoogle>
    </div>
    <div v-else-if="recoveryTypeId == 6">
      <LoginApple :unlock="true" @processMethod="processMethod"></LoginApple>
    </div>
    <div v-else class="field">
      <label class="label">{{ $t('common.PASSWORD') }}</label>

      <div class="control">
        <input
          :type="passwordIsVisible ? 'text' : 'password'"
          ref="unlock_password"
          class="input"
          name="walletPassword"
          v-model="walletPassword"
          @keypress="handleKeyPress"
          :placeholder="$t('common.ENTER_PASSWORD')"
        />
        <button class="password-toggle" v-on:click="togglePasswordVisibility" data-cy="password-toggle-button">
              <img v-if="passwordIsVisible" class="image" src="@/assets/img/password-hide.svg" alt="Visible Button" />
              <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
						</button>
        <div v-if="showRecovery">
          <p class="help is-danger">
            {{ $t('auth.CANNOT_DECRYPT_PASSWORD') }}
            <router-link to="/recovery">{{ $t('auth.RESTORE_ACCOUNT') }}</router-link>
          </p>
        </div>
      </div>
    </div>

    <div class="error" v-if="logonError">
      <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span></p>
    </div>

    <button
      v-if="recoveryTypeId !== 3 && recoveryTypeId !== 6"
      @click="login()"
      class="button is-green big-button is-login transition-faster mt-5"
      :disabled="!walletPassword"
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
</template>

<script lang="ts">
import { Global } from '@/mixins/global'
import Jazzicon from 'vue3-jazzicon/src/components'
import Recaptcha from '@/mixins/recaptcha'
import LoginGoogle from '@/components/LoginGoogleV2.vue'
import LoginApple from '@/components/LoginApple.vue'
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { useWalletStore } from '@/stores/wallet'
import { getDictionaryValue } from '@/utils/dictionary'
import { sha256 } from './../utils/cryptoFunctions'

export default defineComponent({
  components: {
    LoginApple: LoginApple as any,
    LoginGoogle: LoginGoogle as any,
    [Jazzicon.name]: Jazzicon
  },
  mixins: [Global, Recaptcha],
  data() {
    const loginUser: any = {}

    return {
      walletPassword: '',
      showRecovery: false,
      logonError: '',
      loginUser: {} as any,
      passwordIsVisible: false,
    }
  },
  computed: {
    ...mapState(useWalletStore, {
      walletEmail: (state) => state.walletEmail,
      iconSeed: (state) => state.iconSeed,
      recoveryTypeId: (state) => state.recoveryTypeId,
      encryptedSeed: (state) => state.encryptedSeed,
      hashedPassword: (state) => state.hashedPassword
    })
  },
  async mounted() {
    if (!this.walletEmail) {
      this.$router.push('/login').catch(() => undefined)
      return
    }

    // set focus to the password field when the control opens
    window.setTimeout(() => {
      const passwordEmelemt: any = this.$refs.unlock_password
      if (passwordEmelemt) passwordEmelemt.focus()
    }, 100)

    if (!this.encryptedSeed || !this.encryptedSeed.ciphertext) {
      await this.loadEncryptedSeed()
    }

    if (!this.hashedPassword) {
      await this.loadPassword()
    }

    if (this.hashedPassword && this.encryptedSeed.ciphertext !== undefined) {
      this.loadAccount()
    } else {
      this.unlockUpdate()
    }
  },
  methods: {
    async processMethod(data: any) {
      this.logonError = ''

      if (data.success) {
        this.loginUser = data

        this.login()
      } else {
        let error = ''
        if (data.error === 'popup_closed_by_user') {
          error = 'GOOGLE_COOKIES_BLOCKED'
          this.logonError = getDictionaryValue('GOOGLE_COOKIES_BLOCKED')
        } else if (data.error === 'google_script_blocked') {
          error = 'GOOGLE_SCRIPT_BLOCKED'
          this.logonError = getDictionaryValue('GOOGLE_SCRIPT_BLOCKED')
        } else {
          error = data.error
          this.logonError = data.method + ': ' + getDictionaryValue(data.error)
        }

        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(error)
        }
      }
    },
    async loadAccount() {
      this.showSpinner(this.$t('loader.LOADING_ACCOUNT').toString())

      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.loadAccount)

      // Check if the wallet can be unlocked using the local-storage stored password
      this.unlockWithStoredPassword(this.recaptchaToken)
        .then((result) => {
          this.hideSpinner()
          if (result) {
            this.$router.push('/').catch(() => undefined)
          }
        })
        .catch((error) => {
          this.hideSpinner()

          if (error.error === 'RECAPTCHA_REQUIRED') {
            this.executeRecaptcha(this.loadAccount)
          }

          if (error && error.toString() === 'TypeError: Failed to fetch') {
            this.showNetworkError(true)
          }
          // error
        })
    },
    togglePasswordVisibility() {
      this.passwordIsVisible = !this.passwordIsVisible
    },
    async login() {
      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.login)
      // block if unlock is already executing
      if (this.store.loading) {
        return
      }
      this.logonError = ''
      let password = await sha256(this.walletPassword)
      let fetch_key

      if (
        (this.recoveryTypeId === 3 || this.recoveryTypeId === 6) &&
        this.loginUser &&
        this.loginUser.userID &&
        this.loginUser.key
      ) {
        fetch_key = await sha256(this.loginUser.key)

        password = await sha256(this.loginUser.userID)
      }

      this.showSpinnerThenAutohide(this.$t('loader.RECOVERY_LOG_IN').toString())
      const recaptchaToken = this.recaptchaToken

      if (this.encryptedSeed && this.encryptedSeed.ciphertext) {
        // Call the fetchUser store action to process the wallet logon
        this.unlockWithPassword({ password, recaptchaToken, fetch_key })
          .then(() => {
            // open root page after logon success
            this.$router.push('/').catch(() => undefined)
          })
          .catch(async (error) => {
            this.hideSpinner()
            if (error.error === 'RECAPTCHA_REQUIRED') {
              this.executeRecaptcha(this.login)
              return
            }

            if (error && error.toString() === 'TypeError: Failed to fetch') {
              this.showNetworkError(true)
            } else {
              this.logSentryError('Unlock', error.toString(), {})
            }

            // Logon failed
            this.logonError = getDictionaryValue('DECRYPT_FAILED')
            if (this.isIframe() && this.store.connection && this.store.connection !== null) {
              const connection: any = await this.store.connection.promise
              connection.onError('DECRYPT_FAILED')
            }
          })
      } else {
        this.loginEmail()
      }
    },
    loginEmail() {
      if (
        !this.recaptchaToken &&
        (!localStorage.getItem('recaptcha_date') ||
          Number(localStorage.getItem('recaptcha_date')) < Date.now() - 1000 * 60 * 8)
      )
        return this.executeRecaptcha(this.loginEmail)

      this.logonError = ''
      this.showSpinner(this.$t('loader.LOADING_ACCOUNT').toString())
      this.store.loginComplete = false
      let email = this.walletEmail
      let password = this.walletPassword
      const recaptchaToken = this.recaptchaToken
      let recoveryTypeId = 1
      let fetch_key = email?.toLowerCase()
      let token = ''

      if (
        this.loginUser &&
        (this.loginUser.recoveryTypeId === 3 || this.loginUser.recoveryTypeId === 6)
      ) {
        fetch_key = this.loginUser.key
        email = this.loginUser?.email?.toLowerCase() || this.loginUser.key
        password = this.loginUser.userID
        recoveryTypeId = this.loginUser.recoveryTypeId
        token = this.loginUser.token
      }

      // Call the fetchUser store action to process the wallet logon
      this.fetchUser({
        email,
        password,
        recaptchaToken,
        token,
        recoveryTypeId: recoveryTypeId,
        fetch_key: fetch_key
      })
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
                  this.executeRecaptcha(this.loginEmail)
                  return
                }
                this.logonError = getDictionaryValue('DECRYPT_FAILED')
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

          if (error.error === 'RECAPTCHA_REQUIRED') {
            this.executeRecaptcha(this.loginEmail)
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
              this.logonError = getDictionaryValue(error.error)
              if (this.isIframe() && this.store.connection && this.store.connection !== null) {
                const connection: any = await this.store.connection.promise
                connection.onError(error.error)
              }
            } else {
              // console.log('Error in login', error);
            }
          }
        })
    },
    logout() {
      localStorage.removeItem('lastEmail')
      this.logoutWallet()
    },
    generateImage(seed: any): void {
      if (!seed) {
        return
      }

      this.iconSeed = seed
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        this.login()
      }
    }
  }
})
</script>
