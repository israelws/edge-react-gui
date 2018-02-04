// @flow

import type { Action } from '../../../ReduxTypes'

export const INITIAL_DAYS_LIMIT = 2
export const INITIAL_NON_PASSWORD_LOGINS_LIMIT = 2

export const DAYS_MULTIPLIER = 2
export const COUNT_MULTIPLIER = 2
export const PASSWORD_RECOVERY_MULTIPLIER = 2

export const MAX_DAYS_LIMIT = 64 // max number of consecutive daysLimit of non password logins
export const MAX_NON_PASSWORD_LOGINS_LIMIT = 128 // max number of consecutive non password logins

export const INCREMENT_DAYS_LIMIT = 2
export const INCREMENT_NON_PASSWORD_LOGINS_LIMIT = 2

const MILLISECONDS_PER_DAY = 86400000
const daysBetween = (a, b) => {
  const millisecondsBetween = b - a
  const daysBetween = millisecondsBetween / MILLISECONDS_PER_DAY
  return daysBetween
}
const getFutureDate = (daysLimit, date = new Date()) => {
  const futureDate = daysLimit * MILLISECONDS_PER_DAY + date.getTime()
  return new Date(futureDate)
}

export const initialState = {
  needsPasswordCheck: true,
  lastPasswordUse: new Date(0),
  daysLimit: INITIAL_DAYS_LIMIT,
  nonPasswordLoginsLimit: INITIAL_NON_PASSWORD_LOGINS_LIMIT,
  passwordUses: 0,
  nonPasswordLogins: 0
}

export type PasswordReminderState = {
  needsPasswordCheck: boolean,
  lastPasswordUse: Date,
  daysLimit: number,
  nonPasswordLoginsLimit: number,
  passwordUses: number,
  nonPasswordLogins: number
}

export const passwordReminderReducer = (state: PasswordReminderState = initialState, action: Action) => {
  switch (action.type) {
    case 'NEW_ACCOUNT_LOGIN':
    case 'PASSWORD_LOGIN':
    case 'PASSWORD_VERIFIED_UNLOCK_SETTINGS':
    case 'PASSWORD_VERIFIED_PASSWORD_REMINDER':
    case 'PASSWORD_VERIFIED_UNLOCK_SPENDING_LIMITS':
    case 'PASSWORD_VERIFIED_2FA':
    case 'PASSWORD_VERIFIED_RECOVERY_QUESTIONS': {
      debugger
      const passwordUses = state.passwordUses + 1
      let daysLimit = Math.pow(DAYS_MULTIPLIER, passwordUses)
      let nonPasswordLoginsLimit = Math.pow(COUNT_MULTIPLIER, passwordUses)
      if (daysLimit > MAX_DAYS_LIMIT) {
        daysLimit = MAX_DAYS_LIMIT
      }

      if (nonPasswordLoginsLimit > MAX_NON_PASSWORD_LOGINS_LIMIT) {
        nonPasswordLoginsLimit = MAX_NON_PASSWORD_LOGINS_LIMIT
      }
      return {
        needsPasswordCheck: false,
        nonPasswordLogins: 0,
        passwordUses,
        lastPasswordUse: action.lastPasswordUse || new Date(), // action.lastPasswordUse is used to produce deterministic tests
        daysLimit,
        nonPasswordLoginsLimit
      }
    }

    case 'EDGE_LOGIN':
    case 'KEY_LOGIN':
    case 'PIN_LOGIN':
    case 'RECOVERY_LOGIN': {
      const nonPasswordLogins = state.nonPasswordLogins + 1
      // save to local settings? do this in <PasswordReminderModal />

      let needsPasswordCheck = state.needsPasswordCheck

      // If too many non-password logins
      if (nonPasswordLogins >= state.nonPasswordLoginsLimit) {
        needsPasswordCheck = true
      }

      // If too many daysLimit between password logins
      const daysLimit = daysBetween(state.lastPasswordUse, action.currentDate || new Date()) // action.currentDate is used to make deterministic tests
      if (daysLimit >= state.daysLimit) {
        needsPasswordCheck = true
      }

      return {
        ...state,
        nonPasswordLogins,
        needsPasswordCheck
      }
    }

    case 'PASSWORD_REMINDER_SKIPPED': {
      return {
        ...state,
        needsPasswordCheck: false,
        daysLimit: state.daysLimit + 2,
        nonPasswordLoginsLimit: state.nonPasswordLoginsLimit + 2
      }
    }

    default:
      return state
  }
}
