import React, { useState } from 'react'
import Error from './Error'
import styles from './styles.module.css'

function OrderPage() {
	const [address, setAddress] = useState('')
	const [name_product, setName_product] = useState('')
	const [amount_product, setAmount_product] = useState('')
	const [error, setError] = useState('')

	const products = [
		{ name: 'Яйца', amount: 1, image: 'eggs.jpg' },
		{ name: 'Молоко', amount: 1, image: 'milk.jpg' },
		{ name: 'Хлеб', amount: 1, image: 'bread.jpg' },
		{ name: 'Бананы', amount: 1, image: 'banana.jpg' },
		{ name: 'Яблоки', amount: 1, image: 'apple.jpg' },
	]

	const handleAdd = prod => {
		setName_product(prod.name)
		setAmount_product(prod.amount)
	}

	const handleOrder = async () => {
		if (
			!setAddress ||
			!setName_product ||
			!setAmount_product ||
			!address ||
			!amount_product ||
			!name_product
		) {
			setError('Все поля должны быть заполнены')
			setTimeout(() => setError(''), 3000)
			return
		}

		const token = localStorage.getItem('token')

		const response = await fetch('http://localhost:3001/order', {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ address, name_product, amount_product }),
		})

		if (response.ok) {
			setError('')
			setAddress('')
			setAmount_product('')
			setName_product('')
			console.log('Заявка отправлена')
		} else {
			console.log('Ошибка')
		}
	}

	return (
		<div>
			<Error message={error} />
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					marginTop: '20px',
				}}
			>
				<div className={styles.order}>
					<h3>Создание заказа</h3>
					<input
						style={{ color: 'black' }}
						type='text'
						placeholder='Товар'
						value={name_product}
						onChange={e => setName_product(e.target.value)}
						disabled
					/>
					<input
						type='number'
						placeholder='Кол-во'
						value={amount_product}
						onChange={e => setAmount_product(e.target.value)}
					/>
					<input
						type='text'
						value={address}
						onChange={e => setAddress(e.target.value)}
						placeholder='Адрес'
					/>
					<button onClick={handleOrder} className={styles.button}>
						{' '}
						Отправить заказ
					</button>
				</div>
				<center>
					<h2>Товар:</h2>
				</center>
				<div
					style={{
						margin: '50px',
						display: 'grid',
						gridTemplateColumns: 'repeat(5, 1fr)',
						gap: '10px',
					}}
				>
					{products.map(prod => (
						<div
							key={prod.prod_id}
							style={{
								width: '130px',
								border: '1px solid black',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'flex-start',
								padding: '10px',
								overflow: 'visible',
							}}
						>
							<div>
								<img
									src={`../images/${prod.image}`}
									alt={prod.name}
									style={{
										width: '100px',
										height: '100px',
									}}
								/>
							</div>
							<hr
								style={{
									border: '0px',
									height: '1px',
									width: '100%',
									backgroundColor: 'black',
								}}
							/>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									gap: '10px',
									margin: '5px',
								}}
							>
								<p style={{ marginBottom: '0px', marginTop: '0px' }}>
									{prod.name}
								</p>
								<button
									onClick={() => handleAdd(prod)}
									className={styles.button}
								>
									Добавить
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default OrderPage
