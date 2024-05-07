import { CoreUtil, OptionsCtrl } from '@puzzlehq/walletconnect-modal-core'
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { SvgUtil } from '../../utils/SvgUtil'
import { ThemeUtil } from '../../utils/ThemeUtil'
import { UiUtil } from '../../utils/UiUtil'
import styles from './styles.css'

@customElement('wcm-web-connecting-view')
export class WcmWebConnectingView extends LitElement {
  public static styles = [ThemeUtil.globalCss, styles]

  // -- state & properties ------------------------------------------- //
  @state() public isError = false

  // -- lifecycle ---------------------------------------------------- //
  public constructor() {
    super()
    this.openWebWallet()
  }

  // -- private ------------------------------------------------------ //
  private onFormatAndRedirect(uri: string) {
    const { desktop, name } = CoreUtil.getWalletRouterData()
    const universalUrl = desktop?.universal

    if (universalUrl) {
      const href = CoreUtil.formatUniversalUrl(universalUrl, uri, name)
      if (
        name === 'Puzzle Wallet' &&
        // @ts-expect-error window.aleo may be undefined
        window?.aleo?.connectPuzzle &&
        // @ts-expect-error window.aleo may be undefined
        window?.aleo?.puzzleWalletClient
      ) {
        const url = new URL(href)
        const params = url.searchParams
        const wcUri = params.get('uri')
        const requestId = params.get('requestId')
        const sessionTopic = params.get('sessionTopic')
        // @ts-expect-error window.aleo may be undefined
        window.aleo.connectPuzzle({
          wc: {
            uri: wcUri,
            requestId: requestId ?? undefined,
            sessionTopic: sessionTopic ?? undefined
          }
        })
      } else {
        CoreUtil.openHref(href, '_blank')
      }
    }
  }

  private openWebWallet() {
    const { walletConnectUri } = OptionsCtrl.state
    const routerData = CoreUtil.getWalletRouterData()
    UiUtil.setRecentWallet(routerData)
    if (walletConnectUri) {
      this.onFormatAndRedirect(walletConnectUri)
    }
  }

  // -- render ------------------------------------------------------- //
  protected render() {
    const { name, id, image_id } = CoreUtil.getWalletRouterData()
    const { isMobile, isDesktop } = UiUtil.getCachedRouterWalletPlatforms()
    const isMobilePlatform = CoreUtil.isMobile()

    return html`
      <wcm-modal-header
        title=${name}
        .onAction=${UiUtil.handleUriCopy}
        .actionIcon=${SvgUtil.COPY_ICON}
      ></wcm-modal-header>

      <wcm-modal-content>
        <wcm-connector-waiting
          walletId=${id}
          imageId=${ifDefined(image_id)}
          label=${`Continue in ${name}...`}
          .isError=${this.isError}
        ></wcm-connector-waiting>
      </wcm-modal-content>

      <wcm-info-footer>
        <wcm-text color="secondary" variant="small-thin">
          ${`${name} web app has opened in a new tab. Go there, accept the connection, and come back`}
        </wcm-text>

        <wcm-platform-selection
          .isMobile=${isMobile}
          .isDesktop=${isMobilePlatform ? false : isDesktop}
          .isRetry=${true}
        >
          <wcm-button .onClick=${this.openWebWallet.bind(this)} .iconRight=${SvgUtil.RETRY_ICON}>
            Retry
          </wcm-button>
        </wcm-platform-selection>
      </wcm-info-footer>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wcm-web-connecting-view': WcmWebConnectingView
  }
}
