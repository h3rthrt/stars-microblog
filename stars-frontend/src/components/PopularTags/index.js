import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadPopularTags } from '../../redux/actions/tagsAction'
import './PopularTags.sass'

function Tags(props) {
    useEffect(() => {
        props.loadPopularTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="right-block">
            <h2>Популярные теги</h2>
            <hr />
            <div className="right-block__list">
                {
                    props.tags.map((tag, index) => {
                        return(
                            <div className="tag-block" key={ index }>
                                <b>#{ tag.name }</b>
                                <span>x{ tag.count }</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        tags: state.tags.tags
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadPopularTags: () => dispatch(loadPopularTags())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
