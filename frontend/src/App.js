import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import RegistrationPage from './components/RegistrationPage'
import LoginPage from './components/LoginPage'
import OrderPage from './components/OrderPage'
import OrderHistory from './components/OrderHistory'
import styles from './components/styles.module.css'

function App() {
	const navigate = useNavigate()
	const location = useLocation()

	const Logout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('login')
		navigate('/login')
	}
	return (
		<div className={styles.wrapper}>
			<header
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '20px',
				}}
			>
				<img
					src={`../images/market.jpg`}
					alt='logo'
					className={styles.header_image}
				/>
				{location.pathname === '/' && (
					<div
						style={{ textAlign: 'center', fontSize: '30px', marginTop: '20px' }}
					>
						<Link
							style={{ textDecoration: 'none', color: 'black' }}
							to={'/registration'}
						>
							Зарегистрироваться
						</Link>
						<br />
						<Link
							style={{ textDecoration: 'none', color: 'black' }}
							to={'/login'}
						>
							Войти
						</Link>
					</div>
				)}
				{location.pathname !== '/registration' &&
					location.pathname !== '/login' &&
					location.pathname !== '/' && (
						<button onClick={Logout} className={styles.button}>
							Выйти
						</button>
					)}
			</header>
			<Routes>
				<Route path='/registration' element={<RegistrationPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/order' element={<OrderPage />} />
				<Route path='order-history' element={<OrderHistory />}></Route>
			</Routes>
		</div>
	)
}

export default App
