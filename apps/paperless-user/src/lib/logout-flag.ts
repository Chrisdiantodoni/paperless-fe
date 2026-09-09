let _isLoggingOut = false

export function isLoggingOut(): boolean {
  return _isLoggingOut
}

export function setLoggingOut(value: boolean): void {
  _isLoggingOut = value
}
