const express = require('express')
const sqlite3 = require('sqlite3')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())

const db = new sqlite3.Database('./database.db', err => {
	if (err) {
		console.error(err.message)
	}
	console.log('БД подключена!')
})

app.post('/registration', (req, res) => {
	const { login, password, email, full_name, phone } = req.body

	db.get(`select * from user where login = ?`, [login], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message })
		}

		if (row) {
			return res
				.status(400)
				.json({ error: 'Пользователь с таким логином уже существует!' })
		}

		db.run(
			`insert into user (login, password, email, full_name, phone) values (?, ?, ?, ?, ?)`,
			[login, password, email, full_name, phone],
			function (err) {
				if (err) {
					return res.status(400).json({ message: err.message })
				}
				res.status(201).json({ message: 'Пользователь зарегистрирован' })
			}
		)
	})
})

app.post('/login', (req, res) => {
	const { login, password } = req.body

	db.get(`select * from user where login = ?`, [login], (err, user) => {
		if (err || !user) {
			return res.status(401).json({ message: 'Неверный логин или пароль' })
		}
		if (!password) {
			return res.status(401).json({ message: 'Неверный логин или пароль' })
		}
		const token = jwt.sign(
			{ userId: user.id, login: user.login, email: user.email },
			'secret',
			{
				expiresIn: '1h',
			}
		)
		res.json({ token })
	})
})

app.post('/order', (req, res) => {
	const { name_product, amount_product, address } = req.body

	const token = req.headers.authorization?.split(' ')[1]
	if (!token) {
		return res.status(401).json({ message: 'Необходима авторизация' })
	}
	jwt.verify(token, 'secret', (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: 'Неверный токен' })
		}

		const id_user = decoded.userId

		db.get(
			`select full_name, email from user where id = ?`,
			[id_user],
			(err, user) => {
				if (err || !user) {
					return res.status(404).json({ message: 'Пользователь не найден' })
				}
				const { full_name, email } = user
				const status = 'Новое'

				db.run(
					`insert into "order" (full_name, email, name_product, amount_product, address, status) values (?, ?, ?, ?, ?, ?)`,
					[full_name, email, name_product, amount_product, address, status],
					function (err) {
						if (err) {
							return res.status(400).json({ error: err.message })
						}
						res.status(201).json({ message: 'Заявка создана' })
					}
				)
			}
		)
	})
})

app.get('/order', (req, res) => {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) {
		return res.status(401).json({ message: 'Необходима авторизация' })
	}
	jwt.verify(token, 'secret', (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: 'Неверный токен' })
		}

		db.all(
			`select full_name, email, address, amount_product, name_product, status, id from "order" where email = ?`,
			[decoded.email],
			(err, rows) => {
				if (err) {
					return res.status(500).json({ message: err.message })
				}
				res.json(rows)
			}
		)
	})
})

app.listen(port, () => {
	console.log(`Сервер запущен http://localhost:${port}`)
})
