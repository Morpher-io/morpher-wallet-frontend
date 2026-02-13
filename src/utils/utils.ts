import { i18n } from '@/plugins/i18n'
import download from 'downloadjs'

import type { HDAccount, Hex } from 'viem'

function getAccountsFromKeystore(keystore: HDAccount) {
  const accounts: Array<string> = []
  accounts.push(keystore.address)
  return accounts
}

function downloadEncryptedKeystore(exportedSeed: any, account: string) {
  const now = new Date()
  download(exportedSeed, 'keystore' + '--' + now.toISOString() + '--' + account + '.json')
}

export const roundFormatter = (param: any) => {
  const price = parseFloat(param)
  const abs = Math.abs(price)
  let round = 0
  if (10000 > abs && abs >= 10) round = 2
  else if (10 > abs && abs >= 1) round = 3
  else if (1 > abs && abs >= 0.1) round = 4
  else if (0.1 > abs && abs >= 0.01) round = 5
  else if (0.01 > abs && abs >= 0.001) round = 6
  else if (0.001 > abs && abs >= 0.0001) round = 7
  else if (0.0001 > abs && abs >= 0.00001) round = 8
  else if (0.00001 > abs) round = 9
  return price ? price.toFixed(round) : '0'
}

function sortObject(object: any) {
  if (typeof object != 'object' || object instanceof Array)
    // Not to sort the array
    return object
  const keys = Object.keys(object)
  keys.sort()
  const newObject: any = {}
  for (let i = 0; i < keys.length; i++) {
    newObject[keys[i]] = sortObject(object[keys[i]])
  }
  return newObject
}

/*
 * Function uses to copy the given text to the clipboard. ses a hidden textArea to copy the text
 */
const copyToClipboard = (text: string, buefy: any) => {
  const textArea = document.createElement('textarea')
  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed'
  textArea.style.top = '0px'
  textArea.style.left = '0px'

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em'
  textArea.style.height = '2em'

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = '0px'

  // Clean up any borders.
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    textArea.style.display = 'none'

    if (successful) {
      document.body.removeChild(textArea)

      buefy.snackbar.open({
        duration: 5000,
        message: i18n.t('COPY_CLIPBOARD_SUCCESS').toString(),
        type: 'is-success',
        position: 'is-bottom-left',
        actionText: 'OK',
        queue: true
      })
      return 'COPY_CLIPBOARD_SUCCESS'
    } else {
      document.body.removeChild(textArea)
      buefy.snackbar.open({
        duration: 5000,
        message: i18n.t('COPY_CLIPBOARD_FAIL').toString(),
        type: 'is-success',
        position: 'is-bottom-left',
        actionText: 'OK',
        queue: true
      })
      return 'COPY_CLIPBOARD_FAIL'
    }
  } catch (err) {
    console.log('err', err)
    document.body.removeChild(textArea)
    buefy.snackbar.open({
      duration: 5000,
      message: i18n.t('COPY_CLIPBOARD_FAIL').toString(),
      type: 'is-success',
      position: 'is-bottom-left',
      actionText: 'OK',
      queue: true
    })
    //console.error('Fallback: Oops, unable to copy', err);
    return 'COPY_CLIPBOARD_FAIL'
  }
}

const formatEthAddress = (ethAddress: string) => {
  if (!ethAddress) return ''
  if (ethAddress.length <= 11) return ethAddress
  return ethAddress
    ? ethAddress.substr(0, 5) + '...' + ethAddress.substr(ethAddress.length - 3)
    : ''
}

const checkOrigin = (origin: string) => {
  const originCheck =
    import.meta.env.VITE_MODE === 'production'
      ? /^https:\/\/([w]{0,3}\.?morpher\.com|[w]{0,3}\.?frenzy\.finance)\/?.*$/
      : /^https:\/\/(dev-test\.?morpher\.com|[w]{0,3}\.?frenzy\.finance)\/?.*$/
  const regex = new RegExp(originCheck)
  return regex.test(origin)
}

export {
  getAccountsFromKeystore,
  downloadEncryptedKeystore,
  sortObject,
  copyToClipboard,
  formatEthAddress,
  checkOrigin
}
