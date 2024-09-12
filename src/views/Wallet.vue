<template>
  <div class="container">

    <h2 data-cy="signUpTitle" class="title">{{ $t('common.MORPHER_WALLET') }}</h2>

    <div class="user-details settings-data">
      <div class="details">
        <div class="is-flex has-text-left">
          <jazzicon :address="store.accounts[0]" class="jazz-icon" :diameter="32" />

          <div class="ml-3">
            <p class="medium-text has-text-weight-medium">
              <span class="important-font"> {{ formatEthAddress(store.accounts[0]) }}</span>
              <span class="copy-icon" @click="copyETHAddress(store.accounts[0])">
                <img alt="copy-image" src="@/assets/img/copy.svg">
              </span>
            </p>
            <p data-cy="currentEmail">{{ store.email }}</p>
          </div>
        </div>
        <div class="buttons horizontal-buttons mt-3">
           <button
            tag="button"
            :class="{ 'cursor-not-allowed': !isIframe() }"
            @click="sendInApp"
            style="position: relative;"
            class="button big-button outlined-button transition-faster"
          >
            <img alt="send token" src="@/assets/img/send.svg">

            <span data-cy="sendButton" class="text">{{ $t('common.SEND') }}</span>
            <div class="tooltip" v-if="!isIframe()">
              {{ $t('common.SEND_DESCRIPTION') }}
            </div> 
          </button>
          
           <button
            @click="$router.push('/settings').catch()"
            class="button big-button outlined-button transition-faster"
          >
            <img alt="settings cog" src="@/assets/img/settings.svg">
            <span data-cy="settingsButton">{{ $t('settings.SETTINGS_TITLE') }}</span>
          </button>  
        </div> 
      </div> 
    </div>

    
    <div class="wallet-issues has-text-left" v-if="issueCount > 0">
      <div class="issue-title is-flex is-align-items-center">
        <img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"> {{ issueCount }} {{ $t('settings.ISSUES_FOUND')}}
      </div>
      <ul>
        <li v-if="noRecoveryMethods">
          {{ $t('settings.ADD_TRUSTED_ACCOUNT') }}.
        </li>

        <li v-if="!twoFactorActive && !twoFactorEmailActive">
          {{ $t('settings.ADD_2FA') }}.
        </li>

      </ul>
 
      <div>
        <router-link to="/settings/">
          {{ $t('settings.GO_TO_SETTINGS') }}
        </router-link>
      </div>
    </div>
    

    <div class="links is-flex is-align-items-center is-justify-content-center">
      <div class="link is-flex has-text-weight-medium is-align-items-center">
        
        <a href="https://support.morpher.com/en/category/morpher-wallet-idvnts/" target="__blank" class="login-router transition-faster is-flex is-align-items-center">
          <img src="@/assets/img/support.svg">
          {{ $t('common.SUPPORT') }}
          </a>
      </div>
      
      <div class="link is-flex has-text-weight-medium is-align-items-center">
        
        <div data-cy="logoutButton" @click="logout()" class="login-router transition-faster  is-flex is-align-items-center">
          <img src="@/assets/img/logout.svg">
          {{ $t('common.LOGOUT') }}
        </div>
      </div>
    </div> 

    <!-- Hidden - only for unit test verification -->
    <div style="display:none">
          <span data-cy="2FAEmailEnabled" v-if="twoFactorEmailActive" >{{ $t('common.ENABLED') }}</span>
          <span data-cy="2FAAuthenticatorEnabled" v-if="twoFactorActive">{{ $t('common.ENABLED') }}</span>
    </div>

  </div>
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import Jazzicon from 'vue3-jazzicon/src/components'

import { copyToClipboard } from '@/utils/utils'
import { defineComponent } from 'vue'

export default defineComponent({
  mixins: [Global, Authenticated],
  components: {
    [Jazzicon.name]: Jazzicon
  },
  data() {
    return {
      dropdownIsActive: false,
      selectedAccount: '',
      noRecoveryMethods: false,
      twoFactorActive: false,
      twoFactorEmailActive: false,
      whatRecovery: {
        facebook: false,
        google: false,
        vkontakte: false,
        apple: false
      },
      iconSeed: ''
    }
  },
  computed: {
    issueCount() {
      let count = 0;
      if (!this.twoFactorActive && !this.twoFactorEmailActive) {
        count +=1;
      }
      if (this.noRecoveryMethods) {
        count +=1;
      }

      return count
    }
  },
  
  async mounted() {
    if (this.isIframe() && !this.store.loginComplete) {
      if (this.store.connection && this.store.connection !== null) {
        const connection: any = await this.store.connection.promise
        connection.onLogin(this.store.accounts[0], this.store.email, this.store?.recoveryTypeId)
      }
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

    this.store.loginComplete = true
  },
  methods: {
    async sendInApp() {
      if (this.isIframe()) {
        if (this.store.connection && this.store.connection !== null) {
          const connection: any = await this.store.connection.promise
          connection.openSendInApp()
        }
      }
    },
    copyETHAddress(ethAddress: string): void {
      copyToClipboard(ethAddress, this.$buefy)
    },
    logout() {
      this.logoutWallet()
    },
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

.copy-button {
  margin-left: auto;
}

.smaller-font {
  font-size: 14px;
}
</style>
