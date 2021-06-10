import * as React from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import tailwind from 'tailwind-rn'
import { View } from '../../components/Themed'
import { translate } from '../../translations'

export default function LoadingScreen (props: { message?: string }): JSX.Element {
  const { message } = props
  const loadingMessage = message ?? translate('screens/LoadingScreen', 'Loading')
  return (
    <View style={[tailwind('bg-white items-center justify-center flex-1 h-full w-full relative')]}>
      <Spinner
        color='#5b10ff'
        overlayColor='rgba(255, 255, 255, 1)'
        visible
        textContent={loadingMessage}
      />
    </View>
  )
}
