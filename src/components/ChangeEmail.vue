<template>
  <div class="card">
    <div>
      <div>
        <div class="card-content">
          <div class="content">
            <div class="field">
              <label class="label">{{ $t('common.CURRENT_EMAIL') }}</label>
              <div class="control">
                {{ store.email }}
              </div>
            </div>
            <div class="field">
              <label class="label">{{ $t('common.NEW_EMAIL') }}</label>
              <div class="control">
                <input
                  data-cy="newEmail"
                  class="input"
                  name="newEmail"
                  ref="new_email"
                  v-model="newEmail"
                  :placeholder="$t('common.ENTER_EMAIL')"
                  @keypress="handleKeyPress"
                />
              </div>
            </div>
            <div class="field" v-if="store.recoveryTypeId == 1">
              <label class="label">{{ $t('common.PASSWORD') }}</label>
              <div class="control">
                <input
                  data-cy="confirmPassword"
                  type="password"
                  class="input"
                  name="password"
                  ref="new_password"
                  v-model="password"
                  :placeholder="$t('common.ENTER_PASSWORD')"
                  @keypress="handleKeyPress"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="error" v-if="logonError">
          <p><img src="@/assets/img/warning.svg" alt="warning-icon"> <span v-html="logonError"></span></p>
        </div>

        <div class="mt-5">
          <!-- <div v-if="recoveryTypeId == 3">
						<LoginGoogle :update="true" @processMethod="processMethod"></LoginGoogle>
					</div>
					<div v-else-if="recoveryTypeId == 6">
						<LoginApple :update="true" @processMethod="processMethod"></LoginApple>
					</div> -->
          <button
            class="button is-green big-button is-login transition-faster"
            data-cy="updateEmailButton"
            :disabled="!newEmail || (!password && store?.recoveryTypeId !== 3 && store?.recoveryTypeId !== 6)"
            @click="
              setNewData({
                email: newEmail,
                password: password
              })
            "
          >
            <span class="text">{{ $t('common.UPDATE_EMAIL') }}</span>
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { validateInput } from '@/utils/backupRestore'
import { sha256 } from '@/utils/cryptoFunctions'
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import LoginGoogle from '@/components/LoginGoogleV2.vue'
import LoginApple from '@/components/LoginApple.vue'
import { getDictionaryValue } from '@/utils/dictionary'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    LoginApple: LoginApple as any,
    LoginGoogle: LoginGoogle as any
  },
  mixins: [Global, Authenticated],
  data() {
    const loginUser: any = {}

    return {
      newEmail: '',
      password: '',
      logonError: '',
      loginUser,
    }
  },
  methods: {
    processMethod(data: any): void {
      this.logonError = ''

      if (data.success) {
        this.loginUser = data

        this.setNewData({
          email: this.newEmail,
          password: this.loginUser.userID
        })
      } else {
        if (data.error === 'popup_closed_by_user') {
          this.logonError = getDictionaryValue('GOOGLE_COOKIES_BLOCKED')
        } else if (data.error === 'google_script_blocked') {
          this.logonError = getDictionaryValue('GOOGLE_SCRIPT_BLOCKED')
        } else {
          this.logonError = data.method + ': ' + getDictionaryValue(data.error)
        }
      }
    },
    async setNewData(data: any) {
      this.logonError = ''

      if (!data.email) {
        return this.$emit('setNewData', { email: null, password: null })
      }

      const emailMessage = await validateInput('email', data.email)

      if (emailMessage) {
        this.logonError = emailMessage
        return this.$emit('setNewData', { email: null, password: null })
      }

      let newPassword = ''
      if (this.store?.recoveryTypeId !== 3 && this.store?.recoveryTypeId !== 6) {
        newPassword = await sha256(data.password)

        if (this.store.hashedPassword !== newPassword) {
          this.logonError = this.$t('errors.WRONG_PASSWORD').toString()
          return this.$emit('setNewData', { email: null, password: null })
        }
      }

      if (this.store.email === this.newEmail) {
        this.logonError = this.$t('errors.SAME_EMAIL').toString()
        return this.$emit('setNewData', { email: null, password: null })
      }

      return this.$emit('setNewData', { email: data.email, password: newPassword })
    },
    handleKeyPress(e: any) {
      const key = e.which || e.charCode || e.keyCode || 0

      if (key === 13) {
        if (this.newEmail && this.password) {
          this.setNewData({
            email: this.newEmail,
            password: this.password
          })
        } else if (!this.newEmail) {
          window.setTimeout(() => {
            const element: any = this.$refs.new_email
            if (element) element.focus()
          }, 100)
        } else if (!this.password) {
          window.setTimeout(() => {
            const element: any = this.$refs.new_password
            if (element) element.focus()
          }, 100)
        }
      }
    },
    handleErorrChange(newValue: string) {
      if (newValue) this.logonError = newValue
    }
  },
  props: {
    error: {
      type: String
    }
  },
  watch: {
    error: [
      {
        handler: 'handleErorrChange'
      }
    ]
  }
})
</script>

