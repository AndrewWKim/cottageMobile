import { applyMiddleware, createStore } from 'redux'
import rootReducer from '../store/reducers/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

const configureStore = () => {
    const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunk)),
    )
    return store
}

export { configureStore }
