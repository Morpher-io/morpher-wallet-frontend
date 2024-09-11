<template>
  <div class="container">
    <button @click="redirectUser" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>
    <div v-if="currentPage === 0">

      <h2 class="title ml-3">{{ $t('delete.DELETE_ACCOUNT_TITLE') }}</h2>
      
      <p class="reset-line-height">
        <span
          class="has-text-weight-medium"
          @click="$router.push('/settings/keys')"
          v-html="
            $t('delete.PLEASE_EXPORT_YOUR_WALLET')
          "
        ></span>
        {{ $t('delete.DELETE_TIP') }}
      </p>
      <div class="field is-grouped mb-5">
        <button
          data-cy="deleteAccountButton"
          @click="setNewPage()"
          tag="button"
          class="button big-button is-danger transition-faster"
        >
          <span class="text">{{ $t('delete.DELETE_ACCOUNT_TITLE') }}</span>
        </button>
      </div>

      <div class="has-text-left">
        <p class="info-title">{{ $t('delete.WHAT_DELETE_TITLE') }}</p>
        <p class="info-text">{{ $t('delete.WHAT_DELETE_DESCRIPTION') }}</p>

        <p class="info-title">{{ $t('delete.DOES_DELETE_WALLET_TITLE') }}</p>
        <p class="info-text">{{ $t('delete.DOES_DELETE_WALLET_DESCRIPTION') }}</p>

        <p class="info-title">{{ $t('delete.WHAT_FUNDS_TITLE') }}</p>
        <p class="info-text">{{ $t('delete.WHAT_FUNDS_DESCRIPTION') }}</p>
      </div>
    </div>
    <ConfirmAccess
      v-if="currentPage === 1"
      @pageBack="pageBack"
      @accessConfirmed="accessConfirmed"
      :error="logonError"
    />
    <AccountDeletion
      v-if="currentPage === 2"
      @pageBack="resetData"
      @deleteAccount="deleteAccount"
      :error="logonError"
    />
  </div>
</template>

<script lang="ts">
import AccountDeletion from '@/components/AccountDeletion.vue'
import ConfirmAccess from '@/components/ConfirmAccess.vue'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AccountDeletion,
    ConfirmAccess
  },
  mixins: [Authenticated, Global],
  data() {
    return {
      currentPage: 0,
      logonError: '',
      password: ''
    }
  },
  methods: {
    redirectUser() {
      this.$router.push('/settings').catch(() => undefined)
    },
    setNewPage() {
      if (this.store.unlocked == true) {
        this.currentPage = 2
      } else {
        this.currentPage = 1
      }
    },
    pageBack() {
      if (this.currentPage > 0) this.currentPage -= 1
    },
    async accessConfirmed(access: string) {
      if (!access) return

      this.currentPage = 2
    },
    resetData() {
      this.currentPage = 0
      this.logonError = ''
      this.password = ''
    },
    async deleteAccount(data: any) {
      try {
        this.logonError = ''

        if (data.method === 'seed') {
          const seed = await this.showSeedPhraseBackground({ password: this.password })

          if (!seed || data.input !== seed) {
            this.logonError = this.$t('common.WRONG_SEED').toString()
            return
          }

          try {
            await this.deleteWalletAccount({ password: this.password })
            this.showSpinnerThenAutohide(this.$t('loader.ACCOUNT_DELETED_SUCCESSFULLY').toString())
          } catch (error: any) {
            this.logSentryError('deleteAccount', error.toString(), data)
            if (error && error.toString() === 'TypeError: Failed to fetch') {
              this.showNetworkError(true)
            }

            this.logonError = getDictionaryValue(error.toString())
          }
        } else if (data.method === 'key') {
          const key = await this.showPrivateKeyBackground({ password: this.password })

          if (!key || data.input !== key) {
            this.logonError = this.$t('common.WRONG_PRIVATE_KEY').toString()
            return
          }

          try {
            await this.deleteWalletAccount({ password: this.password })
            this.showSpinnerThenAutohide(this.$t('loader.ACCOUNT_DELETED_SUCCESSFULLY').toString())
          } catch (error: any) {
            this.logSentryError('deleteAccount', error.toString(), data)
            if (error && error.toString() === 'TypeError: Failed to fetch') {
              this.showNetworkError(true)
            }

            this.logonError = getDictionaryValue(error.toString())
          }
        }
      } catch (e: any) {
        this.logSentryError('deleteAccount', e.toString(), data)
        this.logonError = getDictionaryValue('')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.info-title {
  font-weight: 700;
  padding-top: 16px;
  padding-bottom: 0;
  margin: 0;
}
.info-text {
  font-size: 12px;

  padding-top: 2px;
  padding-bottom: 0;
  margin: 0;

}
</style>
