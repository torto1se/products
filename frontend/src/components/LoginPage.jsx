import React, { useState } from 'react'
import Error from './Error'
import { useNavigate } from 'react-router-dom'

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
		<div>
			<Error message={error} />
			<div>
				<h3>Авторизация</h3>
				<input
					type='text'
					value={login}
					onChange={e => setLogin(e.target.value)}
				/>
				<input
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button onClick={handleLog}>Войти</button>
			</div>
		</div>
	)
}

export default LoginPage
