import { EnvironmentNetwork } from '../../../../../../shared/environment'
import { VaultStatus } from '../../../../../app/screens/AppNavigator/screens/Loans/VaultStatusTypes'

context('Wallet - Auctions', () => {
  const walletTheme = { isDark: false }
  before(function () {
    cy.intercept('**/settings/flags', {
      body: [{
        id: 'loan',
        name: 'Loan',
        stage: 'public',
        version: '>=0.0.0',
        description: 'Browse loan tokens provided by DeFiChain',
        networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
        platforms: ['ios', 'android', 'web']
      }, {
        id: 'auction',
        name: 'Auction',
        stage: 'public',
        version: '>=0.0.0',
        description: 'Browse auctions provided by DeFiChain',
        networks: [EnvironmentNetwork.MainNet, EnvironmentNetwork.TestNet, EnvironmentNetwork.RemotePlayground, EnvironmentNetwork.LocalPlayground],
        platforms: ['ios', 'android', 'web']
      }]
    })
    cy.createEmptyWallet(true)
    cy.sendDFItoWallet().sendDFITokentoWallet().sendTokenToWallet(['CD10']).wait(6000)
    cy.setWalletTheme(walletTheme)
    cy.getByTestID('bottom_tab_loans').click()
    cy.getByTestID('empty_vault').should('exist')
    cy.createVault(0)
    cy.getByTestID('vault_card_0_manage_loans_button').should('not.exist')
    cy.getByTestID('vault_card_0_edit_collaterals_button').click()
    cy.addCollateral('0.60000000', 'DFI')
    cy.addCollateral('0.00000006', 'dCD10')
  })

  it('should liquidate vault', function () {
    cy.go('back')
    cy.getByTestID('loans_tabs_1').click()
    cy.getByTestID('vault_card_0_manage_loans_button').click()
    cy.getByTestID('button_browse_loans').click()
    cy.getByTestID('loan_card_dTS25').click()
    cy.getByTestID('form_input_borrow').clear().type('3.186').blur()
    cy.wait(3000)
    cy.getByTestID('borrow_loan_submit_button').click()
    cy.getByTestID('button_confirm_borrow_loan').click().wait(3000)
    cy.closeOceanInterface()
    cy.getByTestID('loans_tabs_1').click()
    cy.wrap(Array.from(Array(150), (v, i) => i)).each(() => {
      cy.getByTestID('playground_generate_blocks').click()
      cy.wait(3000)
    })
    cy.checkVaultTag('IN LIQUIDATION', VaultStatus.Liquidated, 'vault_card_0_status', walletTheme.isDark)
  })

  it('should show liquidated vault in auctions', function () {
    cy.getByTestID('bottom_tab_auctions').click()
    cy.getByTestID('batch_0_dTS25').should('exist')
  })
})
