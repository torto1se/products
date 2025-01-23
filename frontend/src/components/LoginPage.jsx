import React, { useState } from 'react'
import Error from './Error'
import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

function LoginPage() {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigation = useNavigate()

	const handleLog = async () => {
		if (!login || !password) {
			setError('Все поля должны быть заполнены')
			setTimeout(() => setError(''), 3000)
			return
		}

		const response = await fetch('http://localhost:3001/login', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password }),
		})

		const data = await response.json()
		if (response.ok) {
			localStorage.setItem('token', data.token)
			console.log('Вход', data.token)
			navigation('/order')
		} else {
			console.log(data.error)
			setError('Неверный логин или пароль')
			setTimeout(() => setError(''), 3000)
		}
	}

	return (
		<div className={styles.form}>
			<Error message={error} />
			<div className={styles.form_inner}>
				<h2>Авторизация</h2>
				<input
					type='text'
					value={login}
					onChange={e => setLogin(e.target.value)}
					placeholder='Логин'
				/>
				<input
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder='Пароль'
				/>
				<button onClick={handleLog} className={styles.button}>
					Войти
				</button>
				<p style={{ marginBottom: '0px' }}>
					Нет акаунта?&nbsp;
					<Link
						to={'/registration'}
						style={{ textDecoration: 'none', color: 'black' }}
					>
						Зарегистрироваться
					</Link>
				</p>
			</div>
		</div>
	)
}

export default LoginPage
