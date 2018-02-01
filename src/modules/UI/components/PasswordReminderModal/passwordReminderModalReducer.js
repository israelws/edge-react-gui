// @flow

import type { Action } from '../../../ReduxTypes'

const DEFAULT_PASSWORD_REMINDER_DAYS = 2
const DEFAULT_PASSWORD_REMINDER_COUNT = 2
const PASSWORD_DAYS_INCREMENT_MULTIPLIER = 2
const PASSWORD_COUNT_INCREMENT_MULTIPLIER = 2
const PASSWORD_DAYS_MAX_VALUE = 64 // max number of consecutive days of non password logins
const PASSWORD_COUNT_MAX_VALUE = 128 // max number of consecutive non password logins
const PASSWORD_WRONG_INCREMENT_DAYS = 2
const PASSWORD_WRONG_INCREMENT_COUNT = 2
const PASSWORD_RECOVERY_MULTIPLIER = 2

const MILLISECONDS_PER_DAY = 86400000
const daysBetween = (a, b) => {
  const millisecondsBetween = b - a
  const daysBetween = millisecondsBetween / MILLISECONDS_PER_DAY
  return daysBetween
}
const getFutureDate = (days, date = new Date()) => {
  const futureDate = days * MILLISECONDS_PER_DAY + date.getTime()
  return new Date(futureDate)
}

export const initialState = {
  needsPasswordCheck: true,
  lastPasswordLogin: new Date(0),
  passwordReminderDays: DEFAULT_PASSWORD_REMINDER_DAYS,
  passwordReminderCount: DEFAULT_PASSWORD_REMINDER_COUNT,
  numPasswordUsed: 0,
  numNonPasswordLogin: 0
}

export type PasswordReminderState = {
  needsPasswordCheck: boolean,
  lastPasswordLogin: Date,
  passwordReminderDays: number,
  passwordReminderCount: number,
  numPasswordUsed: number,
  numNonPasswordLogin: number
}

export const passwordReminderReducer = (state: PasswordReminderState = initialState, action: Action = {}) => {
  switch (action.type) {
    case 'NEW_ACCOUNT_LOGIN':
    case 'PASSWORD_LOGIN':
    case 'PASSWORD_VERIFIED_UNLOCK_SETTINGS':
    case 'PASSWORD_VERIFIED_PASSWORD_REMINDER':
    case 'PASSWORD_VERIFIED_UNLOCK_SPENDING_LIMITS':
    case 'PASSWORD_VERIFIED_2FA':
    case 'PASSWORD_VERIFIED_RECOVERY_QUESTIONS': {
      const numPasswordUsed = state.numPasswordUsed + 1
      let passwordReminderDays = Math.pow(PASSWORD_DAYS_INCREMENT_MULTIPLIER, numPasswordUsed)
      let passwordReminderCount = Math.pow(PASSWORD_COUNT_INCREMENT_MULTIPLIER, numPasswordUsed)
      if (passwordReminderDays > PASSWORD_DAYS_MAX_VALUE) {
        passwordReminderDays = PASSWORD_DAYS_MAX_VALUE
      }

      if (passwordReminderCount > PASSWORD_COUNT_MAX_VALUE) {
        passwordReminderCount = PASSWORD_COUNT_MAX_VALUE
      }
      return {
        needsPasswordCheck: false,
        numNonPasswordLogin: 0,
        numPasswordUsed,
        lastPasswordLogin: new Date(),
        passwordReminderDays,
        passwordReminderCount
      }
    }

    case 'EDGE_LOGIN':
    case 'KEY_LOGIN':
    case 'PIN_LOGIN':
    case 'RECOVERY_LOGIN': {
      const numNonPasswordLogin = state.numNonPasswordLogin + 1
      // save to local settings? do this in <PasswordReminderModal />

      let needsPasswordCheck = state.needsPasswordCheck

      // If too many non-password logins
      if (numNonPasswordLogin >= state.passwordReminderCount) {
        needsPasswordCheck = true
      }

      // If too many days between password logins
      const days = daysBetween(state.lastPasswordLogin, new Date())
      if (days >= state.passwordReminderDays) {
        needsPasswordCheck = true
      }

      return {
        ...state,
        needsPasswordCheck
      }
    }

    case 'PASSWORD_REMINDER_SKIPPED': {
      const passwordReminderDays = daysBetween(state.lastPasswordLogin, getFutureDate(2))
      const passwordReminderCount = state.numNonPasswordLogin + PASSWORD_WRONG_INCREMENT_COUNT

      return {
        ...state,
        passwordReminderDays,
        passwordReminderCount
      }
    }

    default:
      return state
  }
}
