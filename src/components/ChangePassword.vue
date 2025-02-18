<template>
  <div class="card">
    <button @click="$router
      .push(hideOldPassword ? '/login' : '/settings?email_password=true')
      .catch(() => undefined)" tag="button" class="back-button">
      <img alt="chevron-left" src="@/assets/img/back.svg">
    </button>
    <div v-if="currentPage === 0">
      <h2 v-if="!hideOldPassword" class="title">{{ $t('password.CHANGE_PASSWORD_TITLE') }}</h2>
      <h2 v-else class="title">{{ $t('password.RESET_PASSWORD_TITLE') }}</h2>
      <h4 v-if="!hideOldPassword" class="subtitle">
        {{ $t('password.CHANGE_PASSWORD_DESCRIPTION') }}
      </h4>
      <h4 v-else class="subtitle">{{ $t('password.RESET_PASSWORD_DESCRIPTION') }}</h4>
      
        <div class="field" v-if="!hideOldPassword">
          <label class="label">{{ $t('password.OLD_PASSWORD') }}</label>
          <div class="control">
            <input :type="passwordCurrentIsVisible ? 'text' : 'password'" data-cy="oldPassword" name="oldPassword" class="input" v-model="oldPassword"
              @keypress="handleKeyPress" :placeholder="$t('common.ENTER_PASSWORD_CURRENT')" ref="old_password" />
              <button class="password-toggle" v-on:click="toggleCurrentPasswordVisibility" data-cy="password-toggle-button">
              <img v-if="passwordCurrentIsVisible" class="image" src="@/assets/img/password-hide.svg" alt="Visible Button" />
              <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
            </button>
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t('common.NEW_PASSWORD') }}</label>
          <div class="control">
            <input :type="passwordIsVisible ? 'text' : 'password'" name="newPassword" data-cy="newPassword"
              class="input password-input" v-model="walletPassword" @keypress="handleKeyPress"
              :placeholder="$t('common.ENTER_PASSWORD_NEW')" ref="new_password" />
            <button class="password-toggle" v-on:click="togglePasswordVisibility" data-cy="password-toggle-button">
              <img v-if="passwordIsVisible" class="image" src="@/assets/img/password-hide.svg" alt="Visible Button" />
              <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
            </button>
          </div>
          <div>
            <password-meter :passwordChecks="passwordChecks" style="max-width: initial" />
            <div class="password-help">
              <p><b>{{ $t('password.REQUIREMENTS') }}</b></p>
              <ul class="items">
                <li :class="{
                  done: passwordChecks.min === 'pass',
                  fail: passwordChecks.min === 'fail'
                }">
                  {{ $t('password.MIN_CHARACTERS') }}
                </li>
                <li :class="{
                  done: passwordChecks.lowercase === 'pass',
                  fail: passwordChecks.lowercase === 'fail'
                }">
                  {{ $t('password.LOWERCASE_LETTER') }}
                </li>
                <li :class="{
                  done: passwordChecks.uppercase === 'pass',
                  fail: passwordChecks.uppercase === 'fail'
                }">
                  {{ $t('password.UPPERCASE_LETTER') }}
                </li>
                <li :class="{
                  done: passwordChecks.number === 'pass',
                  fail: passwordChecks.number === 'fail'
                }">
                  {{ $t('password.NUMBER') }}
                </li>
                <li :class="{
                  done: passwordChecks.match === 'pass',
                  fail: passwordChecks.match === 'fail'
                }">
                  {{ $t('password.PASSWORD_MATCH') }}
                </li>
              </ul>
            </div>
          </div>
          <div class="field">
            <label class="label">{{ $t('common.CONFIRM_PASSWORD') }}</label>
            <div class="control">
              <input :type="passwordConfirmIsVisible ? 'text' : 'password'" class="input" name="newPasswordRepeat" data-cy="newPasswordRepeat"
                v-model="walletPasswordRepeat" @keypress="handleKeyPress" ref="new_password_repeat" />
              <button class="password-toggle" v-on:click="toggleConfirmPasswordVisibility"
                data-cy="password-toggle-button">
                <img v-if="passwordConfirmIsVisible" class="image" src="@/assets/img/password-hide.svg"
                  alt="Visible Button" />
                <img v-else class="image" src="@/assets/img/password-show.svg" alt="Invisible Button" />
              </button>
            </div>
          </div>

          <div class="error" v-if="logonError">
            <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span data-cy="incorrectPassword" v-html="logonError"></span></p>
          </div>

          <button class="button is-green big-button is-login transition-faster mt-5" type="submit"
            data-cy="passwordSubmit" @click="changePasswordExecute">
            <span class="text">{{ $t('common.UPDATE_PASSWORD') }}</span>
          </button>

        </div>
     
    </div>

    <div v-if="currentPage === 1">
      <div>
        <img src="@/assets/img/checkmark.svg" alt="Checkmark image" class="mb-3" />
        <h2 data-cy="passwordChangeTitle" class="title">
          {{ $t('password.PASSWORD_UPDATED_TITLE') }}
        </h2>
        <p data-cy="passwordChangeDescription" class="subtitle">
          {{ $t('password.PASSWORD_UPDATED_DESCRIPTION') }}
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
import { validateInput } from '@/utils/backupRestore'
import PasswordMeter from '@/components/PasswordMeter.vue'

