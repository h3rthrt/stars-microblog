import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import './PopularTags.sass'

function Tags() {
    const [tagsList, setTags] = useState([])

    useEffect(() => {
        api.get('tags').then((response) => setTags(response.data))
    }, [])

    return (
        <div className="tags">
            <h2>Популярные теги</h2>
            <hr />
            <div className="tags__list">
                {
                    tagsList.map((tag, index) => {
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

export default Tags
