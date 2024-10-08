<template>
  <div class="field">
    <!-- <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div> -->
    <div class="control is-expanded" v-if="!hasRecoveryMethod">
      <button
        class="button big-button outlined-button facebook-button transition-faster"
        @click="doLogin"
        v-if="!hasRecoveryMethod"
        data-cy="appleButton"
      >
        <span class="icon img">
          <img src="@/assets/img/apple_logo.svg" alt="Apple Logo" />
        </span>
        <span>Apple</span>
      </button>
    </div>

    <div class="recovery-active" v-if="hasRecoveryMethod">

      <img src="@/assets/img/apple_logo.svg" alt="Apple Logo" />
      <div style="justify-self: stretch;">
        <p>{{ $t('recovery.APPLE_RECOVERY')}}</p>
        <p class="enable-tag">{{ $t('common.ENABLED') }}</p>
      </div>

      <div class="logon">

            <img @click="doLogin" src="@/assets/img/switch-on.svg">
          
        
      </div>


    </div>


  </div>
</template>

<script lang="ts">
import { sha256 } from '@/utils/cryptoFunctions'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { v4 as uuid } from 'uuid'
import { jwtDecode } from 'jwt-decode'
import { defineComponent } from 'vue'

const rawNonce = uuid()
const state = uuid()

export default defineComponent({
  components: {},
  mixins: [Global, Authenticated],
  data() {
    return {
      hasRecoveryMethod: false,
      clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
      recoveryTypeId: 6
    }
  },
  async mounted() {
    try {
      await (window as any).AppleID.auth.init({
        clientId: this.clientId,
        scope: 'email',
        redirectURI: location.protocol + '//' + location.hostname,
        state: state,
        nonce: rawNonce,
        usePopup: true
      })

      this.hasRecoveryMethod = await this.hasRecovery(this.recoveryTypeId)
    } catch (err) {
      console.log('init error', err)
    }
  },
  methods: {
    processMethod(data: any) {
      this.$emit('processMethod', data)
    },
    async doLogin() {
      try {
        ;(window as any).AppleID.auth
          .signIn()
          .then((userData: any) => {
            this.onLogin(userData)
          })
          .catch((err: any) => {
            this.onError(err)
          })
      } catch (err) {
        this.onError(err)
      }
    },
    onError(error: any) {
      if (
        error &&
        error.detail &&
        error.detail.error &&
        error.detail.error == 'popup_closed_by_user'
      ) {
        return
      }
      let errorMessage = error.error || error.err || error.message || JSON.stringify(error)
      if (error && error.detail && error.detail.error && error.detail.error) {
        errorMessage = error.detail.error
      }
      if (
        errorMessage == 'popup_closed_by_user' ||
        errorMessage == 'user_trigger_new_signin_flow'
      ) {
        return
      }

      this.logSentryError('addAppleRecovery', errorMessage, {
        hasRecoveryMethod: this.hasRecoveryMethod,
        clientId: this.clientId,
        recoveryTypeId: this.recoveryTypeId
      })
      let errorText = error.error || error.err || 'Apple login Error'

      if (String(errorText.toLowerCase()).includes('script not loaded correctly')) {
        errorText = 'apple_script_blocked'
      }

      this.processMethod({
        success: false,
        error: errorText
      })
    },
    async onLogin(appleUser: any) {
      this.showSpinner(this.$t('loader.SAVING_KEYSTORE_RECOVERY'))
      if (appleUser.authorization) appleUser = appleUser.authorization

      const authorizationCode = appleUser.code || appleUser.authorizationCode
      const identityToken = appleUser.id_token || appleUser.identityToken
      const nonce = appleUser.nonce

      const decoded = jwtDecode(identityToken)

      const userID = decoded.sub
      const email = (decoded as any).email
      const key = await sha256(this.clientId + userID)

      this.addRecoveryMethod({
        key,
        password: userID || '',
        recoveryTypeId: this.recoveryTypeId,
        token: JSON.stringify({ identityToken, authorizationCode, nonce }),
        email,
        currentRecoveryTypeId: this.store?.recoveryTypeId
      })
        .then(async () => {
          if ((window as any).gtag)
            (window as any).gtag('event', 'add_recovery', {
              method: 'apple'
            })

          this.showSpinnerThenAutohide(this.$t('loader.SAVED_KEYSTORE_SUCCESSFULLY'))
          this.hasRecoveryMethod = await this.hasRecovery(this.recoveryTypeId)
          this.processMethod({
            success: true,
            method: 'Apple',
            enabled: true,
            erorr: ''
          })
        })
        .catch((error) => {
          let errorMessage = error.error || error.err || error.message || JSON.stringify(error)
          console.log('onLogin error', errorMessage)
          this.logSentryError('addAppleRecovery', errorMessage, {
            hasRecoveryMethod: this.hasRecoveryMethod,
            clientId: this.clientId,
            recoveryTypeId: this.recoveryTypeId,
            appleUser
          })
          this.showSpinnerThenAutohide(this.$t('loader.SAVED_KEYSTORE_ERROR'))
          this.processMethod({
            success: false,
            method: 'Apple',
            enabled: true,
            erorr: ''
          })
        })
    },
    async onDelete(appleUser: any) {
      if (appleUser.authorization) appleUser = appleUser.authorization

      const authorizationCode = appleUser.code || appleUser.authorizationCode
      const identityToken = appleUser.id_token || appleUser.identityToken
      const nonce = appleUser.nonce

      const decoded = jwtDecode(identityToken)

      const userID = decoded.sub

      const key = this.clientId + userID

      this.resetRecoveryMethod({
        key,
        recoveryTypeId: this.recoveryTypeId.toString(),
        token: JSON.stringify({ identityToken, authorizationCode, nonce })
      })
        .then(async () => {
          this.showSpinnerThenAutohide(this.$t('loader.DELETED_KEYSTORE_SUCCESSFULLY'))
          this.hasRecoveryMethod = false
          this.processMethod({
            success: true,
            method: 'Apple',
            enabled: false,
            erorr: ''
          })
        })
        .catch((error) => {
          let errorMessage = error.error || error.err || error.message || JSON.stringify(error)
          console.log('onDelete error', errorMessage)
          this.logSentryError('deleteAppleRecovery', errorMessage, {
            hasRecoveryMethod: this.hasRecoveryMethod,
            clientId: this.clientId,
            recoveryTypeId: this.recoveryTypeId,
            appleUser
          })
          this.showSpinnerThenAutohide(this.$t('common.ERROR_FIND_USER'))
          this.processMethod({
            success: false,
            method: 'Apple',
            enabled: false,
            erorr: ''
          })
        })
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.google-icon {
  color: #fc6404;
}
</style>
