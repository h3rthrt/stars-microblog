import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Navigation.sass'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Button from '../UI/Button'
import CreateAcc from '../../components/Modal/CreateAcc'

function Nav(props) {
	const [ modalVisible, setModalVisible ] = useState(false)
	const links = [
		{ to: '/dashboard', icon: 'home' },
		{ to: '/', icon: 'globe' },
		{ to: `/profile/${props.authName}`, icon: 'user' },
		{ to: '/settings', icon: 'cog' }
	]

	function renderLinks() {
		if (!props.isAuthenticated) {
			return links.map((link, index) => {
				let cls = []
				let classTrue = 'true'
				if (props.location.pathname === link.to) cls.push(classTrue)
				return (
					<li key={index} className={cls}>
						<NavLink to={link.to}>
							<FontAwesomeIcon icon={link.icon} />
						</NavLink>
					</li>
				)
			})
		} else if (props.location.pathname === '/auth') {
			return (
				<div>
					<Button cls="navButton button-xl" color="green" onClick={() => setModalVisible(true)}>
						Регистрация
					</Button>
					<CreateAcc visible={modalVisible} onClose={() => setModalVisible(false)} />
				</div>
			)
		} else {
			return (
				<div>
					<Button cls="navButton button-xl" color="blue" onClick={() => props.history.push('/auth')}>
						Войти
					</Button>
					<CreateAcc visible={modalVisible} onClose={() => setModalVisible(false)} />
				</div>
			)
		}
	}

	return (
		<div className="nav container">
			<Link to="/" className="stars-logo">
				<svg width="35" height="50" viewBox="0 0 35 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M30.0996 2.41364C32.8388 4.36574 34.2084 5.0815 30.442 7.94456C29.4148 8.7254 27.3605 10.222 24.9637 9.24595C20.9378 7.60649 18.3862 6.88856 14.007 6.96852C8.67952 7.06579 1.6438 11.5567 0.995939 10.8727C-2.08562 7.61921 11.2678 1.53947 14.007 0.786902C16.4038 0.128405 25.0436 -1.18957 30.0996 2.41364Z"
					/>
					<path
						d="M7.84387 26.8148C3.18818 24.4017 -1.22527 20.1661 0.311154 16.0783C2.02313 11.5234 7.23809 10.8727 7.50147 12.4994C8.18626 16.729 11.9346 19.4602 14.007 19.6571C20.8549 20.3078 25.9909 20.9585 30.442 24.212C32.8388 25.9638 35.578 28.7668 34.8932 36.9006C34.2084 45.0343 24.9637 49.9145 24.9637 47.9624C24.9637 46.661 31.3375 35.5992 25.6485 31.695C19.9594 27.7908 11.6102 28.7668 7.84387 26.8148Z"
					/>
					<path
						d="M16.0614 43.4075C20.5125 42.7568 23.9365 41.7808 23.9365 42.7568C23.9365 46.3356 19.8545 48.3734 15.3766 49.5891C10.583 50.8905 5.1047 48.9384 0.995945 46.0103C-1.35182 44.3371 4.45318 39.6983 6.13189 40.154C8.52866 40.8047 13.2423 43.8196 16.0614 43.4075Z"
					/>
					<path
						d="M30.0996 2.41364C32.8388 4.36574 34.2084 5.0815 30.442 7.94456C29.4148 8.7254 27.3605 10.222 24.9637 9.24595C20.9378 7.60649 18.3862 6.88856 14.007 6.96852C8.67952 7.06579 1.6438 11.5567 0.995939 10.8727C-2.08562 7.61921 11.2678 1.53947 14.007 0.786902C16.4038 0.128405 25.0436 -1.18957 30.0996 2.41364Z"
					/>
					<path
						d="M7.84387 26.8148C3.18818 24.4017 -1.22527 20.1661 0.311154 16.0783C2.02313 11.5234 7.23809 10.8727 7.50147 12.4994C8.18626 16.729 11.9346 19.4602 14.007 19.6571C20.8549 20.3078 25.9909 20.9585 30.442 24.212C32.8388 25.9638 35.578 28.7668 34.8932 36.9006C34.2084 45.0343 24.9637 49.9145 24.9637 47.9624C24.9637 46.661 31.3375 35.5992 25.6485 31.695C19.9594 27.7908 11.6102 28.7668 7.84387 26.8148Z"
					/>
					<path
						d="M16.0614 43.4075C20.5125 42.7568 23.9365 41.7808 23.9365 42.7568C23.9365 46.3356 19.8545 48.3734 15.3766 49.5891C10.583 50.8905 5.1047 48.9384 0.995945 46.0103C-1.35182 44.3371 4.45318 39.6983 6.13189 40.154C8.52866 40.8047 13.2423 43.8196 16.0614 43.4075Z"
					/>
				</svg>
			</Link>
			<div className="search">
				<FontAwesomeIcon icon="search" size="lg" />
				{
					props.location.pathname === `/profile/${props.username}` ? 
					<input 
						type="text" 
						placeholder={ `Поиск ${props.username}` } 
					/> :
					<input 
						type="text" 
						placeholder='Поиск' 
					/> 
				}
			</div>
			<nav>
				<ul>{renderLinks()}</ul>
			</nav>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		isAuthenticated: state.firebase.auth.isEmpty,
		authName: state.firebase.auth.displayName,
		username: state.profile.username,
		isLoaded: state.profile.isLoaded
	}
}

export default connect(mapStateToProps)(withRouter(Nav))
