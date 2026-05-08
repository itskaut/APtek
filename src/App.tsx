import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// --- ИНТЕРФЕЙСЫ ---
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
}

// --- КОМПОНЕНЕНТЫ СТРАНИЦ ---

const Home = ({
  products,
  addToCart,
  loading,
}: {
  products: Product[]
  addToCart: (p: Product) => void
  loading: boolean
}) => (
  <>
    <section className="hero">
      <div className="hero-content">
        <span className="hero-label">HEALTH TECH</span>
        <h2>
          Ваше здоровье — <br />
          наш приоритет
        </h2>
        <p>
          Интеллектуальный подбор препаратов и научно-популярные статьи.
        </p>
      </div>
    </section>

    <h2
      className="section-title"
      style={{
        color: '#0f172a',
        fontSize: '2.5rem',
        fontWeight: 900,
        textAlign: 'left',
        margin: '40px 0',
      }}
    >
      Популярные товары
    </h2>

    {loading ? (
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          fontSize: '1.5rem',
          color: '#64748b',
        }}
      >
        Загрузка аптеки...
      </div>
    ) : (
      <main className="products-grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <div className="product-image-container">
              {product?.image &&
              typeof product.image === 'string' &&
              product.image.startsWith('http') ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div style={{ fontSize: '3rem' }}>💊</div>
              )}
            </div>

            <span className="category">
              {product.category || 'Общее'}
            </span>

            <h3>{product.name || 'Без названия'}</h3>

            <p>{product.description || 'Описание отсутствует'}</p>

            <div className="card-footer">
              <strong>{product.price || 0} ₽</strong>

              <button onClick={() => addToCart(product)}>
                В корзину
              </button>
            </div>
          </div>
        ))}
      </main>
    )}
  </>
)

