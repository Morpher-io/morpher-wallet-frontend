<template>
  <div class="container">
    <button @click="redirectUser" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>

      <h2 v-if="!isEmailPasswordPage" class="title ml-3">{{ $t('settings.SETTINGS_TITLE') }}</h2>
      <h2 v-if="isEmailPasswordPage" class="title ml-3">{{ $t('settings.EMAIL_AND_PASSWORD') }}</h2>


    <div v-if="!isEmailPasswordPage" class="settings-data">
      <div
        data-cy="emailPasswordButton"
        key="email_passowrd"
        class="settings-link is-flex is-align-items-center"
        @click="changeActive('email_password')"
      >
        <img src="@/assets/img/email-password.svg" />
        <span class="text">
          {{ $t('settings.EMAIL_AND_PASSWORD') }}
        </span>
        <span class="icon">
          <img src="@/assets/img/chevron-right.svg" alt="right-chevron">
        </span>
      </div>

      <div
        data-cy="recoverySettings"
        key="recovery"
        class="settings-link is-flex is-align-items-center"
        @click="changeActive('recovery')"
      >
      <img src="@/assets/img/trusted-account.svg" />
        <span class="text">
          {{ $t('settings.TRUSTED_ACCOUNT') }}
        </span>

        <span class="icon">
          <img v-if="noRecoveryMethods" src="@/assets/img/warning.svg" alt="warning-icon">

          <img src="@/assets/img/chevron-right.svg" alt="right-chevron">
        </span>
      </div>

      <div
        data-cy="verificationSettings"
        key="2FA"
        class="settings-link is-flex is-align-items-center"
        @click="changeActive('2FA')"
      >
        
        <img src="@/assets/img/2fa-verification.svg" />
        <span class="text">
          {{ $t('settings.2_STEP_VERIFICATION') }}
        </span>
        <span class="icon">
          <img v-if="!twoFactorActive && !twoFactorEmailActive" src="@/assets/img/warning.svg" alt="warning-icon">
          <img src="@/assets/img/chevron-right.svg" alt="right-chevron">
        </span>
      </div>

      <div
        key="keys"
        class="settings-link is-flex is-align-items-center"
        data-cy="exportWalletButton"
        @click="changeActive('keys')"
      >
        <img src="@/assets/img/export-wallet.svg" />
        <span class="text">
          {{ $t('settings.EXPORT_WALLET') }}
        </span>
        <span class="icon">
          <img src="@/assets/img/chevron-right.svg" alt="right-chevron">
        </span>
      </div>

      <div
        data-cy="deleteAccountSettings"
        key="delete"
        class="settings-link is-flex is-align-items-center"
        @click="changeActive('delete')"
      >
      <img src="@/assets/img/delete-account.svg" />
        <span class="text">
          {{ $t('settings.DELETE_ACCOUNT') }}
        </span>
        <span class="icon">
          <img src="@/assets/img/chevron-right.svg" alt="right-chevron">
        </span>
      </div>
    </div>

    <div v-else class="settings-data">
      <div
        key="email"
        class="settings-link email-password is-flex is-align-items-center reset-cursor"
      >
        <div class="data">
          <p class="has-text-weight-bold"><b>{{ $t('common.EMAIL') }}</b></p>
          <p>{{ store.email }}</p>
        </div>
        <div class="link">
          <div
            class="login-router transition-faster"
            data-cy="emailChangeButton"
            @click="changeActive('email')"
          >
          <i class="fas fa-pen-square" style="font-size: 18px"></i>
          </div>
        </div>
      </div>
      <div
        v-if="Number(store.recoveryTypeId) == 1"
        key="password"
        class="settings-link email-password is-flex is-align-items-center reset-cursor"
      >
        <div class="data">
          <p class="has-text-weight-bold"><b>{{ $t('common.PASSWORD') }}</b></p>
          <p>********</p>
        </div>
        <div class="link">
          <div
            class="login-router transition-faster"
            data-cy="passwordChangeButton"
            @click="changeActive('password')"
          >
            <i class="fas fa-pen-square" style="font-size: 18px"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChangePassword from '@/components/ChangePassword.vue'
import ChangeEmail from '@/components/ChangeEmail.vue'
import Change2FA from '@/components/Change2FA.vue'
import AccountRecovery from '@/components/AccountRecovery.vue'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    ChangePassword,
    ChangeEmail,
    Change2FA,
    AccountRecovery
  },
  mixins: [Authenticated, Global],
  data() {
    return {
      activePage: '',
      isEmailPasswordPage: false,
      noRecoveryMethods: false,
      twoFactorActive: false,
      twoFactorEmailActive: false,
    }
  },
  mounted() {
    if (this.$route.query.email_password) {
      this.isEmailPasswordPage = true
      this.activePage = 'email_password'
      this.$router.replace({ query: {} })
    }

    if (!this.store.recoveryMethods.find((method: any) => Number(method.id) !== 1)) {
      this.noRecoveryMethods = true
    }
    if (this.store.twoFaRequired.authenticator) {
      this.twoFactorActive = true
    }
    if (this.store.twoFaRequired.email) {
      this.twoFactorEmailActive = true
    }
  },
  methods: {
    redirectUser() {
      if (this.activePage === 'email_password') {
        this.isEmailPasswordPage = false
        this.activePage = ''
        return
      }

      this.$router.push('/').catch(() => undefined)
    },
    changeActive(page: string) {
      this.activePage = page

      if (page === 'email_password') {
        this.isEmailPasswordPage = true
        return
      }

      this.$router.push('/settings/' + page).catch(() => undefined)
    }
  }
})
</script>

<style lang="scss" scoped>
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

.title-container {
  display: flex;
  align-items: center;

  .title {
    margin: 0;
  }
}
</style>
