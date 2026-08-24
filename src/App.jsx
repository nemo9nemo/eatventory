import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Fridge from './pages/Fridge'
import RecipeList from './pages/RecipeList'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
    </Routes>
  )
}