// --- СТРАНИЦА СТАТЕЙ ---
const Articles = () => {
  const articles: Article[] = [
    {
      id: 1,
      title: 'Как сон влияет на иммунитет',
      excerpt:
        'Качественный сон укрепляет иммунную систему и снижает риск заболеваний.',
      image:
        'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=800',
    },
    {
      id: 2,
      title: 'Польза Омега-3 для организма',
      excerpt:
        'Омега-3 поддерживает здоровье сердца, сосудов и нервной системы.',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    },
    {
      id: 3,
      title: 'Почему организму нужен магний',
      excerpt:
        'Магний помогает бороться со стрессом и поддерживает мышцы.',
      image:
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
    },
  ]

  return (
    <div className="page-content">
      <h2
        className="section-title"
        style={{
          color: '#0f172a',
          fontSize: '2.5rem',
          fontWeight: 900,
          margin: '40px 0',
        }}
      >
        Научно-популярные статьи
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '25px',
        }}
      >
        {articles.map((article) => (
          <div
            key={article.id}
            style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
              }}
            />

            <div style={{ padding: '25px' }}>
              <h3
                style={{
                  marginBottom: '15px',
                  color: '#0f172a',
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  color: '#64748b',
                  lineHeight: 1.7,
                }}
              >
                {article.excerpt}
              </p>

              <button
                style={{
                  marginTop: '20px',
                  padding: '12px 18px',
                  border: 'none',
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg, #4f46e5, #9333ea)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Читать статью
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- НОРМАЛЬНЫЙ ЛИЧНЫЙ КАБИНЕТ ---
const Profile = () => (
  <div className="page-content">
    <h2
      className="section-title"
      style={{
        color: '#0f172a',
        fontSize: '2.5rem',
        fontWeight: 900,
        margin: '40px 0',
      }}
    >
      Личный кабинет
    </h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '30px',
      }}
    >
      {/* ПРОФИЛЬ */}
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #4f46e5, #9333ea)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 900,
          }}
        >
          ИИ
        </div>

        <h3 style={{ marginBottom: '10px' }}>Иван Иванов</h3>

        <p style={{ color: '#64748b' }}>
          user@example.com
        </p>

        <button
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg, #4f46e5, #9333ea)',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Редактировать профиль
        </button>
      </div>

      {/* ИНФОРМАЦИЯ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
        }}
      >
        {/* СТАТИСТИКА */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            ['Заказов', '12'],
            ['Бонусы', '2 450'],
            ['Избранное', '8'],
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              }}
            >
              <p
                style={{
                  color: '#64748b',
                  marginBottom: '10px',
                }}
              >
                {item[0]}
              </p>

              <h3
                style={{
                  margin: 0,
                  color: '#0f172a',
                  fontSize: '2rem',
                }}
              >
                {item[1]}
              </h3>
            </div>
          ))}
        </div>

        {/* ИСТОРИЯ */}
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>
            История заказов
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {[
              ['Омега-3', '1200 ₽'],
              ['Магний B6', '850 ₽'],
              ['Витамин D3', '990 ₽'],
            ].map((order, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '18px',
                  borderRadius: '14px',
                  background: '#f8fafc',
                }}
              >
                <span>{order[0]}</span>
                <strong>{order[1]}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:3000/products')
      .then((res) => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(() => {
        const mockData: Product[] = [
          {
            id: 1,
            name: 'Омега-3',
            category: 'Добавки',
            price: 1200,
            description: 'Чистый рыбий жир',
            image:
              'https://images.unsplash.com/photo-1550573105-df27d7ec6370?w=400',
          },
          {
            id: 2,
            name: 'Магний B6',
            category: 'Минералы',
            price: 850,
            description: 'Для нервной системы',
            image:
              'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
          },
        ]

        setProducts(mockData)
        setLoading(false)
      })
  }, [])

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === p.id)

      if (exist) {
        return prev.map((i) =>
          i.id === p.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const clearCart = () => {
    setCart([])
    setIsCartOpen(false)
    alert('Заказ успешно оформлен! Корзина очищена.')
  }

  return (
    <Router>
      <div className="app">
        <header
          className="header"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '30px 0',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '3rem',
                  fontWeight: 900,
                  background:
                    'linear-gradient(135deg, #4f46e5, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PHARMAOS
              </h1>

              <p
                style={{
                  margin: 0,
                  color: '#1e293b',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '4px',
                }}
              >
                Цифровая аптека
              </p>
            </div>
          </Link>

          <nav className="main-nav" style={{ marginTop: '20px' }}>
            <Link to="/">Каталог</Link>
            <Link to="/articles">Статьи</Link>
            <Link to="/profile">Кабинет</Link>
          </nav>

          <button
            className="cart-button"
            onClick={() => setIsCartOpen(true)}
          >
            🛒 <span className="badge">{cart.length}</span>
          </button>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Home
                products={products}
                addToCart={addToCart}
                loading={loading}
              />
            }
          />

          <Route path="/articles" element={<Articles />} />

          <Route path="/profile" element={<Profile />} />
        </Routes>

        {isCartOpen && (
          <>
            <div
              className="cart-overlay"
              onClick={() => setIsCartOpen(false)}
            />

            <div className="cart-drawer">
              <div className="cart-header">
                <h2>Корзина</h2>

                <button onClick={() => setIsCartOpen(false)}>
                  ×
                </button>
              </div>

              <div className="cart-items">
                {cart.length === 0 ? (
                  <p>Корзина пуста</p>
                ) : (
                  cart.map((i) => (
                    <div
                      key={i.id}
                      className="cart-item-ui"
                    >
                      <span>
                        {i.name} (x{i.quantity})
                      </span>

                      <strong>
                        {i.price * i.quantity} ₽
                      </strong>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="cart-footer">
                  <div className="total">
                    Итого:{' '}
                    {cart.reduce(
                      (s, i) =>
                        s + i.price * i.quantity,
                      0
                    )}{' '}
                    ₽
                  </div>

                  <button
                    className="checkout-btn"
                    onClick={clearCart}
                  >
                    Оформить заказ
                  </button>

                  <button
                    className="clear-btn"
                    onClick={() => setCart([])}
                    style={{
                      background: 'none',
                      color: '#ef4444',
                      marginTop: '10px',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    Очистить всё
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Router>
  )
}