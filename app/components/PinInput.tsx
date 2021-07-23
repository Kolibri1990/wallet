import { MaterialIcons } from '@expo/vector-icons'
import React, { useState, useRef, useEffect } from 'react'

import { TextInput, TouchableOpacity } from 'react-native'
import tailwind from 'tailwind-rn'
import { View } from '.'

interface PinInputOptions {
  length: 4 | 6 // should be easy to support 4-8 numeric, fix it to 4 or 6 first
  onChange: (text: string) => void
}

export function PinInput ({ length, onChange }: PinInputOptions): JSX.Element {
  const [text, setText] = useState<string>('')
  const _textInput = useRef<TextInput | null>(null)

  useEffect(() => {
    _textInput.current?.focus()
  }, [_textInput])

  const digitBoxes = (): JSX.Element => {
    const arr = []
    for (let i = 0; i < length; i++) {
      let child: JSX.Element | null = null
      if (text.length > i) {
        child = <MaterialIcons name='circle' size={15} color='black' />
      }
      arr.push(
        <View key={i} style={tailwind('h-8 w-8 items-center justify-center border border-gray-500 rounded p-2 m-2')}>
          {child}
        </View>
      )
    }
    return (
      <View style={tailwind('h-12 flex-row justify-center items-center')}>{arr}</View>
    )
  }

  return (
    <TouchableOpacity onPress={() => _textInput.current?.focus()}>
      {digitBoxes()}
      <TextInput
        ref={ref => { _textInput.current = ref }}
        style={tailwind('opacity-0 h-0')}
        keyboardType='numeric'
        secureTextEntry
        autoFocus
        maxLength={length}
        onChangeText={txt => {
          setText(txt)
          onChange(txt)
        }}
      />
    </TouchableOpacity>
  )
}