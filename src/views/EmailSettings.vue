<template>
  <div class="container">
    <button @click="redirectUser" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>
    <h2 class="title">{{ $t('email.EMAIL_SETTINGS_TITLE') }}</h2>
    <h4 class="subtitle">{{ $t('email.EMAIL_SETTINGS_DESCRIPTION') }}</h4>
    <ChangeEmail v-if="currentPage === 0" @setNewData="setNewData" :error="logonError" />
    <Change2FAEmail
      v-if="currentPage === 1"
      @setCode="setCode"
      @pageBack="pageBack"
      :error="logonError"
      :verifyCode="false"
    />
    <div v-if="currentPage === 2">
      <div>
        <img src="@/assets/img/checkmark.svg" alt="Checkmark image" class="mb-3" />
        <h2 data-cy="emailUpdatedTitle" class="title">{{ $t('email.EMAIL_UPDATED_TITLE') }}</h2>
        <p data-cy="emailUpdatedDescription" class="subtitle">
          {{ $t('email.EMAIL_UPDATED_DESCRIPTION') }}
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
import ChangeEmail from '@/components/ChangeEmail.vue'
import Change2FAEmail from '@/components/Change2FAEmail.vue'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    ChangeEmail: ChangeEmail as any,
    Change2FAEmail: Change2FAEmail as any
  },
  mixins: [Authenticated, Global],
  data() {
    const twoFa: any = null

    return {
      currentPage: 0,
      newEmail: '',
      password: '',
      twoFaSent: false,
      twoFa,
      logonError: '',
    }
  },
  methods: {
    async submitChange() {
      return this.changeEmail({
        newEmail: this.newEmail,
        password: this.password,
        twoFa: this.twoFa
      })
    },
    async setNewData(data: any) {
      if (!data.email || (!data.password && this.store?.recoveryTypeId !== 3 && this.store?.recoveryTypeId !== 6))
        return

      this.newEmail = data.email
      this.password = data.password

      try {
        this.logonError = ''
        await this.submitChange()

        this.currentPage = 1
        this.twoFaSent = true
        this.twoFa = false
      } catch (error: any) {
        if (error && error.toString() === 'TypeError: Failed to fetch') {
          this.showNetworkError(true)
        } else {
          this.logSentryError('setNewData', error.toString(), data)
        }

        this.logonError = getDictionaryValue(error.toString())
      }
    },
    async setCode(code: string) {
      if (!code) return

      this.twoFa = code

      try {
        this.logonError = ''
        await this.submitChange()

        this.currentPage = 2
      } catch (error: any) {
        if (error && error.toString() === 'TypeError: Failed to fetch') {
          this.showNetworkError(true)
        } else {
          this.logSentryError('setCode', error.toString(), { code })
        }

        this.logonError = getDictionaryValue(error.toString())
      }
    },
    pageBack() {
      if (this.currentPage > 0) this.currentPage -= 1
    },
    redirectUser() {
     
      this.$router.push('/settings?email_password=true').catch(() => undefined)
    },
    resetData() {
      this.currentPage = 0
      this.newEmail = ''
      this.password = ''
      this.twoFaSent = false
      this.twoFa = null
      this.logonError = ''
      this.$router.push('/').catch(() => undefined)
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
</style>
