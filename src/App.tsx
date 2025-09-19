import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import PostDetail from '@/pages/PostDetail';
import Category from '@/pages/Category';
import Tag from '@/pages/Tag';
import About from '@/pages/About';
import Archive from '@/pages/Archive';
import Search from '@/pages/Search';

export default function App() {
  // 获取基础路径，用于GitHub Pages部署
  const basename = import.meta.env.PROD && import.meta.env.VITE_BASE_URL 
    ? `/${import.meta.env.VITE_BASE_URL}` 
    : '';

  return (
    <Router basename={basename}>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post/:slug' element={<PostDetail />} />
          <Route path='/category/:name' element={<Category />} />
          <Route path='/category' element={<Category />} />
          <Route path='/tag/:name' element={<Tag />} />
          <Route path='/tag' element={<Tag />} />
          <Route path='/search' element={<Search />} />
          <Route path='/about' element={<About />} />
          <Route path='/archive' element={<Archive />} />
          <Route
            path='*'
            element={
              <div className='text-center text-xl py-12'>
                <h1 className='text-2xl font-bold mb-4'>页面未找到</h1>
                <p className='text-muted-foreground'>
                  抱歉，您访问的页面不存在。
                </p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
