import { render } from '@testing-library/react-native'
import React from 'react'
import { PasscodeFaq } from './PasscodeFaq'

jest.mock('../../../../contexts/ThemeProvider')
describe('Passcode FAQ screen', () => {
  it('should match snapshot', async () => {
    const rendered = render(<PasscodeFaq />)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})