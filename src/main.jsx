import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Had to delete Strict mode cause was conflicting with react-beautiful-dnd lib.
ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
