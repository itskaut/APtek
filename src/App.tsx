import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// --- ИНТЕРФЕЙСЫ ---
interface Product {
  id: number; name: string; category: string;
  description: string; price: number; image: string;
}
interface CartItem extends Product { quantity: number; }

// --- КОМПОНЕНТЫ СТРАНИЦ ---

const Home = ({ products, addToCart }: { products: Product[], addToCart: (p: Product) => void }) => (
  <>
    <section className="hero">
      <div className="hero-content">
        <span className="hero-label">HEALTH TECH</span>
        <h2>Ваше здоровье — <br/>наш приоритет</h2>
        <p>Интеллектуальный подбор препаратов и научно-популярные статьи в одном месте!</p>
      </div>
    </section>
    
    <h2 className="section-title" style={{ color: '#0f172a', fontSize: '3rem', fontWeight: 900, opacity: 1, textAlign: 'left', margin: '40px 0' }}>
      Популярные товары
    </h2>

    <main className="products-grid">
      {products.map(product => (
        <div className="card" key={product.id}>
          <div className="product-image-container" style={{ width: '100%', height: '200px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            {product.image.startsWith('http') ? <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : product.image}
          </div>
          <span className="category">{product.category}</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="card-footer">
            <strong>{product.price} ₽</strong>
            <button onClick={() => addToCart(product)}>В корзину</button>
          </div>
        </div>
      ))}
    </main>
  </>
);

const Articles = () => (
  <div className="page-content">
    <h2 className="section-title" style={{ color: '#0f172a', fontSize: '3rem', fontWeight: 900, opacity: 1, textAlign: 'left', margin: '40px 0' }}>
      Научно-популярные статьи
    </h2>
    <div className="articles-grid">
      {[
        { id: 1, title: 'Как выбрать витамины?', date: '12 Мая', desc: 'Полный гид по весенним добавкам.' },
        { id: 2, title: 'Мифы о БАДах', date: '10 Мая', desc: 'Разбираем популярные заблуждения.' }
      ].map(article => (
        <div key={article.id} className="article-card">
          <span className="article-date">{article.date}</span>
          <h3>{article.title}</h3>
          <p>{article.desc}</p>
          <a href="#" className="article-link">Читать полностью →</a>
        </div>
      ))}
    </div>
  </div>
);

const Profile = () => (
  <div className="page-content">
    <h2 className="section-title" style={{ color: '#0f172a', fontSize: '3rem', fontWeight: 900, opacity: 1, textAlign: 'left', margin: '40px 0' }}>
      Личный кабинет
    </h2>
    <div className="profile-card" style={{ padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <p>Добро пожаловать в систему PharmaOS!</p>
    </div>
  </div>
);

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Если бэкенд не задеплоен, тут будет пусто на GitHub
    axios.get('http://localhost:3000/products')
      .then(res => setProducts(res.data))
      .catch(() => console.log("Бэкенд недоступен (локальный хост)"));
  }, []);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === p.id);
      return exist ? prev.map(i => i.id === p.id ? {...i, quantity: i.quantity + 1} : i) : [...prev, {...p, quantity: 1}];
    });
  };

  const handleOrder = () => {
    alert(`Заказ на сумму ${cart.reduce((s, i) => s + i.price * i.quantity, 0)} ₽ оформлен!`);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <header className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 0' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '4rem', fontWeight: 900, background: 'linear-gradient(135deg, #4f46e5, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PHARMAOS</h1>
              <p style={{ margin: 0, color: '#1e293b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '5px' }}>Цифровая аптека</p>
            </div>
          </Link>
          <nav className="main-nav">
            <Link to="/">Каталог</Link>
            <Link to="/articles">Статьи</Link>
            <Link to="/profile">Кабинет</Link>
          </nav>
          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="badge">{cart.length}</span>
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {isCartOpen && (
          <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
            <div className="cart-drawer">
              <h2>Корзина</h2>
              <div className="cart-items">
                {cart.map(i => <div key={i.id}>{i.name} x{i.quantity} — {i.price * i.quantity} ₽</div>)}
              </div>
              {cart.length > 0 && <button className="checkout-btn" onClick={handleOrder} style={{ width: '100%', padding: '15px', marginTop: '20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Заказать</button>}
            </div>
          </>
        )}
      </div>
    </Router>
  );
}