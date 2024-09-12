<template>
  <div class="container">
    <button @click="redirectUser" data-cy="backArrowButton" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>

    <div v-if="currentPage === 0">
      <h2 class="title ml-3">{{ $t('export.EXPORT_WALLET_TITLE') }}</h2>

      <p class="transition-faster">
        <span v-html="$t('export.EXPORT_WALLET_DESCRIPTION')"></span>
        &nbsp;<a
          href="https://support.morpher.com/en/article/export-morpher-wallet-d6wr6g/"
          target="__blank"
          class="login-router"
          >{{ $t('common.LEARN_MORE') }}</a
        >
      </p>

      <button
        class="mt-3 button is-blue big-button is-login transition-faster"
        data-cy="exportSeedPhraseButton"
        type="submit"
        @click="setExport('seed')"
      >
        <span class="text">{{ $t('export.EXPORT_SEED') }}</span>
      </button>


      <button
        data-cy="exportPrivateKeyButton"
        @click="setExport('key')"
        tag="button"
        class="button outlined-button big-button transition-faster mt-2"
      >
        <span class="text">{{ $t('export.EXPORT_KEY') }}</span>
      </button>
    </div>

    <ConfirmAccess
      v-if="currentPage === 1"
      @pageBack="pageBack"
      @accessConfirmed="accessConfirmed"
      :error="logonError"
    />

    <div v-if="currentPage === 2">
      <h2 class="title">{{ $t('export.EXPORT_SEED') }}</h2>
      <p data-cy="seedPhraseSuccess" class="subtitle">{{ $t('export.EXPORT_SEED_DESCRIPTION') }}</p>

      <div class="settings-data user-details">
        <div class="details">
          <p class="seed">{{ store.seedPhrase }}</p>
        </div>
      </div>

      <div class="links is-flex is-align-items-center is-justify-content-center mt-2">
        <div class="link is-flex has-text-weight-medium is-align-items-center">
          <img class="copy-logo" alt="copy-icon" src="@/assets/img/copy.svg">
          <div
            @click="copyToClipboard(store.seedPhrase, $buefy)"
            class="login-router is-size-7 transition-faster"
          >
            {{ $t('common.COPY_TO_CLIPBOARD') }}
          </div>
        </div>
      </div>

      <button
          @click="resetData"
          tag="button"
          class="button is-green big-button is-login transition-faster"
        >
          <span class="text">{{ $t('common.DONE') }}</span>
        </button>
    </div>

    <div v-if="currentPage === 3">
      <h2 class="title">{{ $t('export.EXPORT_KEY') }}</h2>
      <p data-cy="privateKeySuccess" class="subtitle">{{ $t('export.EXPORT_KEY_DESCRIPTION') }}</p>

      <div class="settings-data user-details">
        <div class="details">
          <p data-cy="privateKeyValue" class="seed">{{ store.privateKey }}</p>
        </div>
      </div>

      <div class="links is-flex is-align-items-center is-justify-content-center mt-2">
        <div class="link is-flex has-text-weight-medium is-align-items-center">
          <img class="copy-logo" alt="copy-icon" src="@/assets/img/copy.svg">
          <div
            @click="copyToClipboard(store.privateKey, $buefy)"
            class="login-router is-size-7 transition-faster"
          >
            {{ $t('common.COPY_TO_CLIPBOARD') }}
          </div>
        </div>
      </div>

      <div data-cy="privateKeyJsonMessage" class="alert warning has-text-left is-flex">
        <img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"><div>{{ $t('export.KEY_PASSWORD_PROTECTED') }}</div>
      </div>

      <div class="field">
          <label class="label">{{ $t('common.CONFIRM_PASSWORD') }}</label>

          <div class="control">
            <input
              type="password"
              ref="login_password"
              class="input"
              data-cy="walletPassword"
              name="walletPassword"
              v-model="password"
            />
          </div>
        </div>

      <button
        data-cy="privateKeyJsonButton"
        class="button is-blue big-button is-login transition-faster mt-4"
        @click="exportPhrase(store.accounts[0])"
      >
        <span class="text">{{
          $t('common.DOWNLOAD_TYPE', {
            type: 'JSON'
          })
        }}</span>
      </button>

      <button
        data-cy="exportBackButton"
          @click="resetData"
          tag="button"
          class="button is-green big-button is-login transition-faster"
        >
          <span class="text">{{ $t('common.DONE') }}</span>
        </button>
    </div>
  </div>
</template>

<script lang="ts">
import ConfirmAccess from '@/components/ConfirmAccess.vue'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { copyToClipboard } from '@/utils/utils'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    ConfirmAccess
  },
  mixins: [Global, Authenticated],
  data() {
    return {
      currentPage: 0,
      logonError: '',
      page: '',
      password: '',
      copyToClipboard: copyToClipboard
    }
  },
  methods: {
    redirectUser() {
      if (this.currentPage === 0) {
        this.$router.push('/settings').catch(() => undefined)
      } else {
        this.resetData()
      }
      
    },
    setExport(page: string) {
      this.page = page
      if (this.store.unlocked == true) {
        this.accessConfirmed(true)
      } else {
        this.currentPage = 1
      }
    },
    pageBack() {
      if (this.currentPage > 0) this.currentPage -= 1
    },
    async accessConfirmed(access: boolean) {
      if (!access) return

      if (this.page === 'seed') {
        this.showPhrase(this.password)
        this.currentPage = 2
      } else if (this.page === 'key') {
        this.showKey(this.password)
        this.currentPage = 3
      }
    },
    resetData() {
      this.currentPage = 0
      this.logonError = ''
      this.page = ''
      this.clearPrivateKey()
      this.clearSeedPhrase()
      this.password = ''
    },
    async showKey(password: string) {
      await this.showPrivateKey({ password })
    },
    async showPhrase(password: string) {
      await this.showSeedPhrase({ password })
    },
    async exportPhrase(account: any) {
      await this.exportKeystore({ account, password: this.password })
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

.seed {
  line-height: 1.5rem !important;
  overflow-wrap: break-word;
}

.copy-logo {
  width: 16px;
  padding-right: 5px;
}
</style>
