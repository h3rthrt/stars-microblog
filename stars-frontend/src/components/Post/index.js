import React, { useState, forwardRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PostButtons from './PostButtons'
import Dropdown from './Dropdown'
import RestorePost from './RestorePost'
import wordForm from '../../wordForm'
import 'react-lazy-load-image-component/src/effects/blur.css'
import './Post.sass'


function Post(props, ref) {
	const { post } = props
	const [ dropdown, setDropdown ] = useState(false)
	const [ remove, setRemove ] = useState(false)
	let postCls = [ 'post', 'loadAnimation' ]
	
	if (!post) return false

	if (!remove) {
		return (
			<div ref={ref} className={ postCls.join(' ') }>
				<div className="post__left">
					<img src={ post.authorPhoto || '/img/defaultPhoto.svg' } alt="" className="ava" />
				</div>
				<div className="post__right">
					<div id={ post.userId } className="blogname">
						<Link to={`/profile/${post.username}`} className="blogname__list">
							{ post.blogname }
						</Link>
						{ post.author || post.removed
							?  (
								<div className="author-post">
									<FontAwesomeIcon icon="reply" className="reply" />
									<Link to={`/profile/${post.authorUsername}`}>
										{ post.author }
									</Link>
								</div>
							) 
							: null
						}
						<button onClick={ () => setDropdown(prev => !prev) }>
							<FontAwesomeIcon icon="ellipsis-h" />
						</button>
	
						<Dropdown 
							onShow={ () => setDropdown(prev => { 
								if(prev) return false
							}) }
							createdAt={ post.createdAt }
							username={ post.username }
							show={ dropdown }
							postId={ post.repostId || post.postId }
							remove={ () => setRemove(prev => !prev) }
							repost={ post.repost }
						/>
					</div>
					{ post.header ? (<h2>{ post.header }</h2>) : (post.removed && <h2 style={{ color: 'var(--blue)' }}>Автор удалил пост</h2>)  }
					<div className="post__images">
						{
							post.photoURL?.map((image, index) => {
								return (
									<div className="img-box" key={ index }>
										<LazyLoadImage
											delayMethod="debounce"
											delayTime="200"
											effect="blur"
											width={image.width}
											height={image.height}
											alt={image.alt}
											src={image.url}
											/>
										{/* <img alt="" src={ image } /> */}
									</div>
								)
							}) || null
						}
					</div>
					{ post.text ? (<p>{ post.text }</p>) : null}
					<div className="footer-post">
						<div className="footer-post__left">
							<span>{ `${ post.notes || 0 }  ${ wordForm( post.notes || 0, ['заметка', 'заметки', 'заметок']) }` }</span>
							<div className="footer-post__tags">
								{ post.tags ? (
									post.tags.map((tag, index) => {
										return (
											<a href="/#" key={ index }>
												{ '#' + tag }
											</a>
										)})
									) 
									: null
								}
							</div>
						</div>
						<PostButtons
							postId={ post.postId }
							username={ post.username }
							liked={ post.liked }
							repost={ post.repost }
							reposted={ post.reposted }
							removed={ post.removed }
						/>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div ref={ ref } className="post loadAnimation">
				<div className="post__left d-none">
					<img src={ post.authorPhoto || '/img/defaultPhoto.svg' } alt="" className="ava" />
				</div>
				<RestorePost 
					restore={ () => setRemove(false) }
					postId={ post.postId }
				/>
			</div>
		)
	}
}
export default forwardRef(Post)
