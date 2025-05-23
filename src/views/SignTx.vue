<template>
  <div>
    <spinner v-model="showSpinner" v-bind:status="status"></spinner>
    <div class="container">
      <spinner v-model="showSpinner" v-bind:status="status"></spinner>
      <h2 class="title">{{ $t('common.CONFIRM_TRANSACTION') }}</h2>
      <p class="subtitle" v-if="store.transactionDetails">{{ chainName }}</p>
      <div class="settings-data user-details">
        <div class="details is-flex is-align-items-center">
          <p
            class="layout split first eth-address-copy"
            :data-tooltip="copyTextSrc"
            @click="copySrcETHAddress(store.transactionDetails.from)"
          >
            {{ formatEthAddress(store.transactionDetails.from) }}
          </p>
          <i class="fas fa-arrow-right transfer-icon"></i>
          <p
            class="layout split second eth-address-copy"
            :data-tooltip="copyTextDest"
            @click="copyDestETHAddress(store.transactionDetails.to)"
          >
            {{ formatEthAddress(store.transactionDetails.to) }}
          </p>
        </div>
      </div>

      <div class="divider just-space"></div>

      <div class="card column" v-if="isMPH || store.transactionDetails.value && Number(store.transactionDetails.value) > 0" >
        <p v-if="isMPH" class="eth_balance">{{ roundFormatter(mphValue) }} MPH</p>
        <p v-else class="eth_balance">
          {{ roundFormatter(store.transactionDetails.value / Math.pow(10, 18)) }} ETH
        </p>
      </div>

      <div class="field" v-if="contractData">
        <label class="label">{{ contract }}</label>
        <div class="settings-data user-details">
          <div class="details" v-html="contractData">
            
          </div>
        </div>
      </div>

      <div class="payment-description" v-else>
        <div class="details-group">
          <p class="subtitle has-text-weight-medium">{{ $t('common.GAS_FEE') }}</p>
          <p class="text">
            {{
              roundFormatter(
                (Number(
                  store.transactionDetails.gasPrice || store.transactionDetails.maxFeePerGas
                ) *
                  Number(store.transactionDetails.gas)) /
                  Math.pow(10, 18)
              )
            }}
            ETH
          </p>
        </div>
        <div class="details-group small">
          <p class="subtitle">{{ $t('common.GAS_PRICE') }}</p>
          <p class="text">
            {{
              roundFormatter(
                Number(store.transactionDetails.gasPrice || store.transactionDetails.maxFeePerGas) /
                  Math.pow(10, 9)
              )
            }}
            gwei
          </p>
        </div>
        <div class="details-group small">
          <p class="subtitle">{{ $t('common.GAS_LIMIT') }}</p>
          <p class="text">{{ roundFormatter(Number(store.transactionDetails.gas)) }} gwei</p>
        </div>

        <div class="divider thick"></div>

        <div v-if="!isMPH" class="details-group mb-0">
          <p class="subtitle has-text-weight-medium">{{ $t('common.TOTAL') }}</p>
          <p class="text">
            {{
              roundFormatter(
                Number(store.transactionDetails.value || 0) / Math.pow(10, 18) +
                  (Number(
                    store.transactionDetails.gasPrice || store.transactionDetails.maxFeePerGas
                  ) *
                    Number(store.transactionDetails.gas)) /
                    Math.pow(10, 18)
              )
            }}
            ETH
          </p>
        </div>
        <div v-else class="details-group mb-0 is-align-items-start">
          <p class="subtitle has-text-weight-medium">{{ $t('common.TOTAL') }}</p>
          <p class="text">
            <span class="is-block has-text-right reset-line-height"
              >{{ roundFormatter(mphValue) }} MPH</span
            >
            <span class="is-block has-text-right reset-line-height mt-1"
              >+
              {{
                roundFormatter(
                  (Number(
                    store.transactionDetails.gasPrice || store.transactionDetails.maxFeePerGas
                  ) *
                    Number(store.transactionDetails.gas)) /
                    Math.pow(10, 18)
                )
              }}
              ETH</span
            >
          </p>
        </div>
      </div>

      <button class="button is-green big-button is-login transition-faster mt-5" @click="sign()">
        <span class="text">{{ $t('common.CONFIRM') }}</span>
      </button>

      <button
        @click="cancel()"
        class="button is-ghost is-blue big-button medium-text transition-faster"
      >
        <span class="text">{{ $t('common.CANCEL') }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Authenticated } from '@/mixins/authenticated'
