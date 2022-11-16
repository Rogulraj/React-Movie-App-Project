import React from 'react'

const AppContext = React.createContext({
  username: '',
  password: '',
  mobileMenu: false,
  onChangeMobileMenuShow: () => {},
  onChangeMobileMenuHide: () => {},
  onChangeUsername: () => {},
  onChangePassword: () => {},
})
export default AppContext
