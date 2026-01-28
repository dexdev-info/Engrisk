import { AuthProvider } from './AuthProvider'

export const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}
