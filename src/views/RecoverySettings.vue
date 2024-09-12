<template>
  <div class="container">
    <button @click="redirectUser" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>

    <ConfirmAccess
      v-if="currentPage === 0"
      @pageBack="pageBack"
      @accessConfirmed="accessConfirmed"
    />
    <div v-if="currentPage === 1">
      <img src="@/assets/img/recover.svg" :alt="$t('recovery.ACCOUNT_RECOVERY') ">

      <h2 class="title ml-3">{{ $t('recovery.ACCOUNT_RECOVERY') }}</h2>
      <p class="subtitle">
        {{ $t('recovery.ADD_TRUSTED_ACCOUNT') }}
      </p>

      <div class="error mt-3 mb-3" v-if="logonError">
        <p><img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"><img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"> <span v-html="logonError"></span></p>
      </div>
      <div>
        <AddRecoveryApple
          v-if="whatRecovery.apple && store.recoveryTypeId !== 6"
          @processMethod="processMethod"
        >
        </AddRecoveryApple>

        <AddRecoveryGoogle
          v-if="whatRecovery.google && store.recoveryTypeId !== 3"
          @processMethod="processMethod"
        >
        </AddRecoveryGoogle>

        <AddRecoveryFacebook
          v-if="whatRecovery.facebook"
          :walletEmail="store.email"
          @processMethod="processMethod"
        >
        </AddRecoveryFacebook>

        <AddRecoveryVkontakte
          v-if="whatRecovery.vkontakte"
          :walletEmail="store.email"
          @processMethod="processMethod"
        >
        </AddRecoveryVkontakte>
      </div>

      <div
        v-if="
          !whatRecovery.google ||
          !whatRecovery.facebook ||
          !whatRecovery.vkontakte ||
          !whatRecovery.apple
        "
      >
        <p
          v-if="
            whatRecovery.google ||
            whatRecovery.facebook ||
            whatRecovery.vkontakte ||
            whatRecovery.apple
          "
          class="another-text has-text-left mt-5"
        >
          {{ $t('recovery.ADD_ANOTHER_ACCOUNT') }}
        </p>

        <AddRecoveryApple
          v-if="!whatRecovery.apple && store.recoveryTypeId !== 6"
          @processMethod="processMethod"
        >
        </AddRecoveryApple>

        <AddRecoveryGoogle
          v-if="!whatRecovery.google && store.recoveryTypeId !== 3"
          @processMethod="processMethod"
        >
        </AddRecoveryGoogle>

        <AddRecoveryFacebook
          v-if="!whatRecovery.facebook"
          :walletEmail="store.email"
          @processMethod="processMethod"
        >
        </AddRecoveryFacebook>

        <AddRecoveryVkontakte
          v-if="!whatRecovery.vkontakte"
          :walletEmail="store.email"
          @processMethod="processMethod"
        >
        </AddRecoveryVkontakte>
      </div>

      <div class="divider just-space" />

      <div class="has-text-left mt-5 is-size-7">
        <p class="is-flex">
           <img src="@/assets/img/encrypted.svg" alt="encrypted data shield" ><b>{{ $t('recovery.ADD_ACCOUNT_TIP_TITLE') }}</b>
        </p>
        <p class="is-text-small">
          {{ $t('recovery.ADD_ACCOUNT_TIP_DESCRIPTION') }}
        </p>
      </div>
    </div>
    <div v-if="currentPage === 2">
      <div>
        <img src="@/assets/img/checkmark.svg" alt="Checkmark image" class="mb-3" />
        <h2 class="title">
          {{
            $t('recovery.RECOVERY_ENABLED', {
              currentMethod,
              isEnabled: $t(isEnabled ? 'common.ENABLED' : 'common.DISABLED')
            })
          }}
        </h2>
        <p class="subtitle">
          {{
            $t('recovery.TRUSTED_CHANGED', {
              isActivated: $t(isEnabled ? 'common.ACTIVATED' : 'common.DEACTIVATED')
                .toString()
                .toLowerCase()
            })
          }}
        </p>

        <button
          @click="resetData"
          tag="button"
          class="button is-green big-button is-login transition-faster"
        >
          <span class="text">{{ $t('common.DONE') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import AddRecoveryApple from '@/components/AddRecoveryApple.vue'
import AddRecoveryGoogle from '@/components/AddRecoveryGoogle.vue'
import AddRecoveryFacebook from '@/components/AddRecoveryFacebook.vue'
import AddRecoveryVkontakte from '@/components/AddRecoveryVkontakte.vue'
import ConfirmAccess from '@/components/ConfirmAccess.vue'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AddRecoveryGoogle,
    AddRecoveryFacebook,
    AddRecoveryVkontakte,
    ConfirmAccess,
    AddRecoveryApple
  },
  mixins: [Authenticated, Global],
  data() {
    return {
      currentPage: 0,
      newPassword: '',
      logonError: '',
      currentMethod: '',
      isEnabled: false,
      whatRecovery: {
        facebook: false,
        google: false,
        vkontakte: false,
        apple: false
      },
      processing: {
        facebook: false,
        google: false,
        vkontakte: false
      }
    }
  },
  async mounted() {
    if (this.store.unlocked == true) {
      this.currentPage = 1
    }
    const facebook = await this.hasRecovery(2)
    const google = await this.hasRecovery(3)
    const vkontakte = await this.hasRecovery(5)
    const apple = await this.hasRecovery(6)

    this.whatRecovery = {
      facebook,
      google,
      vkontakte,
      apple
    }
  },
  methods: {
    pageBack() {
      this.redirectUser()
    },
    async accessConfirmed(access: boolean) {
      if (access) {
        this.currentPage = 1
      }
    },
    async setPassword(password: string) {
      if (!password) return

      this.newPassword = password
      this.currentPage = 1
    },
    redirectUser() {
      this.$router.push('/settings').catch(() => undefined)
    },
    async processMethod(data: any) {
      this.logonError = ''

      if (data.success) {
        this.currentMethod = data.method
        this.isEnabled = data.enabled
        this.currentPage = 2
      } else {
        let error = ''
        if (data.error === 'popup_closed_by_user') {
          this.logonError = getDictionaryValue('GOOGLE_COOKIES_BLOCKED')
        } else if (data.error === 'google_script_blocked') {
          this.logonError = getDictionaryValue('GOOGLE_SCRIPT_BLOCKED')
        } else {
          this.logonError = data.method + ': ' + getDictionaryValue(data.error)
        }

        if (this.isIframe() && this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.onError(error)
        }
      }
    },
    async resetData() {
      this.currentPage = 1
      this.logonError = ''
      this.currentMethod = ''
      this.isEnabled = false

      const facebook = await this.hasRecovery(2)
      const google = await this.hasRecovery(3)
      const vkontakte = await this.hasRecovery(5)
      const apple = await this.hasRecovery(6)

      this.whatRecovery = {
        facebook,
        google,
        vkontakte,
        apple
      }
    }
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

.another-text {
  margin-bottom: -10px;
  font-weight: 700;

}
</style>
