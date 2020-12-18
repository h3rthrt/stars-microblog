import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import Post from '../../components/Post'
import Tags from '../../components/PopularTags'
import './Home.sass'

function Home() {
	const [ postsList, setLists ] = useState([])

	useEffect(() => {
		api.get('posts').then((response) => setLists(response.data))
    }, []);
    
    function renderPosts() {
        return postsList.map((post, index) => {
            return <Post key={index} list={post} />
        })
    }

	return (
		<div className="container">
			<div className="left">
				<h1>Лента</h1>
				<div className="create-note">Создать запись</div>
				{ renderPosts() }
			</div>
			<div className="right">
				<Tags />
			</div>
		</div>
	)
}

export default Home
