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
          {{ roundFormatter(Number(store.transactionDetails.value) / Math.pow(10, 18)) }} ETH
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
import { morpherAirdropAbi, morpherOracleAbi, morpherStakingABI, morpherTokenAbi } from '@/utils/abis'

const oracleContracts = [
  '0x694aa11ec58b7de7f1bb3a83dae00dca55dc986b', // base oracle
  '0xe40f08b4b02abe9bb826932fb58c7911372a4bc6', // base sepolia oracle
]

const stakingContracts = [
'0xbecc5de84e44675efaeca23361d4ff95262b5ee8', // base staking
'0x2ec9f092e618d4c7fc6ffce59c6b71d428fbf979', // base sepolia staking
]

const airdropContracts = [
  '0xe42e00ec67e5d24b8da6fdbcc5c100a9ebe99e13', // base sepolia airdrop
  '0x03e68738500b0b8d114391ca2ce2f5511eb4b036', // base airdrop
]

const tokenContracts = [
  '0x2a30a10ae314e28375af1cbfaf05693dfbe27715', // base sepolia token
  '0x537c96c822c15b8361f4dbbe56805bd4e60d0f05', // base token
]
  

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

      if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 8453) {
        return 'Base'
      }

       if (this.store.transactionDetails && Number(this.store.transactionDetails.chainId) === 84532) {
        return 'Base Sepolia'
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
      console.log('formatTransaction', this.store.transactionDetails.to)
      if (this.store.transactionDetails.data) {
        try {

          let to = this.store.transactionDetails.to?.toLowerCase()

          if (!to) {

            return this.contractData = undefined
          }

          let contractName = ''

          let abi = undefined
          if (oracleContracts.includes(to)) {
            contractName = 'Oracle'
            abi = morpherOracleAbi
          } else if (stakingContracts.includes(to)) {
            contractName = 'Staking'
            abi = morpherStakingABI
          } else if (airdropContracts.includes(to)) {
            contractName = 'Airdrop'
            abi = morpherAirdropAbi
          } else if (tokenContracts.includes(to)) {
            contractName = 'Token'
            abi = morpherTokenAbi
          }


          if (!abi) {
            return this.contractData = undefined
          }
          

          const data = decodeFunctionData({
            abi: abi,
            data: this.store.transactionDetails.data
          })


          if (data && data.functionName) {

            let msg = '';
            
            let functionName = (data as any).functionName;
            let contract = `Morpher ${contractName} - ${functionName}`;
            this.contract =contract
            // @ts-ignore
            const encodedData:any = getAbiItem({
                          abi: abi,
              name: functionName, 
            })
            console.log('encodedData', encodedData)
            if (encodedData) {
              let components = encodedData.inputs[0].components || encodedData.inputs
              console.log('components', components)
              let item = 0
              
              components.forEach((component: any) => {
                console.log('component.name', component.name)
                let dat = (data.args as any)[item].toString()
                if (component.name == '_openMPHTokenAmount' && dat !== '0') {
                  dat = roundFormatter(Number(dat) / 10**18) + ' MPH'
                }

                if (component.name == 'amount' && dat !== '0') {
                  dat = roundFormatter(Number(dat) / 10**18) + ' MPH'
                }
                if (component.name == 'value' && dat !== '0') {
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
