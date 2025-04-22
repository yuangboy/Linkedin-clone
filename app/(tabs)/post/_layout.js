import { View, Text} from 'react-native'
import {Slot,Stack} from "expo-router";
import React from 'react'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
         headerTitle:"Post"
      }}
      />
        
    </Stack>
  )
}