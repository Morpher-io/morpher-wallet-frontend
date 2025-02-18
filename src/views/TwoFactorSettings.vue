<template>
  <div class="container">
    <button @click="redirectUser" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>

    

    <div v-if="currentPage === 0">
      <h2 class="title ml-3">{{ $t('settings.2_STEP_VERIFICATION') }}</h2>
      <div class="divider just-space" />

      <Change2FA @setCurrentMethod="setCurrentMethod" :ssoEmailError="ssoEmailError?.toString()" />
    </div>
    <div v-if="currentPage === 1">
      <ConfirmAccess @accessConfirmed="accessConfirmed" @pageBack="pageBack" />
    </div>
    <div v-if="currentPage === 2">
      <ChangeAuthenticator
        v-if="currentMethod === 'authenticator' && secret"
        :qrCode="qrCode"
        :secret="secret"
        @setCode="setCode"
        @pageBack="pageBack"
      />
      <Change2FAEmail v-if="currentMethod === 'email'" @setCode="setCode" @pageBack="pageBack" />
    </div>
    <div v-if="currentPage === 3">
      <div>
        <img src="@/assets/img/checkmark.svg" alt="Checkmark image" class="mb-3" />
        <h2 data-cy="2faConfirmedTitle" class="title">
          {{
            $t('2fa.2_STEP_ACTIVATED', {
              isActivated: isEnabling ? $t('common.ACTIVATED') : $t('common.DEACTIVATED')
            })
          }}
        </h2>
        <p data-cy="2faConfirmedDescription" v-if="isEnabling" class="subtitle">
          {{ $t('2fa.2_STEP_ADDED') }}
        </p>
        <p data-cy="2faDisabledDescription" v-else class="subtitle">
          {{ $t('2fa.2_STEP_REMOVED') }}
        </p>

        <div v-if="!isEnabling" class="alert warning mt-3 is-size-7 has-text-left mb-5">
          <img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"><div>{{ $t('2fa.2_STEP_REMOVED_WARNING') }}</div>
        </div>

        
        <button
          @click="resetData"
          tag="button"
          data-cy="closeButton"
          class="button is-green big-button is-login transition-faster"
        >
          <span class="text">{{ $t('common.DONE') }}</span>
        </button>


        <!-- <div v-if="isEnabling">
          <div class="divider"></div>
          <p class="has-text-left has-text-weight-bold mb-0">{{ $t('2fa.KYC_TITLE') }}</p>
          <p class="has-text-left subtitle mt-0">{{ $t('2fa.KYC_DESCRIPTION') }}</p>
        </div> -->
      </div>
    </div>
    <div class="error" v-if="updateError">
      <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="updateError"></span></p>
    </div>
  </div>
</template>

