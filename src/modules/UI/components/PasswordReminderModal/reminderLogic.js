// @flow

const DEFAULT_PASSWORD_REMINDER_DAYS = 2
const DEFAULT_PASSWORD_REMINDER_COUNT = 2
const PASSWORD_DAYS_INCREMENT_MULTIPLIER = 2
const PASSWORD_COUNT_INCREMENT_MULTIPLIER = 2
const PASSWORD_DAYS_MAX_VALUE = 64 // max number of consecutive days of non password logins
const PASSWORD_COUNT_MAX_VALUE = 128 // max number of consecutive non password logins
const PASSWORD_WRONG_INCREMENT_DAYS = 2
const PASSWORD_WRONG_INCREMENT_COUNT = 2
const PASSWORD_RECOVERY_MULTIPLIER = 2

const lastPasswordLogin: Date = new Date(0) // 1970-01-01T00:00:00.000Z
let passwordReminderDays: number = DEFAULT_PASSWORD_REMINDER_DAYS
let passwordReminderCount: number = DEFAULT_PASSWORD_REMINDER_COUNT
const numPasswordUsed: number = 0
let numNonPasswordLogin: number = 0

const needsPasswordCheck = false

const usesPassword = () => {
  numNonPasswordLogin = 0
  numPasswordUsed++
  lastPasswordLogin = new Date() // current date/time
  passwordReminderDays = Math.pow(PASSWORD_DAYS_INCREMENT_MULTIPLIER, numPasswordUsed)
  passwordReminderCount = Math.pow(PASSWORD_COUNT_INCREMENT_MULTIPLIER, numPasswordUsed)

  if (passwordReminderDays > PASSWORD_DAYS_MAX_VALUE) {
    passwordReminderDays = PASSWORD_DAYS_MAX_VALUE
  }

  if (passwordReminderCount > PASSWORD_COUNT_MAX_VALUE) {
    passwordReminderCount = PASSWORD_COUNT_MAX_VALUE
  }
}

const usesNonPassword = () => {
  needsPasswordCheck = false

  numNonPasswordLogin++
  // [saveLocalSettings]

  // have user logged in too many times with PIN
  if (numNonPasswordLogin >= passwordReminderCount) {
    needsPasswordCheck = true
  }

  // has it been too many days since last password login
  const days: number = daysSince(lastPasswordLogin, new Date())
  if (days >= passwordReminderDays) {
    needsPasswordCheck = true
  }

}

const MILLISECONDS_PER_DAY = 86400000
const daysSince = (a, b) => {
  const millisecondsBetween = b - a
  const daysSince = millisecondsBetween / MILLISECONDS_PER_DAY
  return daysSince
}
