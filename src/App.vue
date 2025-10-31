<template>
  <div id="app">
    <div v-if="!iFrameDisplay" class="image-blur"></div>
    <section
      :class="{
        main_iframe: iFrameDisplay,
        main: !iFrameDisplay,
        'dev-border': isDev
      }"
    >
      <spinner v-bind:active="loading" v-bind:status="spinnerStatusText"></spinner>
      <NetworkError :active="isNetworkError && !loading" />
      


      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <div class="footer is-text-small">
        <div>
          <span class="icon is-small">
            <i class="fas fa-lock"></i>
          </span>
          <span>{{ $t('common.SECURED_WALLET') }}</span>
        </div>
        <a href="https://www.morpher.com/privacy" target="_blank">{{
          $t('common.PRIVACY_POLICY')
        }}</a>
      </div>
    </section>
    <Footer v-if="!iFrameDisplay" :NFTBackground="NFTBackground" />
  </div>
</template>

<script lang="ts">
import isIframe from '@/utils/isIframe'
import { defineComponent } from 'vue'
import Spinner from '@/components/loading-spinner/Spinner.vue'
import NetworkError from '@/components/NetworkError.vue'
import Footer from '@/components/Footer.vue'
import { RouterLink, RouterView } from 'vue-router'

import { getRandomNFTBackground } from '@/utils/backgroundNFT'
import type { BackgroundNFT } from '@/utils/backgroundNFT'
import { mapState } from 'pinia'
import { useWalletStore } from '@/stores/wallet'
import { connectToParent } from 'penpal'
import type { MorpherWalletConfig } from './types/global-types'
import { i18n } from '@/plugins/i18n'
import Cookie from 'js-cookie'
import { fromHex } from 'viem'
import { checkOrigin } from './utils/utils'
const whiteListedContracts = [
  '0x1ca8d44347e88a80c4582cd0acefbbd3653e0a6f', // base swap helper
  '0xbecc5de84e44675efaeca23361d4ff95262b5ee8', // base staking
  '0x694aa11ec58b7de7f1bb3a83dae00dca55dc986b', // base oracle
  '0x03e68738500b0b8d114391ca2ce2f5511eb4b036', // base airdrop
  '0x80d618070430bbe8148ee9f7f328aa0f229d95a1', // base bridge

  '0xeaea3c0cdcc9946fba36f3802c6fec9339d845c1', // base sepolia swap helper
  '0x2ec9f092e618d4c7fc6ffce59c6b71d428fbf979', // base sepolia staking
  '0xe40f08b4b02abe9bb826932fb58c7911372a4bc6', // base sepolia oracle
  '0xe42e00ec67e5d24b8da6fdbcc5c100a9ebe99e13', // base sepolia airdrop

]
export default defineComponent({
  components: {
    Spinner: Spinner as any,
    NetworkError: NetworkError as any,
    Footer: Footer as any,
    RouterView
  },
  computed: {
    ...mapState(useWalletStore, {
      loading: (state) => state.loading,
      isNetworkError: (state) => state.isNetworkError,
      spinnerStatusText: (state) => state.spinnerStatusText,
      unlocking: (state) => state.unlocking,
      connection: (state) => state.connection,
      signResponse: (state) => state.signResponse,
      isLoggedIn: (state) => state.isLoggedIn,
      store: (state) => state,
      loginEmail: (state) => state.loginEmail,
    })
  },
  data() {
    return {
      iFrameDisplay: isIframe(),
      isDev: import.meta.env.VITE_MODE !== 'production',
      NFTBackground: null as BackgroundNFT | null
    }
  },
  mounted() {

    if (!this.iFrameDisplay) {
      this.NFTBackground = getRandomNFTBackground()

      let url = new URL('/img/nft_backgrounds/' + this.NFTBackground.image, import.meta.url).href
      url = `url('${url}')`
      window.document.body.style.backgroundImage = url
    } else {
      const storeObject = this.store
      const loginEmail = this.loginEmail
      const routerObject = this.$router

      //parent origin removed - this is handled by forcing confirmation if origin is not morpher.com
      // old origin -- import.meta.env.VITE_MODE === 'production' ? /^https:\/\/[w]{0,3}\.?morpher\.com\/?.*$/ : /.*/gm,
            
      const conn = connectToParent({
        parentOrigin: /.*/gm,
          

        // Methods child is exposing to parent
        methods: {
          async getAccounts() {
            if (storeObject.keystore != null) {
              let account = ''
              storeObject.accounts.forEach((acc) => {
                account = acc.toString()
              })
              if (account) {
                return [account]
              } else {
                return []
              }
            } else {
              return []
            }
          },
          async signTransaction(txObj: any, config: MorpherWalletConfig) {
            if (txObj.eth_balance) {
              storeObject.ethBalance = txObj.eth_balance
            }
            if (txObj.gas && String(txObj.gas).includes('0x')) {
              txObj.gas = fromHex(txObj.gas, 'bigint')
            }
            if (txObj.gasPrice && String(txObj.gasPrice).includes('0x')) {
              txObj.gasPrice = fromHex(txObj.gasPrice, 'bigint')
            }
            if (txObj.nonce && String(txObj.nonce).includes('0x')) {
              txObj.nonce = fromHex(txObj.nonce, 'bigint')
            }
            
            
            // if (!txObj.gas) {
            //   txObj.gas = BigInt(21000)
            // }
            if (txObj.value && String(txObj.value).includes('0x')) {
              txObj.value = fromHex(txObj.value, 'bigint')
            }
            if (txObj.maxFeePerGas && String(txObj.maxFeePerGas).includes('0x')) {
              txObj.maxFeePerGas = fromHex(txObj.maxFeePerGas, 'bigint')
            }

            if (txObj.maxPriorityFeePerGas && String(txObj.maxPriorityFeePerGas).includes('0x')) {
              txObj.maxPriorityFeePerGas = fromHex(txObj.maxPriorityFeePerGas, 'bigint')
            }

            const signedTx = await new Promise((resolve, reject) => {
              //see if we are logged in?!
              try {

                let origin: string = conn.getOrigin()
                let showOverride = false
                if (!isIframe || !checkOrigin(origin)) {
                  if (storeObject?.walletEmail && storeObject.walletEmail.includes('@email.com') && storeObject.walletEmail.includes('test') ) {
                    showOverride = false
                  } else {
                    showOverride = true
                  }
                }

                // for public chains make sure that we only auto sign morpher contracts
                if ([8453, 84532].includes(Number(txObj.chainId))  && showOverride === false) {
                  let to_address = txObj?.to?.toLowerCase()
                  if (!whiteListedContracts.includes(to_address)) {
                    showOverride = true;
                  }

                }


                if (storeObject.keystore !== null) {
                  if (
                    config?.confirm_transaction ||
                    showOverride ||
                    (Number(txObj.chainId) !== 21 &&
                      Number(txObj.chainId) !== 210 &&
                      Number(txObj.chainId) !== 8453 &&
                      Number(txObj.chainId) !== 84532 &&
                      Number(txObj.chainId) !== 2100)
                  ) {
                    conn.promise.then((connection: any) => {
                      connection.showWallet()
                    });
                    if (txObj.amount && !txObj.value) {
                      txObj.value = txObj.amount
                    }
                    storeObject.transactionDetails = txObj
                    storeObject.signResponse = null
                    routerObject.push('/signtx').catch(() => undefined)
                    const interval = setInterval(() => {
                      if (storeObject.signResponse) {
                        clearInterval(interval)
                        if (storeObject.signResponse === 'confirm') {
                          storeObject.signResponse = null

                          if (storeObject.keystore !== null) {
                            storeObject.keystore
                              .signTransaction(txObj)
                              .then((tran: any) => {
                                conn.promise.then((connection: any) => {
                                  connection.hideWallet()
                                });
                                resolve(tran)
                              })
                              .catch(
                                reject
                              )
                          } else {
                            conn.promise.then((connection: any) => {
                              connection.hideWallet()
                            });
                            resolve(null)
                          }
                        } else {
                          storeObject.signResponse = null
                          conn.promise.then((connection: any) => {
                            connection.hideWallet()
                          });
                          resolve(null)
                        }
                      }
                    }, 500)
                  } else {
                    storeObject.keystore
                      .signTransaction(txObj)
                      .then((tran: any) => {
                        resolve(tran)
                      })
                      .catch(reject)
                  }
                }
              } catch (e) {
                reject(e)
              }
            })
            return signedTx
          },
          async signMessage(tx: any, config: MorpherWalletConfig) {

            let sign_hash = tx?.data || tx[0] || tx;
            let message_standard = tx?.messageStandard || 'signPersonalMessage'
            
            const signedTx = await new Promise((resolve, reject) => {
              //see if we are logged in?!
              try {
                if (storeObject.keystore !== null) {
                  let origin: string = conn.getOrigin()
                  let showOverride = false
                  if (!isIframe || !checkOrigin(origin)) {
                    if (storeObject?.walletEmail && storeObject.walletEmail.includes('@email.com') && storeObject.walletEmail.includes('test') ) {
                      showOverride = false
                    } else {
                      showOverride = true
                    }
                  }

                  if (config?.confirm_message || showOverride) {
                    conn.promise.then((connection: any) => {
                      connection.showWallet()
                    });
                    storeObject.messageDetails = sign_hash
                    storeObject.signResponse = null
                    routerObject.push('/signmsg').catch(() => undefined)

                    const interval = setInterval(() => {
                      if (storeObject.signResponse) {
                        clearInterval(interval)
                        if (storeObject.signResponse === 'confirm') {
                          storeObject.signResponse = null
                          if (storeObject.keystore !== null) {
                            if (message_standard == 'signTypedMessage') {
                              const data = JSON.parse(sign_hash)

                              const account = storeObject.keystore

                              account
                                .signTypedData(data)
                                .then((result) => {
                                  conn.promise.then((connection: any) => {
                                    connection.hideWallet()
                                  });
                                  resolve(result)
                                })
                                .catch((e) => {
                                  conn.promise.then((connection: any) => {
                                    connection.hideWallet()
                                  });
                                  reject(e)
                                })
                            } else {
                              const signedData = storeObject.keystore.signMessage({message: { raw: sign_hash}})
                              conn.promise.then((connection: any) => {
                                connection.hideWallet()
                              });
                              resolve(signedData)
                            }
                          } else {
                            conn.promise.then((connection: any) => {
                              connection.hideWallet()
                            });
                            resolve(null)
                          }
                        } else {
                          storeObject.signResponse = null
                          conn.promise.then((connection: any) => {
                            connection.hideWallet()
                          });
                          resolve(null)
                        }
                      }
                    }, 500)
                  } else {
                    if (message_standard == 'signTypedMessage') {
                      const data = JSON.parse(sign_hash)

                      const account = storeObject.keystore

                      account
                        .signTypedData(data)
                        .then((result) => {
                          resolve(result)
                        })
                        .catch((e) => {
                          reject(e)
                        })
                    } else {
                      storeObject.keystore
                        .signMessage({message: { raw: sign_hash}})
                        .then((result) => {
                          resolve(result)
                        })
                        .catch((e) => {
                          reject(e)
                        })
                    }
                  }
                }
              } catch (e) {
                console.log('signMessageError', {tx, config}, e)
                reject(e)
              }
            })
            return signedTx
          },
          showPage(pageName: string) {
            if (pageName) {
              storeObject.openPage = pageName
              return true
            }

            return false
          },
          async loginWalletHidden(type: string, user: string, password: string) {
            if (storeObject.isLoggedIn) {
              localStorage.removeItem('lastEmail')
              storeObject.logout()

              setTimeout(() => {
                if (routerObject.currentRoute.value.path !== '/login')
                  routerObject.push('/login').catch(() => undefined)

                if (storeObject.hiddenLogin) {
                  storeObject.hiddenLoginAction({})
                }
                storeObject.hiddenLoginAction({ action: 'login', type, user, password })
              }, 3000)
            } else {
              localStorage.removeItem('lastEmail')
              storeObject.logout()
              if (routerObject.currentRoute.value.path !== '/login')
                routerObject.push('/login').catch(() => undefined)

              if (storeObject.hiddenLogin) {
                storeObject.hiddenLoginAction({})
              }
              storeObject.hiddenLoginAction({ action: 'login', type, user, password })
            }
          },
          async signupWalletHidden(
            type: string,
            walletEmail: string,
            walletPassword: string,
            walletPasswordRepeat: string,
            loginUser: any
          ) {
            
            if (storeObject.isLoggedIn) {
              storeObject.logout()
              setTimeout(() => {
                routerObject.push('/signup').catch(() => undefined)
                if (storeObject.hiddenLogin) {
                  storeObject.hiddenLoginAction({})
                }
                storeObject.hiddenLoginAction({
                  action: 'singup',
                  type,
                  walletEmail,
                  walletPassword,
                  walletPasswordRepeat,
                  loginUser
                })
              }, 3000)
            } else {
              routerObject.push('/signup').catch(() => undefined)
              if (storeObject.hiddenLogin) {
                storeObject.hiddenLoginAction({})
              }
              storeObject.hiddenLoginAction({
                action: 'singup',
                type,
                walletEmail,
                walletPassword,
                walletPasswordRepeat,
                loginUser
              })
            }
          },

          async walletRecoveryHidden(type: string, data: any) {
            if (type !== 'password') {
              if (storeObject.isLoggedIn) {
                storeObject.logout()
              }
              routerObject.push('/recovery').catch(() => undefined)
            }
            if (storeObject.hiddenLogin) {
              storeObject.hiddenLoginAction({})
            }
            storeObject.hiddenLoginAction({ action: 'recovery', type: 'recovery', recovery: { type, data } })
          },
          async loginWallet2fa(twoFACode: string) {
            routerObject.push('/2fa').catch(() => undefined)
            if (storeObject.hiddenLogin) {
              storeObject.hiddenLoginAction({})
            }
            storeObject.hiddenLoginAction({ action: '2fa', type: '2fa', twoFACode: twoFACode })
          },
          async loginWallet2faSend(twoFACode: string) {
            routerObject.push('/2fa').catch(() => undefined)
            if (storeObject.hiddenLogin) {
              storeObject.hiddenLoginAction({})
            }
            storeObject.hiddenLoginAction({ action: '2fasend', type: '2fasend', twoFACode: twoFACode })
          },
          async isLoggedIn() {
            let counter = 0

            const waitForUnlock = () => {
              return new Promise((resolve) => {
                setTimeout(resolve, 200)
              })
            }
            // wait for the store to finish unlocking if it is in progress
            while (storeObject.unlocking && counter < 50) {
              counter += 1
              // wait for the wallet to finish unlocking
              await waitForUnlock()
            }
            const recoveryMethods = storeObject.recoveryMethods

            if (storeObject.keystore) {
              let account = ''
              let accounts: any = []
              storeObject.accounts.forEach((acc) => {
                account = acc.toString()
              })
              if (account) {
                accounts = [account]
              }
              let methods: any = []
              if (recoveryMethods && recoveryMethods.length > 0) {
                recoveryMethods.forEach((method) => {
                  methods.push(method.toString())
                })
              }

              return {
                isLoggedIn: true,
                walletEmail: storeObject.email,
                accounts: accounts,
                recovery_type: storeObject.recoveryTypeId,

                recoveryMethods: methods,
                twoFaRequired: {
                  email: storeObject.twoFaRequired.email,
                  authenticator: storeObject.twoFaRequired.authenticator,
                  authenticatorConfirmed: storeObject.twoFaRequired.authenticatorConfirmed,
                  needConfirmation: storeObject.twoFaRequired.needConfirmation,
                  app_lang: storeObject.twoFaRequired.app_lang || ''
                }
              }
            } else return { isLoggedIn: false }
          },
          async hasSocialRecoveryMethods() {
            const waitForRecovery = () => {
              return new Promise((resolve) => {
                setTimeout(resolve, 200)
              })
            }
            let counter = 0
            // wait for the store to finish unlocking if it is in progress
            while (!storeObject.recoveryLoaded && counter < 50) {
              counter += 1
              // wait for the wallet to finish unlocking
              await waitForRecovery()
            }
            if (!storeObject.recoveryLoaded) {
              return true
            }

            if (storeObject.recoveryTypeId && storeObject.recoveryTypeId !== 1) {
              return true
            }
            if (!storeObject.recoveryMethods.find((method) => Number(method.id) !== 1)) {
              return false
            }
            return true
          },
          logout() {
            storeObject.logout()
          },
          setLanguage(lang?: string): void {
            const supportedLocales: string[] = JSON.parse(
              import.meta.env.VITE_I18N_SUPPORTED_LOCALE || ''
            ) || ['en']

            if (lang && supportedLocales.includes(lang)) {
              i18n.locale = lang as any
              document.querySelector('html')?.setAttribute('lang', lang)
              if (lang === 'ar') document.querySelector('html')?.setAttribute('dir', 'rtl')
              else document.querySelector('html')?.setAttribute('dir', '')
              Cookie.set('locale', lang)

              if (storeObject.keystore) {
                storeObject.updateUserPayload({ column: 'app_lang', value: lang })
              }
            }
          }
        }
      })

      this.store.setConnection(conn)
    }
  },
  methods: {
    async closeWallet() {
      if (this.iFrameDisplay) {
        if (this.connection && this.connection !== null) {
          const connection: any = await this.connection.promise
          this.signResponse = 'cancel'
          connection.hideWallet()
          connection.onClose()

          if (this.isLoggedIn) {
            if (
              this.$router.currentRoute.value.path !== '/' &&
              this.$router.currentRoute.value.path !== '/recovery'
            )
              this.$router.push('/').catch(() => undefined)
          } else {
            if (this.$router.currentRoute.value.path !== '/login')
              this.$router.push('/login').catch(() => undefined)
          }
        }
      }
    }
  }
})
</script>
