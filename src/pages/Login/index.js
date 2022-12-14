import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginAction } from 'store/actions/index'
import { useLocation, useNavigate } from 'react-router-dom'

import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import styles from './index.module.scss'
import logo from 'assets/logo.png'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [loadings, setLoadings] = useState(false)

  const onFinish = async (values) => {
    const { username, password } = values
    try {
      await dispatch(loginAction(username, password))
      message.success('Kirjautuminen onnistui', 1, () => {
        location.state?.from
          ? navigate(location.state.from)
          : navigate('/home/dashboard', { replace: true })
      })
    } catch (e) {
      message.error(e.response?.data?.message || 'Kirjautuminen epäonnistui', 1, () => {
        setLoadings(false)
      })
    }
  }

  return (
    <div className={styles.root}>
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="tesy_logo" />
        <Form
          validateTrigger={['onBlur', 'onChange']}
          onFinish={onFinish}
          //! Only for development
          initialValues={{
            username: 'admin',
            password: 'p1230',
            remember: true,
          }}
        >
          <Form.Item
            label="Käyttäjänimi"
            name="username"
            rules={[
              {
                // pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Väärä käyttäjänimi',
                validateTrigger: 'onBlur',
              },
              {
                required: true,
                message: 'Käyttäjänimi ei voi olla tyhjä.',
              },
            ]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 17,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Salasana"
            name="password"
            rules={[
              {
                required: true,
                message: 'Salasana ei voi olla tyhjä.',
              },
            ]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 17,
            }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
            }}
          >
            <Checkbox>Muista minut</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loadings}>
              Kirjaudu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