<script lang="ts">
import Change2FA from '@/components/Change2FA.vue'
import ConfirmAccess from '@/components/ConfirmAccess.vue'
import ChangeAuthenticator from '@/components/ChangeAuthenticator.vue'
import Change2FAEmail from '@/components/Change2FAEmail.vue'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Change2FA: Change2FA as any,
    ConfirmAccess: ConfirmAccess as any,
    ChangeAuthenticator: ChangeAuthenticator as any,
    Change2FAEmail: Change2FAEmail as any
  },
  mixins: [Authenticated, Global],
  data() {
    const passwordTimeout: number | undefined = undefined
    const authenticatorConfirmed: any = false

    return {
      currentPage: 0,
      currentMethod: '',
      qrCode: '',
      authenticatorCode: '',
      emailCode: '',
      email: false,
      authenticator: false,
      authenticatorConfirmed,
      isEnabling: true,
      updateError: '',
      secret: '',
      ssoEmailError: 0,
      passwordTimeout: undefined as number | undefined
    }
  },
  async mounted() {
    this.email = this.store.twoFaRequired.email
    this.authenticator = this.store.twoFaRequired.authenticator
    this.authenticatorConfirmed = this.store.twoFaRequired.authenticatorConfirmed

    if (this.store?.recoveryTypeId == 3 || this.store?.recoveryTypeId == 6) {
      const find = this.store.recoveryMethods.find(
        (recovery) => recovery.id == this.store?.recoveryTypeId
      )
      if (find && find.email == this.store.email) {
        this.ssoEmailError = this.store?.recoveryTypeId
        return
      }
    }

  },
  methods: {
    async submitChange(type: 'email' | 'authenticator') {
      try {
        this.updateError = ''
        if (type === 'email') {
          this.showSpinner(this.$t('loader.LOADING').toString())
          let email = true
          let authenticator = false

          if (!this.isEnabling) {
            email = false
            authenticator = this.authenticator
          }

          let data = await this.change2FAMethods({
            email,
            authenticator,
            email2faVerification: this.emailCode,
            authenticator2faVerification: String(this.authenticatorCode)
          })

          if (this.isEnabling && !this.emailCode) {
            this.email = false
            this.currentPage = 2
          } else {
            this.authenticatorConfirmed = true
            this.email = email
            this.authenticator = authenticator
            this.isEnabling = email
            this.currentPage = 3
          }
        } else if (type === 'authenticator') {
          this.showSpinner(this.$t('loader.LOADING').toString())

          let email = false
          let authenticator = true

          if (!this.isEnabling) {
            email = this.email
            authenticator = false
          }

          await this.change2FAMethods({
            email,
            authenticator,
            email2faVerification: this.emailCode,
            authenticator2faVerification: String(this.authenticatorCode)
          })

          this.email = email
          this.authenticator = authenticator
          this.authenticatorConfirmed = authenticator
          this.currentPage = 3
        }

        this.hideSpinner()
      } catch (error: any) {
        this.hideSpinner()

        if (error && error.toString() === 'TypeError: Failed to fetch') {
          this.showNetworkError(true)
        } else {
          this.logSentryError('submitChange', error.toString(), {})
        }

        this.updateError = getDictionaryValue(error.toString())
      }
    },
    async generateQR() {
      this.authenticatorConfirmed = false
      this.authenticatorCode = ''
      const result = (await this.generateQRCode()) as any

      this.qrCode = result.image
      this.secret = result.secret
      return false
    },
    redirectUser() {
      if (this.currentPage === 0) {
        this.$router.push('/settings').catch(() => undefined)
      } else {
        this.currentPage = 0
      }
      
    },
    pageBack() {
      if (this.currentMethod === 'authenticator' && !this.authenticator && this.currentPage === 2) {
        this.currentPage = 0
        this.qrCode = ''
        this.authenticatorCode = ''
      } else {
        if (this.currentPage > 0) this.currentPage -= 1
        if (this.currentPage == 1) this.currentPage = 0
      }
    },
    setCurrentMethod(method: any) {
      this.isEnabling = method['isEnabling']
      this.currentMethod = method['method']
      if (this.store.unlocked == true || (method.method == 'email' && method.isEnabling == true)) {
        this.accessConfirmed(true)
      } else {
        this.currentPage = 1
      }
    },
    accessConfirmed(access: boolean) {
      if (!access) {
        return
      }

      if (this.currentMethod === 'email') {
        this.emailCode = ''
        this.submitChange('email')
        return
      }

      if (this.passwordTimeout) clearTimeout(this.passwordTimeout)
      this.passwordTimeout = window.setTimeout(() => {
        clearTimeout(this.passwordTimeout)
        this.currentPage = 0
      }, 600000)

      if (!this.authenticator) {
        this.generateQR()
        this.currentPage = 2
      } else {
        this.submitChange('authenticator')
      }
    },
    resetData() {
      this.currentPage = 0
      this.currentMethod = ''
    },
    setCode(code: string) {
      if (!code) return

      if (this.currentMethod === 'email') {
        this.emailCode = code
        this.submitChange('email')
        return
      }

      this.authenticatorCode = code
      this.submitChange('authenticator')
    },
    currentPageChange(newValue: number) {
      if (newValue !== 2 && this.passwordTimeout) {
        clearTimeout(this.passwordTimeout)
      }
    }
  },
  watch: {
    currentPage: [
      {
        handler: 'currentPageChange'
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;

  .title {
    margin: 0;
  }
}
</style>
