import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadPopularTags } from '../../redux/actions/actions'
import './PopularTags.sass'

function Tags(props) {
    useEffect(() => {
        props.loadPopularTags()
        console.log(props.tagsList)
    }, [])

    return (
        <div className="tags">
            <h2>Популярные теги</h2>
            <hr />
            <div className="tags__list">
                {
                    props.tagsList.map((tag, index) => {
                        return(
                            <a href="/" key={ index }>
                                #{ tag }
                            </a>
                        )
                    })
                }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        tagsList: state.tag.popularTags
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadPopularTags: () => dispatch(loadPopularTags())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
