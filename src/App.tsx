import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Post from '@/pages/Post';

export default function App() {
  // 自动识别 GitHub Pages 子路径
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '';

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-[#050505] text-[#fafafa] font-sans selection:bg-accent selection:text-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
        </Routes>
      </div>
    </Router>
  );
}
