import { useCallbackRef, useControllableState } from "@chakra-ui/hooks"
import {
  addItem,
  Dict,
  isInputEvent,
  removeItem,
  StringOrNumber,
} from "@chakra-ui/utils"
import { ChangeEvent, useCallback } from "react"

type EventOrValue = ChangeEvent<HTMLInputElement> | StringOrNumber

export interface UseCheckboxGroupProps {
  /**
   * The value of the checkbox group
   */
  value?: StringOrNumber[]
  /**
   * The initial value of the checkbox group
   */
  defaultValue?: StringOrNumber[]
  /**
   * The callback fired when any children Checkbox is checked or unchecked
   */
  onChange?(value: StringOrNumber[]): void
  /**
   * If `true`, input elements will receive
   * `checked` attribute instead of `isChecked`.
   *
   * This assumes, you're using native radio inputs
   */
  isNative?: boolean
}

/**
 * React hook that provides all the state management logic
 * for a group of checkboxes.
 *
 * It is consumed by the `CheckboxGroup` component
 */
export function useCheckboxGroup(props: UseCheckboxGroupProps = {}) {
  const { defaultValue, value: valueProp, onChange, isNative } = props

  const onChangeProp = useCallbackRef(onChange)

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue || [],
    onChange: onChangeProp,
  })

  const handleChange = useCallback(
    (eventOrValue: EventOrValue) => {
      if (!value) return

      const isChecked = isInputEvent(eventOrValue)
        ? eventOrValue.target.checked
        : !value.includes(eventOrValue)

      const selectedValue = isInputEvent(eventOrValue)
        ? eventOrValue.target.value
        : eventOrValue

      const nextValue = isChecked
        ? addItem(value, selectedValue)
        : removeItem(value, selectedValue)

      setValue(nextValue)
    },
    [setValue, value],
  )

  const getCheckboxProps = useCallback(
    (props: Dict = {}) => {
      const checkedKey = isNative ? "checked" : "isChecked"
      return {
        ...props,
        [checkedKey]: value.includes(props.value),
        onChange: handleChange,
      }
    },
    [handleChange, isNative, value],
  )

  return {
    value,
    onChange: handleChange,
    setValue,
    getCheckboxProps,
  }
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>
