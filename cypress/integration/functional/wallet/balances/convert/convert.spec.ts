context('Wallet - Convert DFI - bi-direction success case', () => {
  before(function () {
    cy.createEmptyWallet(true)

    cy.getByTestID('bottom_tab_settings').click()
    cy.sendDFItoWallet().wait(4000)

    cy.getByTestID('bottom_tab_balances').click()
    cy.getByTestID('balances_list').should('exist')
    cy.getByTestID('balances_row_0_utxo').should('exist')
    cy.getByTestID('balances_row_0_utxo_amount').contains(10)
  })

  it('utxosToToken: default start with 0', function () {
    cy.getByTestID('balances_row_0_utxo').click()
    cy.getByTestID('convert_button').click()

    cy.getByTestID('text_preview_input_desc').contains('DFI (UTXO)')
    cy.getByTestID('text_preview_input_value').contains('10 DFI')
    cy.getByTestID('text_preview_output_desc').contains('DFI (TOKEN)')
    cy.getByTestID('text_preview_output_value').contains('0 DFI')

    // cy.getByTestID('button_continue_convert').should('not.be.enabled')
  })

  it('utxosToToken: should build summary correctly with max amount button', function () {
    cy.getByTestID('MAX_amount_button').click()
    cy.getByTestID('text_preview_input_value').contains('0 DFI')
    cy.getByTestID('text_preview_output_value').contains('10 DFI')
    cy.getByTestID('button_continue_convert').should('not.be.disabled')
  })

  it('utxosToToken: should build summary correctly with half amount button', function () {
    cy.getByTestID('50%_amount_button').click()
    cy.getByTestID('text_preview_input_value').contains('5 DFI')
    cy.getByTestID('text_preview_output_value').contains('5 DFI')
    cy.getByTestID('button_continue_convert').should('not.be.disabled')
  })

  it('utxosToToken: should build summary correctly', function () {
    // https://github.com/cypress-io/cypress/issues/1171#issuecomment-364059485
    cy.getByTestID('text_input_convert_from_input')
      .clear()
      .invoke('attr', 'type', 'text') // cypress issue with numeric/decimal input, must cast
      .type('1.23')

    cy.getByTestID('text_preview_input_value').contains('8.77 DFI')
    cy.getByTestID('text_preview_output_value').contains('1.23 DFI')
    cy.getByTestID('button_continue_convert').should('not.be.disabled')
  })

  it('utxosToToken: should be able to convert successfully', function () {
    cy.intercept('/v0/playground/transactions/send').as('sendRaw')
    cy.getByTestID('button_continue_convert').click()
    cy.closeOceanInterface()

    // check UI redirected (balances root)
    // cy.getByTestID('balances_list').should('exist')

    // // result check
    // // wait for one block
    cy.wait(4000)

    // // refresh balance
    cy.getByTestID('bottom_tab_settings').click()
    cy.fetchWalletBalance()
    cy.getByTestID('bottom_tab_balances').click()

    cy.getByTestID('balances_list').should('exist')
    cy.getByTestID('balances_row_0_utxo').should('exist')
    cy.getByTestID('balances_row_0_utxo_amount').contains('8.769') // fee deducted, balance should be 8.77 - 0.0...1
    cy.getByTestID('balances_row_0').should('exist')
    cy.getByTestID('balances_row_0_amount').contains(1.23)
  })

  it('tokenToUtxos: default start with 0', function () {
    cy.getByTestID('bottom_tab_balances').click()
    cy.getByTestID('balances_row_0').click()
    cy.getByTestID('convert_button').click()

    cy.getByTestID('text_preview_input_desc').contains('DFI (TOKEN)')
    cy.getByTestID('text_preview_input_value').contains('1.23 DFI')
    cy.getByTestID('text_preview_output_desc').contains('DFI (UTXO)')
    // action balance can be 8.769xxxxx UTXOS, must split into 2 assertions
    cy.getByTestID('text_preview_output_value').contains('8.769').contains('DFI')
  })

  it('tokenToUtxos: should build summary correctly with max amount button', function () {
    cy.getByTestID('MAX_amount_button').click()
    cy.getByTestID('text_preview_input_value').should('contain', '0 DFI')
    cy.getByTestID('text_preview_output_value').should('contain', '9.999').contains('DFI')
    cy.getByTestID('button_continue_convert').should('not.be.disabled')
  })

  it('tokenToUtxos: should build summary correctly with half amount button', function () {
    cy.getByTestID('50%_amount_button').click()
    cy.getByTestID('text_preview_input_value').should('contain', '0.615 DFI')
    cy.getByTestID('text_preview_output_value').should('contain', '9.384').contains('DFI')
    cy.getByTestID('button_continue_convert').should('not.be.disabled')
  })

  it('tokenToUtxos: should build summary correctly', function () {
    cy.getByTestID('text_input_convert_from_input')
      .clear()
      .invoke('attr', 'type', 'text') // cypress issue with numeric/decimal input, must cast
      .type('0.4')

    cy.getByTestID('text_preview_input_value').should('contain', '0.83 DFI')
    cy.getByTestID('text_preview_output_value').should('contain', '9.169').contains('DFI')
    cy.getByTestID('button_continue_convert').should('not.be.disabled')
  })

  it('tokenToUtxos: should be able to convert successfully', function () {
    cy.intercept('/v0/playground/transactions/send').as('sendRaw')
    cy.getByTestID('button_continue_convert').click()
    cy.closeOceanInterface()

    // check UI redirected (balances root)
    cy.getByTestID('balances_list').should('exist')

    // // result check
    // // wait for one block
    cy.wait(3100)

    // // refresh balance
    cy.getByTestID('bottom_tab_settings').click()
    cy.fetchWalletBalance()
    cy.getByTestID('bottom_tab_balances').click()

    cy.getByTestID('balances_list').should('exist')
    cy.getByTestID('balances_row_0_utxo').should('exist')
    cy.getByTestID('balances_row_0_utxo_amount').contains('9.169') // fee deducted, balance should be 9.17 - 0.0...1
    cy.getByTestID('balances_row_0').should('exist')
    cy.getByTestID('balances_row_0_amount').contains('0.83')
  })
})