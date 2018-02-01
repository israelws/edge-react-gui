/* globals test describe expect */

import { passwordReminderReducer as uut, initialState } from './passwordReminderModalReducer.js'

test('initialState', () => {
  const expected = initialState
  const actual = uut()

  expect(actual).toEqual(expected)
})

describe('non-password login', () => {
  test.skip('EDGE LOGIN', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('KEY_LOGIN', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PIN_LOGIN', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('RECOVERY_LOGIN', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })
})

describe('password verified', () => {
  test.skip('NEW_ACCOUNT_LOGIN', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PASSWORD_LOGIN', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PASSWORD_VERIFIED_UNLOCK_SETTINGS', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PASSWORD_VERIFIED_PASSWORD_REMINDER', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PASSWORD_VERIFIED_UNLOCK_SPENDING_LIMITS', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PASSWORD_VERIFIED_2FA', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })

  test.skip('PASSWORD_VERIFIED_RECOVERY_QUESTIONS', () => {
    const expected = initialState
    const actual = uut()

    expect(actual).toEqual(expected)
  })
})
