import axios from 'axios'

export default axios.create({
	// baseURL: `https://stars-microblog-default-rtdb.europe-west1.firebasedatabase.app/`
	baseURL: `http://localhost:3001/`
})
