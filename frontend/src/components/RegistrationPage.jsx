import React, { useState } from 'react'
import Error from './Error'
import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

function RegistrationPage() {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [full_name, setFull_name] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleReg = async () => {
		if (!password || !login || !full_name || !phone || !email) {
			setError('Все поля должны быть заполнены')
			setTimeout(() => setError(''), 3000)
			return
		}

		const response = await fetch('http://localhost:3001/registration', {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ login, full_name, password, phone, email }),
		})

		const data = await response.json()
		if (response.ok) {
			console.log('Зарегестрирован')
			navigate('/login')
		} else {
			console.log(data.error)
			setError('Пользователь с таким логином уже существует')
			setTimeout(() => setError(''), 3000)
		}
	}
	return (
		<div className={styles.form}>
			<Error message={error} />
			<div className={styles.form_inner}>
				<h2>Регистрация</h2>
				<input
					type='text'
					value={login}
					onChange={e => setLogin(e.target.value)}
					placeholder='Логин'
				/>
				<input
					type='text'
					value={full_name}
					onChange={e => setFull_name(e.target.value)}
					placeholder='ФИО'
				/>
				<input
					type='text'
					value={phone}
					onChange={e => setPhone(e.target.value)}
					placeholder='Телефон'
				/>
				<input
					type='email'
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder='Email'
				/>
				<input
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder='Пароль'
				/>
				<button
					onClick={handleReg}
					className={styles.button}
					style={{ marginTop: '10px' }}
				>
					Зарегистрироваться
				</button>
				<p style={{ marginBottom: '0px' }}>
					Уже есть аккаунт?&nbsp;
					<Link
						to={'/login'}
						style={{ textDecoration: 'none', color: 'black' }}
					>
						Войти
					</Link>
				</p>
			</div>
		</div>
	)
}

export default RegistrationPage
