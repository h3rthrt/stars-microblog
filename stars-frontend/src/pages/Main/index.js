import React from 'react'
import Tags from '../../components/PopularTags'
import FetchingPosts from '../../components/FetchingPosts'
import './Main.sass'

function Main(props) {
	return (
		<div className="container container__main">
			<div className="container__left">
				<FetchingPosts 
					uid={null}
					reference='getAllPosts'
					referenceMore='getMoreAllPosts'
				/>
			</div>
			<div className="container__right">
				<Tags />
			</div>
		</div>
	)
}

export default Main
