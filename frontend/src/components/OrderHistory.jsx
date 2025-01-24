import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Error from './Error'
import styles from './styles.module.css'

function OrderHistory() {
	const [order, setOrder] = useState([])
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const login = localStorage.getItem('login')

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) {
			navigate('/login')
		} else {
			fetchOrder(token)
		}
	}, [navigate])

	const fetchOrder = async token => {
		const response = await fetch('http://localhost:3001/order', {
			method: 'get',
			headers: { authorization: `bearer ${token}` },
		})
		if (response.ok) {
			const data = await response.json()
			setOrder(data)
			setError('')
		} else {
			const data = await response.json()
			setError(data.message)
			setOrder([])
		}
	}

	const updateOrderStatus = async (id, status) => {
		const token = localStorage.getItem('token')
		const response = await fetch(`http://localhost:3001/order/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				authorization: `bearer ${token}`,
			},
			body: JSON.stringify({ status }),
		})

		if (response.ok) {
			const updatedOrder = order.map(ord =>
				ord.id === id ? { ...ord, status } : ord
			)
			setOrder(updatedOrder)
		} else {
			const data = await response.json()
			setError(data.message)
		}
	}

	return (
		<div>
			<Error message={error} />
			<div
				style={{
					display: 'flex',
					width: '100%',
					justifyContent: 'center',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<h3>История заказов</h3>
				{order.length > 0 ? (
					<table className={styles.table}>
						<thead className={styles.thead}>
							<tr className={styles.tr}>
								<th>ID</th>
								<th>ФИО</th>
								<th>Email</th>
								<th>Товар</th>
								<th>Кол-во</th>
								<th>Адрес</th>
								<th>Статус</th>
							</tr>
						</thead>
						<tbody>
							{order.map(ord => (
								<tr key={ord.id} className={styles.tr}>
									<td>{ord.id}</td>
									<td>{ord.full_name}</td>
									<td>{ord.email}</td>
									<td>{ord.name_product}</td>
									<td>{ord.amount_product}</td>
									<td>{ord.address}</td>
									<td>
										{login === 'sklad' ? (
											<select
												value={ord.status}
												onChange={e =>
													updateOrderStatus(ord.id, e.target.value)
												}
											>
												<option value='Новое'>Новое</option>
												<option value='Подтверждено'>Подтверждено</option>
												<option value='Отменено'>Отменено</option>
											</select>
										) : (
											ord.status
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>Нет заказов</p>
				)}
				{login === 'sklad' && <p>Админ</p>}
			</div>
		</div>
	)
}

export default OrderHistory