import { Global } from '@/mixins/global'
import { copyToClipboard, roundFormatter } from '@/utils/utils'
import { defineComponent } from 'vue'
import { hexToString, parseTransaction, decodeFunctionData, getAbiItem } from 'viem';
import { morpherOracleAbi } from '@/utils/abis'
export default defineComponent({
  mixins: [Global],
  data() {
    return {
      copyTextSrc: this.$t('common.COPY_TO_CLIPBOARD').toString(),
      copyTextDest: this.$t('common.COPY_TO_CLIPBOARD').toString(),
      copyToClipboard: copyToClipboard,
      contractData: '' as string | undefined,
      contract: ''
    }
  },
  mounted() {
    this.formatTransaction()
  },
  computed: {
    chainName() {
      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 21) {
        return 'Morpher Sidechain'
      }

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 210) {
        return 'Morpher Dev Sidechain'
      }

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 2100) {
        return 'Morpher Staging Sidechain'
      }

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 1) {
        return 'Etherum Mainchain'
      }

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 42) {
        return 'Kovan Testnet'
      }

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 11155111) {
        return 'Sepolia'
      }

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 137) {
        return 'Polygon Mainchain'
      }

      return this.store.transactionDetails.chainId
    },
    mphValue() {
      if (this.store.transactionDetails && this.store.transactionDetails.mph_value) {
        return Number(this.store.transactionDetails.mph_value) / Math.pow(10, 18)
      } else {
        return 0
      }
    },
    isMPH() {
      return this.store.transactionDetails && this.store.transactionDetails.mph_value
    }
  },
  methods: {
    formatTransaction() {
      if (this.store.transactionDetails.data) {
        try {
          const data = decodeFunctionData({
            abi: morpherOracleAbi,
            data: this.store.transactionDetails.data
          })
          if (data && data.functionName) {

            let msg = '';
            

            
            let functionName = (data as any).functionName;
            let contract = 'Morpher Oracle - ' + functionName;
            this.contract =contract
            // @ts-ignore
            const encodedData:any = getAbiItem({
                          abi: morpherOracleAbi,
              name: functionName, 
            })
            if (encodedData) {
              let components = encodedData.inputs[0].components
              let item = 0
              
              components.forEach((component: any) => {
                let dat = data.args[item].toString()
                if (component.name == '_openMPHTokenAmount' && dat !== '0') {
                  dat = roundFormatter(Number(dat) / 10**18) + ' MPH'
                }

                if (component.name == '_orderLeverage' && dat !== '0') {
                  dat = roundFormatter(Number(dat) / 10**8) 
                }
      
                msg += `<b>${component.name}:</b>&nbsp;${ dat }<br>`
                item +=1
              } )

            }
            
            this.contractData = msg
          

          }
        } catch (err) {
          this.contractData = undefined
        }

      }
      

      
      
    },
    sign() {
      this.store.signResponse = 'confirm'
      this.$router.push('/').catch(() => undefined)
    },
    cancel() {
      this.store.signResponse = 'cancel'
      this.$router.push('/').catch(() => undefined)
    },
    copySrcETHAddress(text: string) {
      copyToClipboard(text, this.$buefy)
      this.copyTextSrc = this.$t('common.ETH_ADDRESS_COPIED').toString()
      setTimeout(() => {
        this.copyTextSrc = this.$t('common.COPY_TO_CLIPBOARD').toString()
      }, 5000)
    },
    copyDestETHAddress(text: string) {
      copyToClipboard(text, this.$buefy)
      this.copyTextDest = this.$t('common.ETH_ADDRESS_COPIED').toString()
      setTimeout(() => {
        this.copyTextDest = this.$t('common.COPY_TO_CLIPBOARD').toString()
      }, 5000)
    }
  }
})
</script>

<style lang="scss" scoped>
.eth_balance {
  font-size: 24px;
  margin: 10px
}

.transaction-breakdown {
  font-size: 20px;
}

.section-no-header {
  padding: 1rem 1.5rem;
}

.source-dest-output {
  border-bottom: 1px solid grey;
}

.transfer-icon {
  display: inline-block;
  font-size: 22px;
}

.eth-address-copy {
  cursor: pointer;
  font-size: 16px;
}

.card {
  display: flex;
  padding: 10px 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 195, 134, 0.1);
  border: 1px solid #00c386;
  box-shadow:
    0 1px 2px 0 rgb(0 195 134 / 20%),
    0 5px 12px 0 rgb(0 0 0 / 10%);
  position: relative;
  z-index: 1;

  &.column {
    flex-direction: column;
  }
}

.label {
  font-size: 18px!important
}

.details {
  overflow-wrap: break-word;
}

.payment-description {
  padding: 10px;
  background: #f9f9f9;
  margin:  10px;
  position: relative;
  border-radius: 0 0 10px 10px;
 
  .details-group {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    height: 25px;

    .subtitle {
      margin: 0;
    }

    .text {
      margin-left: auto;
      font-size: 16px;
    }

    &.small {
      padding-left: 20px;
      position: relative;
      margin-bottom: 0;

      + .small {
        margin-top: 3px;
      }

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 15px;
        height: 1px;
        background: #bababa;
      }

      .subtitle {
        font-size: 14px;
      }

      .text {
        font-size: 14px;
      }
    }
  }
}
</style>
