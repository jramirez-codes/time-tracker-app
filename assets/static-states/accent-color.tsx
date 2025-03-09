const accentColorDark:string = "#ADEBB3"
const accentColorLight:string = "#2f4b3e"

export function accentColor(isDark: boolean) {
  if(isDark) {
    return accentColorDark
  }
  return accentColorLight
}