import { sha256 } from '@/utils/cryptoFunctions'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'
import type { TypePasswordCheck } from '@/types/global-types'

export default defineComponent({
  components: {
    PasswordMeter: PasswordMeter as any
  },
  mixins: [Global, Authenticated],
  data() {
    const passwordChecks: TypePasswordCheck = {
      min: '',
      uppercase: '',
      lowercase: '',
      number: '',
      match: ''
    }

    return {
      currentPage: 0,
      oldPassword: '',
      hideOldPassword: false,
      walletPassword: '',
      walletPasswordRepeat: '',
      logonError: '',
      passwordChecks,
      passwordIsVisible: false,
      passwordConfirmIsVisible: false,
      passwordCurrentIsVisible: false,
    }
  },
  mounted() {
    if (this.presetOldPassword !== undefined) {
      this.oldPassword = this.presetOldPassword
      this.hideOldPassword = true
    }
    this.executeHiddenRecovery()
  },
  methods: {
    executeHiddenRecovery() {
      if (this.store.hiddenLogin && this.store.hiddenLogin.type == 'recovery') {
        let recoveryData = this.store.hiddenLogin.recovery
        if (
          recoveryData.type == 'password' &&
          recoveryData.data &&
          recoveryData.data.password &&
          recoveryData.data.passwordConfirm
        ) {
          this.walletPassword = recoveryData.data.password
          this.walletPasswordRepeat = recoveryData.data.passwordConfirm
          this.changePasswordExecute()
        }
      }
    },
    async changePasswordExecute() {
      console.log('changePasswordExecute')
      this.logonError = ''

      this.passwordChecks = this.checkPassword(
        this.walletPassword,
        true,
        this.passwordChecks,
        this.walletPasswordRepeat
      )

      if (
        Object.keys(this.passwordChecks).some(
          (value: string) => (this.passwordChecks as any)[value] !== 'pass'
        )
      ) {
        return
      }

      const passwordMessage = await validateInput('password', this.walletPassword)

      if (passwordMessage) {
        this.logonError = passwordMessage
        return
      }
      const oldPasswordHashed = this.presetOldPassword || (await sha256(this.oldPassword))
      const newPasswordHashed = await sha256(this.walletPassword)

      this.changePassword({ oldPassword: oldPasswordHashed, newPassword: newPasswordHashed })
        .then(async () => {
          this.oldPassword = ''
          this.walletPassword = ''
          this.walletPasswordRepeat = ''
          this.currentPage = 1

          if (this.presetOldPassword !== undefined) {
            this.logoutWallet()
          }

          if (this.isIframe() && this.store.connection && this.store.connection !== null) {
            const connection: any = await this.store.connection.promise
            connection.onRecovery('passwordUpdated')
          }
        })
        .catch((error) => {
          if (error && error.toString() === 'TypeError: Failed to fetch') {
            this.showNetworkError(true)
          }

          this.logonError = getDictionaryValue('')
        })
    },
    togglePasswordVisibility() {
      this.passwordIsVisible = !this.passwordIsVisible
    },
    toggleCurrentPasswordVisibility() {
      this.passwordCurrentIsVisible = !this.passwordCurrentIsVisible
    },
    toggleConfirmPasswordVisibility() {
      this.passwordConfirmIsVisible = !this.passwordConfirmIsVisible
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        if (this.oldPassword && this.walletPassword && this.walletPasswordRepeat) {
          this.changePasswordExecute()
        } else if (!this.oldPassword) {
          window.setTimeout(() => {
            const element: any = this.$refs.old_password
            if (element) element.focus()
          }, 100)
        } else if (!this.walletPassword) {
          window.setTimeout(() => {
            const element: any = this.$refs.new_password
            if (element) element.focus()
          }, 100)
        } else if (!this.walletPasswordRepeat) {
          window.setTimeout(() => {
            const element: any = this.$refs.new_password_repeat
            if (element) element.focus()
          }, 100)
        }
      }
    },
    resetData() {
      this.currentPage = 0
      this.oldPassword = ''
      this.hideOldPassword = false
      this.walletPassword = ''
      this.walletPasswordRepeat = ''
      this.logonError = ''
      this.passwordChecks = {
        min: '',
        uppercase: '',
        lowercase: '',
        number: '',
        match: ''
      }

      this.$router.push('/')

    },
    onPropertyChanged(value: any) {
      this.executeHiddenRecovery()
    },
    handlePasswordChange(newValue: string) {
      this.passwordChecks = this.checkPassword(
        newValue,
        false,
        this.passwordChecks,
        this.walletPasswordRepeat
      )
    },
    handlePasswordRepeatChange(newValue: string) {
      this.passwordChecks = this.checkPassword(
        this.walletPassword,
        false,
        this.passwordChecks,
        newValue,
        true
      )
    }
  },
  props: {
    presetOldPassword: {
      type: String
    }
  },
  watch: {
    'store.hiddenLogin': [
      {
        handler: 'onPropertyChanged'
      }
    ],
    walletPassword: [
      {
        handler: 'handlePasswordChange'
      }
    ],
    walletPasswordRepeat: [
      {
        handler: 'handlePasswordRepeatChange'
      }
    ]
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button.card-footer-item {
  background-color: transparent;
  cursor: pointer;
  border: 0;
  font-size: 1rem;
  line-height: 1.5;
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>
