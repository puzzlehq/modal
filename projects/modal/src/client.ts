import type { ConfigCtrlState, ThemeCtrlState } from '@puzzlehq/walletconnect-modal-core'
import { ConfigCtrl, ModalCtrl, OptionsCtrl, ThemeCtrl } from '@puzzlehq/walletconnect-modal-core'

/**
 * Types
 */
export type WalletConnectModalConfig = ConfigCtrlState & ThemeCtrlState

/**
 * Client
 */
export class WalletConnectModal {
  public constructor(config: WalletConnectModalConfig) {
    ThemeCtrl.setThemeConfig(config)
    ConfigCtrl.setConfig(config)
    this.initUi()
  }

  private async initUi() {
    if (typeof window !== 'undefined') {
      await import('@puzzlehq/walletconnect-modal-ui')
      const modal = document.createElement('wcm-modal')
      document.body.insertAdjacentElement('beforeend', modal)
      OptionsCtrl.setIsUiLoaded(true)
    }
  }

  public openModal = ModalCtrl.open

  public closeModal = ModalCtrl.close

  public subscribeModal = ModalCtrl.subscribe

  public setTheme = ThemeCtrl.setThemeConfig
}
