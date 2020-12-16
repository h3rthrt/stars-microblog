import React, { useState } from 'react'
import Post from '../../components/Post'
import './Home.sass'

function loadList() {
    const postsList = [
        {
            avatar: '/img/user1106.jpg',
            nickname: 'user1106',
            author: 'user1106',
            images: [],
            head: 'Почему однократно воображение?', 
            text: 'Весеннее равноденствие, после осторожного анализа, начинает эксцентриситет. Угловая скорость вращения, следовательно, гасит онтологический статус искусства – это скорее индикатор, чем примета. ',
            likes: 42,
            tags: []
        },
        {
            avatar: '/img/user1106.jpg',
            nickname: 'user1106',
            author: 'unknown',
            images: [],
            head: 'Почему характерна Туманность Андромеды?',
            text: 'У планет-гигантов нет твёрдой поверхности, таким образом прекрасное представляет собой меланхолик, как это случилось в 1994 году с кометой Шумейкеpов-Леви 9.',
            likes: 42,
            tags: ['космос', 'андромеда']
        },
        {
            avatar: '/img/user1106.jpg',
            nickname: 'user1106',
            author: 'unknown',
            images: ['/img/imagePost.png', '/img/imagePost2.png'],
            head: '',
            text: 'Исследователями из разных лабораторий неоднократно наблюдалось, как турбулентность переворачивает плазменный солитон.',
            likes: 9,
            tags: []
        }
    ]
    return postsList
}

function Home() {
    const [postsList] = useState(() => loadList())

    return (
        <div className="container">
            <div className="left">
                <h1>Лента</h1>
                <div className="create-note">
                    Создать запись
                </div>
                {
                    postsList.map((post, index) => {
                        return(
                            <Post list={post} key={index} />
                        )
                    })
                }
            </div>
            <div className="right">

            </div>
        </div>
    )
}

export default Home