import { loginRequest } from 'api/user'
import { removeToken, setToken } from 'utils/token'
import { USER_INFO } from 'store/constants'

export const loginAction = (username, password) => {
  return async (dispatch) => {
    const res = await loginRequest(username, password)
    const { username: name, Token } = res.data
    setToken(Token)

    dispatch({
      type: USER_INFO,
      payload: name,
    })
  }
}

export const logoutAction = () => {
  return (dispatch) => {
    removeToken()
  }
}
