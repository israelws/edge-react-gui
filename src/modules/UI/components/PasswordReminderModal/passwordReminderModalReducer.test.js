/* globals test describe expect */

import {
  passwordReminderReducer as uut,
  initialState,
  MAX_DAYS_LIMIT,
  MAX_NON_PASSWORD_LOGINS_LIMIT,
  INCREMENT_DAYS_LIMIT,
  INCREMENT_NON_PASSWORD_LOGINS_LIMIT
 } from './passwordReminderModalReducer.js'

describe('PasswordReminder', () => {
  test('initialState', () => {
    const expected = initialState
    const actual = uut(undefined, {})

    expect(actual).toEqual(expected)
  })

  describe('non-password login', () => {
    describe('Increment nonPasswordLogins', () => {
      test('EDGE LOGIN', () => {
        const expected = initialState.nonPasswordLogins + 1
        const action = { type: 'EDGE_LOGIN' }
        const actual = uut(initialState, action).nonPasswordLogins

        expect(actual).toEqual(expected)
      })

      test('KEY_LOGIN', () => {
        const expected = initialState.nonPasswordLogins + 1
        const action = { type: 'KEY_LOGIN' }
        const actual = uut(initialState, action).nonPasswordLogins

        expect(actual).toEqual(expected)
      })

      test('PIN_LOGIN', () => {
        const expected = initialState.nonPasswordLogins + 1
        const action = { type: 'PIN_LOGIN' }
        const actual = uut(initialState, action).nonPasswordLogins

        expect(actual).toEqual(expected)
      })

      test('RECOVERY_LOGIN', () => {
        const expected = initialState.nonPasswordLogins + 1
        const action = { type: 'RECOVERY_LOGIN' }
        const actual = uut(initialState, action).nonPasswordLogins

        expect(actual).toEqual(expected)
      })
    })
  })

  describe('password verified', () => {
    describe('Set false needsPasswordCheck, Increment passwordUses, update lastPasswordUse, increment daysLimit, increment nonPasswordLoginsLimit', () => {
      test('NEW_ACCOUNT_LOGIN', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'NEW_ACCOUNT_LOGIN', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })

      test('PASSWORD_LOGIN', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'PASSWORD_LOGIN', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })

      test('PASSWORD_VERIFIED_UNLOCK_SETTINGS', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'PASSWORD_VERIFIED_UNLOCK_SETTINGS', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })

      test('PASSWORD_VERIFIED_PASSWORD_REMINDER', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'PASSWORD_VERIFIED_PASSWORD_REMINDER', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })

      test('PASSWORD_VERIFIED_UNLOCK_SPENDING_LIMITS', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'PASSWORD_VERIFIED_UNLOCK_SPENDING_LIMITS', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })

      test('PASSWORD_VERIFIED_2FA', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'PASSWORD_VERIFIED_2FA', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })

      test('PASSWORD_VERIFIED_RECOVERY_QUESTIONS', () => {
        const testDate = new Date()
        const expected = {
          ...initialState,
          needsPasswordCheck: false,
          passwordUses: initialState.passwordUses + 1,
          lastPasswordUse: testDate,
          daysLimit: 2,
          nonPasswordLoginsLimit: 2
        }
        const action = { type: 'PASSWORD_VERIFIED_RECOVERY_QUESTIONS', lastPasswordUse: testDate } // used to produce deterministic tests
        const actual = uut(initialState, action)

        expect(actual).toEqual(expected)
      })
    })

    describe('Respect MAX_NON_PASSWORD_LOGINS_LIMIT', () => {
      test('PASSWORD_LOGIN', () => {
        const previousState = {
          ...initialState,
          passwordUses: 1000
        }
        const expected = MAX_NON_PASSWORD_LOGINS_LIMIT
        const action = { type: 'PASSWORD_LOGIN' }
        const actual = uut(previousState, action).nonPasswordLoginsLimit

        expect(actual).toEqual(expected)
      })
    })

    describe('Respect MAX_DAYS_LIMIT', () => {
      test('PASSWORD_LOGIN', () => {
        const previousState = {
          ...initialState,
          passwordUses: 1000
        }
        const expected = MAX_DAYS_LIMIT
        const action = { type: 'PASSWORD_LOGIN' }
        const actual = uut(previousState, action).daysLimit

        expect(actual).toEqual(expected)
      })
    })
  })

  test('Too many days since last password use', () => {
    const daysLimit = 32
    const lastPasswordUse = new Date(0) // 1970-01-01T00:00:00.000Z
    const currentDate = new Date(86400000 * daysLimit + 1)
    const previousState = {
      ...initialState,
      daysLimit,
      lastPasswordUse
    }
    const expected = true
    const action = { type: 'PIN_LOGIN', currentDate }
    const actual = uut(previousState, action).needsPasswordCheck

    expect(actual).toEqual(expected)
  })

  test('Too many non-password logins', () => {
    const nonPasswordLoginLimit = 32
    const lastPasswordUse = new Date(0) // 1970-01-01T00:00:00.000Z
    const currentDate = new Date(86400000 * nonPasswordLoginLimit + 1)
    const previousState = {
      ...initialState,
      nonPasswordLoginLimit,
      lastPasswordUse
    }
    const expected = true
    const action = { type: 'PIN_LOGIN', currentDate }
    const actual = uut(previousState, action).needsPasswordCheck

    expect(actual).toEqual(expected)
  })

  describe('PASSWORD_REMINDER_SKIPPED', () => {
    test('Set false needsPasswordCheck, Set daysLimit +2, Set nonPasswordLogins 2')
      const previousState = uut(initialState, {type: 'NEW_ACCOUNT'})
      const expected = 2
      const action = { type: 'PASSWORD_REMINDER_SKIPPED' }
      const actual = uut(perviousState, action).daysLimit

      expect(actual).toEqual(expected)
    })

    test('Increments nonPasswordLoginsLimit', () => {
      const previousState = {
        ...initialState,

      }
      const expected = 2
      const action = { type: 'PASSWORD_REMINDER_SKIPPED' }
      const actual = uut(initialState, action).nonPasswordLoginsLimit

      expect(actual).toEqual(expected)
    })
  })
})
