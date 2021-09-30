import { ThemedIcon } from '@components/themed'
import { WalletAlert } from '@components/WalletAlert'
import { LinkingOptions, NavigationContainer, NavigationContainerRef, RouteProp } from '@react-navigation/native'
import { Theme } from '@react-navigation/native/lib/typescript/src/types'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { tailwind } from '@tailwind'
import * as Linking from 'expo-linking'
import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { HeaderFont } from '../../components'
import { HeaderTitle } from '@components/HeaderTitle'
import { getDefaultTheme } from '@constants/Theme'
import { useThemeContext } from '@contexts/ThemeProvider'
import { translate } from '@translations'
import { CreateMnemonicWallet, CreateMnemonicWalletHandle } from './screens/CreateWallet/CreateMnemonicWallet'
import { CreateWalletGuidelines } from './screens/CreateWallet/CreateWalletGuidelines'
import { RecoveryWordsFaq } from './screens/CreateWallet/RecoveryWordsFaq'
import { PinConfirmation } from './screens/CreateWallet/PinConfirmation'
import { PinCreation } from './screens/CreateWallet/PinCreation'
import { VerifyMnemonicWallet } from './screens/CreateWallet/VerifyMnemonicWallet'
import { OnboardingNetworkSelectScreen } from './screens/CreateWallet/OnboardingNetworkSelectScreen'
import { Onboarding } from './screens/Onboarding'
import { RestoreMnemonicWallet } from './screens/RestoreWallet/RestoreMnemonicWallet'
import { NetworkDetails } from '@screens/AppNavigator/screens/Settings/screens/NetworkDetails'

type PinCreationType = 'create' | 'restore'

export interface WalletParamList {
  WalletOnboardingScreen: undefined
  CreateMnemonicWallet: undefined
  WalletNetworkSelectScreen: undefined
  VerifyMnemonicWallet: {
    words: string[]
  }
  RestoreMnemonicWallet: undefined
  PinCreation: {
    pinLength: 4 | 6
    words: string[]
    type: PinCreationType
  }
  PinConfirmation: {
    pin: string
    words: string[]
    type: PinCreationType
  }

  [key: string]: undefined | object
}

const WalletStack = createStackNavigator<WalletParamList>()

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Onboarding: 'wallet/onboarding',
      OnboardingNetworkSelectScreen: 'wallet/mnemonic/network',
      CreateMnemonicWallet: 'wallet/mnemonic/create',
      CreateWalletGuidelines: 'wallet/onboarding/guidelines',
      RecoveryWordsFaq: 'wallet/onboarding/guidelines/recovery',
      VerifyMnemonicWallet: 'wallet/mnemonic/create/verify',
      RestoreMnemonicWallet: 'wallet/mnemonic/restore',
      PinCreation: 'wallet/pin/create',
      PinConfirmation: 'wallet/pin/confirm'
    }
  }
}

