import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Error from './Error'

function OrderHistory() {
	const [order, setOrder] = useState([])
	const [error, setError] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) {
			navigate('/login')
		} else {
			fetchOrder(token)
		}
	})

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

	return (
		<div>
			<Error message={error} />
			<div>
				<h3>История заказов</h3>
				{order.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>ФИО</th>
								<th>Email</th>
								<th>Товар</th>
								<th>Кол-во</th>
								<th>Статус</th>
							</tr>
						</thead>
						<tbody>
							{order.map(ord => (
								<tr key={ord.ord_id}>
									<td>{ord.id}</td>
									<td>{ord.full_name}</td>
									<td>{ord.email}</td>
									<td>{ord.name_product}</td>
									<td>{ord.amount_product}</td>
									<td>{ord.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>Нет заказов</p>
				)}
			</div>
		</div>
	)
}

export default OrderHistory
