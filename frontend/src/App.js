import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
					style={{ height: '100px', width: '700px' }}
				/>
				{location.pathname !== '/registration' &&
					location.pathname !== '/login' && (
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