export function WalletNavigator (): JSX.Element {
  const { isLight } = useThemeContext()
  const navigationRef = React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null)
  const createMnemonicWalletRef = React.useRef<CreateMnemonicWalletHandle>()
  const DeFiChainTheme: Theme = getDefaultTheme(isLight)
  const headerContainerTestId = 'wallet_header_container'

  const goToNetworkSelect = (): void => {
    // @ts-expect-error
    // TODO(kyleleow) update typings
    navigationRef.current?.navigate({ name: 'OnboardingNetworkSelectScreen' })
  }

  const resetRecoveryWord = (): void => {
    WalletAlert({
      title: translate('screens/WalletNavigator', 'Refresh recovery words'),
      message: translate(
        'screens/WalletNavigator', 'You are about to generate a new set of recovery words. Continue?'),
      buttons: [
        {
          text: translate('screens/WalletNavigator', 'Cancel'),
          style: 'cancel'
        },
        {
          text: translate('screens/WalletNavigator', 'Refresh'),
          style: 'destructive',
          onPress: async () => {
            createMnemonicWalletRef?.current?.getMnemonicWords()
          }
        }
      ]
    })
  }

  const CreateMnemonicWalletWrapper = (
    props: JSX.IntrinsicAttributes &
      { navigation: StackNavigationProp<WalletParamList, 'CreateMnemonicWallet'>, route: RouteProp<WalletParamList, 'CreateMnemonicWallet'> } &
      React.RefAttributes<unknown>): JSX.Element => {
    return (<CreateMnemonicWallet {...props} ref={createMnemonicWalletRef} />)
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      ref={navigationRef}
      theme={DeFiChainTheme}
    >
      <WalletStack.Navigator
        initialRouteName='Onboarding'
        screenOptions={{ headerTitleStyle: HeaderFont }}
      >
        <WalletStack.Screen
          component={Onboarding}
          name='Onboarding'
          options={{
            headerShown: false
          }}
        />

        <WalletStack.Screen
          component={CreateWalletGuidelines}
          name='CreateWalletGuidelines'
          options={{
            headerTitle: () => (
              <HeaderTitle
                text={translate('screens/WalletNavigator', 'Guidelines')}
                subHeadingType='NetworkSelect' onPress={goToNetworkSelect}
                containerTestID={headerContainerTestId}
              />
            ),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={OnboardingNetworkSelectScreen}
          name='OnboardingNetworkSelectScreen'
          options={{
            headerTitle: translate('screens/WalletNavigator', 'Select network'),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={RecoveryWordsFaq}
          name='RecoveryWordsFaq'
          options={{
            headerTitle: translate('screens/WalletNavigator', 'Recovery Words FAQ'),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={CreateMnemonicWalletWrapper}
          name='CreateMnemonicWallet'
          options={{
            headerTitle: () => (
              <HeaderTitle
                text={translate('screens/WalletNavigator', 'Display recovery words')}
                containerTestID={headerContainerTestId}
              />
            ),
            headerRightContainerStyle: tailwind('px-2 py-2'),
            headerRight: (): JSX.Element => (
              <TouchableOpacity
                onPress={resetRecoveryWord}
                testID='reset_recovery_word_button'
              >
                <ThemedIcon
                  dark={tailwind('text-darkprimary-500')}
                  iconType='MaterialIcons'
                  light={tailwind('text-primary-500')}
                  name='refresh'
                  size={24}
                />
              </TouchableOpacity>
            ),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={VerifyMnemonicWallet}
          name='VerifyMnemonicWallet'
          options={{
            headerTitle: () => (
              <HeaderTitle
                text={translate('screens/WalletNavigator', 'Verify words')}
                containerTestID={headerContainerTestId}
              />
            ),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={RestoreMnemonicWallet}
          name='RestoreMnemonicWallet'
          options={{
            headerTitle: () => (
              <HeaderTitle
                text={translate('screens/WalletNavigator', 'Restore Wallet')}
                subHeadingType='NetworkSelect' onPress={goToNetworkSelect}
                containerTestID={headerContainerTestId}
              />
            ),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={PinCreation}
          name='PinCreation'
          options={{
            headerTitle: () => (
              <HeaderTitle
                text={translate('screens/WalletNavigator', 'Create a passcode')}
                containerTestID={headerContainerTestId}
              />
            ),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={PinConfirmation}
          name='PinConfirmation'
          options={{
            headerTitle: () => (
              <HeaderTitle
                text={translate('screens/WalletNavigator', 'Verify passcode')}
                containerTestID={headerContainerTestId}
              />
            ),
            headerBackTitleVisible: false
          }}
        />

        <WalletStack.Screen
          component={NetworkDetails}
          name='NetworkDetails'
          options={{
            headerTitle: translate('screens/NetworkDetails', 'Wallet Network'),
            headerBackTitleVisible: false,
            headerBackTestID: 'network_details_header_back'
          }}
        />
      </WalletStack.Navigator>
    </NavigationContainer>
  )
}