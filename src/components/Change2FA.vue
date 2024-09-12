<template>
  <div class="card">
    <div class="custom-card">
   
        <div class="is-flex is-align-items-center">
          <img src="@/assets/img/email_icon.svg">
          <div class="has-text-left">
            <p>{{ $t('common.EMAIL') }}</p>
            <p data-cy="email2faConfirmed" class="enabled" v-if="store.twoFaRequired.email">{{ $t('2fa.VERIFICATION_ENABLED') }}</p>
          </div>
          <img v-if="!store.twoFaRequired.email" src="@/assets/img/switch-off.svg" class="switch" data-cy="emailToggle"  :disabled="
            store.ipCountry == 'RU' ||
            ((Number(ssoEmailError) == 3 || Number(ssoEmailError) == 6) &&
              store.twoFaRequired.email == false)
          " @click="setCurrentMethod('email', !store.twoFaRequired.email)">
          <img v-else src="@/assets/img/switch-on.svg" class="switch" data-cy="emailToggle"   :disabled="
            store.ipCountry == 'RU' ||
            ((Number(ssoEmailError) == 3 || Number(ssoEmailError) == 6))
          " @click="setCurrentMethod('email', !store.twoFaRequired.email)">
      
        
        </div>
        <div class="info is-text-small has-text-left">
          <p v-if="!store.twoFaRequired.email && Number(ssoEmailError) == 3">
            {{ $t('2fa.2_STEP_EMAIL_ERROR_GOOGLE') }}
          </p>
          <p v-else-if="!store.twoFaRequired.email && Number(ssoEmailError) == 6">
            {{ $t('2fa.2_STEP_EMAIL_ERROR_APPLE') }}
          </p>
          <p v-else>{{ $t('2fa.2FA_EMAIL_DESCRIPTION') }}</p>
          <p class="is-secondary">{{ store.email }}</p>
        

      </div>
      
    </div>

    <div class="custom-card">

      <div class="is-flex is-align-items-center">
          <img src="@/assets/img/authenticator-icon.svg">
          <div class="has-text-left">
            <p>{{ $t('common.AUTHENTICATOR') }}</p>
            <p data-cy="authenticator2faConfirmed" class="enabled" v-if="store.twoFaRequired.authenticator">{{ $t('2fa.VERIFICATION_ENABLED') }}</p>
          </div>
          <img v-if="!store.twoFaRequired.authenticator" src="@/assets/img/switch-off.svg" data-cy="authenticatorToggle" class="switch"  
           @click="setCurrentMethod('authenticator', !store.twoFaRequired.authenticator)">
          <img v-else src="@/assets/img/switch-on.svg"  data-cy="authenticatorToggle" class="switch"  
           @click="setCurrentMethod('authenticator', !store.twoFaRequired.authenticator)">
      
        
        </div>

        <div class="info is-text-small has-text-left">
            <p>{{ $t('2fa.2FA_AUTH_DESCRIPTION') }}</p>

        </div>
    </div>
    

    <div  class="alert warning has-text-left is-flex">
        <img src="@/assets/img/warning-triangle.svg" alt="warning-triangle"><div>{{ $t('2fa.VERIFICATION_LOSE') }}</div>
      </div>
  </div>
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { defineComponent } from 'vue'

export default defineComponent({
  mixins: [Authenticated, Global],
  props: {
    ssoEmailError: {
      type: String
    }
  },
  methods: {
    setCurrentMethod(method: any, isEnabling: boolean) {
      if (isEnabling && (this as any).$gtag && (window as any).gtag)
			(window as any).gtag('event', 'add_2fa', {
				method
			});

      this.$emit('setCurrentMethod', { method, isEnabling })
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
