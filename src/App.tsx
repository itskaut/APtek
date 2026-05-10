import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// --- ИНТЕРФЕЙСЫ ---
interface Product {
  id: number
  name: string
  category: string
  description: string
  price: number
  image: string
}

interface CartItem extends Product {
  quantity: number
}

interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  readTime: number
  tag: string
}

interface Order {
  id: number
  date: string
  items: string
  total: number
  status: 'delivered' | 'processing' | 'shipped'
}

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  bonuses: number
  initials: string
}

// --- MOCK DATA ---
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Омега-3', category: 'Добавки', price: 1290, description: 'Высококонцентрированный рыбий жир EPA+DHA для здоровья сердца и сосудов', image: 'https://api.ultrabalance.ru/media/product/7ab9f6e08c056d1b277c75b8c025c88ecropp2380_big.jpg' },
  { id: 2, name: 'Магний B6 Форте', category: 'Минералы', price: 890, description: 'Снижает стресс, улучшает качество сна и поддерживает нервную систему', image: 'https://main-cdn.sbermegamarket.ru/big1/hlr-system/131/593/230/310/132/028/100042950943b0.jpg' },
  { id: 3, name: 'Витамин D3 2000 МЕ', category: 'Витамины', price: 760, description: 'Поддерживает иммунитет, кости и настроение в течение всего года', image: 'https://papteki.ru/nomen/00000110581000003960/00000110581000003960_1.jpeg' },
  { id: 4, name: 'Цинк + Витамин C', category: 'Иммунитет', price: 540, description: 'Мощный дуэт для укрепления иммунной защиты организма', image: 'https://media.uteka.ru/media/big/5/be/5be8ca7111cbb9bea04aec3dbb126669.jpg' },
  { id: 5, name: 'Коллаген морской', category: 'Красота', price: 1680, description: 'Пептиды морского коллагена для упругости кожи и здоровья суставов', image: 'https://images.apteka.ru/original_9fb54c99-5af8-4168-8595-ebed6a9cac9c.png' },
  { id: 6, name: 'Пробиотик Комплекс', category: 'ЖКТ', price: 1120, description: '10 штаммов полезных бактерий для здоровья кишечника и иммунитета', image: 'https://media.uteka.ru/media/big/8/b2/8b29f64117c1bfdb96da9d8fd6ef7fbe.jpg' },
]

const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Как сон регулирует иммунный ответ',
    excerpt: 'Во время глубокого сна организм производит цитокины — белки, которые борются с инфекциями. Хронический недосып снижает их выработку на 30%.',
    content: 'Во время сна активируется так называемая «иммунная память». Лимфатическая система мозга — глимфатическая система — очищает нейроны от токсичных белков, в том числе бета-амилоида.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    readTime: 5,
    tag: 'Иммунитет',
  },
  {
    id: 2,
    title: 'Омега-3: что говорит наука в 2024 году',
    excerpt: 'Метаанализ 40 исследований подтвердил: ежедневный приём EPA и DHA снижает риск сердечно-сосудистых событий на 13% у людей старше 50 лет.',
    content: 'Омега-3 жирные кислоты встраиваются в мембраны клеток и влияют на воспалительные каскады. Новые исследования показывают их роль в нейропластичности.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    readTime: 7,
    tag: 'Питание',
  },
  {
    id: 3,
    title: 'Магний: дефицит, который незаметен',
    excerpt: 'До 80% городского населения испытывает дефицит магния из-за стресса, кофе и обработанной еды. При этом он участвует в 300+ ферментативных реакциях.',
    content: 'Магний необходим для синтеза АТФ — молекулы энергии. Дефицит проявляется усталостью, судорогами и тревожностью ещё до изменений в анализах крови.',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
    readTime: 6,
    tag: 'Минералы',
  },
  {
    id: 4,
    title: 'Витамин D и психическое здоровье',
    excerpt: 'Рецепторы витамина D обнаружены в гиппокампе и коре мозга. Его дефицит коррелирует с депрессией, тревожностью и когнитивным снижением.',
    content: 'Оптимальный уровень 25(OH)D в крови — 40–60 нг/мл. Большинство жителей средних широт имеют уровень ниже 20 нг/мл, особенно в зимние месяцы.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
    readTime: 8,
    tag: 'Нейронаука',
  },
  {
    id: 5,
    title: 'Микробиом кишечника и иммунитет',
    excerpt: '70% иммунных клеток сосредоточено в кишечнике. Разнообразие микробиома напрямую определяет силу иммунного ответа на инфекции.',
    content: 'Пробиотики второго поколения — живые бактерии с доказанными штаммами — способны восстанавливать нарушенный микробиом за 4–8 недель при регулярном применении.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
    readTime: 6,
    tag: 'Микробиом',
  },
  {
    id: 6,
    title: 'Коллаген: факты и мифы',
    excerpt: 'Морской коллаген I типа имеет пептиды меньшего размера, чем говяжий, что ускоряет его всасывание. Клинические исследования подтверждают эффект через 8 недель.',
    content: 'Синтез собственного коллагена снижается с 25 лет на 1% в год. Экзогенные пептиды стимулируют фибробласты к выработке нового коллагена через аминокислотный сигнальный путь.',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800',
    readTime: 5,
    tag: 'Красота',
  },
]

const MOCK_ORDERS: Order[] = [
  { id: 10234, date: '12 мая 2025', items: 'Омега-3 Premium, Витамин D3', total: 2050, status: 'delivered' },
  { id: 10198, date: '3 апреля 2025', items: 'Магний B6 Форте', total: 890, status: 'delivered' },
  { id: 10312, date: '28 мая 2025', items: 'Коллаген морской, Пробиотик', total: 2800, status: 'processing' },
]

const STATUS_LABELS = {
  delivered: { label: 'Доставлен', color: '#10b981' },
  processing: { label: 'Обрабатывается', color: '#f59e0b' },
  shipped: { label: 'В пути', color: '#3b82f6' },
}

// ─── HERO ───────────────────────────────────────────────────────────────────
const Home = ({ products, addToCart, loading }: { products: Product[]; addToCart: (p: Product) => void; loading: boolean }) => (
  <>
    <section className="hero">
      <div className="hero-badge">Научный подход к здоровью</div>
      <h2 className="hero-title">Аптека, которая<br /><em>объясняет</em></h2>
      <p className="hero-sub">Только препараты с доказательной базой. Каждый товар — со статьёй о том, как он работает.</p>
      <div className="hero-stats">
        <div className="hero-stat"><span>2 400+</span><small>товаров</small></div>
        <div className="hero-divider" />
        <div className="hero-stat"><span>48 ч</span><small>доставка</small></div>
        <div className="hero-divider" />
        <div className="hero-stat"><span>6 статей</span><small>ежемесячно</small></div>
      </div>
    </section>

    <div className="section-header">
      <h2 className="section-title">Популярные товары</h2>
      <span className="section-sub">Выбор наших покупателей</span>
    </div>

    {loading ? (
      <div className="loading-state">
        <div className="spinner" />
        <p>Загружаем каталог…</p>
      </div>
    ) : (
      <main className="products-grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <div className="product-img-wrap">
              {product.image?.startsWith('http') ? (
                <img src={product.image} alt={product.name} className="product-img" />
              ) : (
                <div className="product-img-placeholder">💊</div>
              )}
              <span className="category-chip">{product.category}</span>
            </div>
            <div className="card-body">
              <h3 className="card-name">{product.name}</h3>
              <p className="card-desc">{product.description}</p>
              <div className="card-footer">
                <strong className="card-price">{product.price.toLocaleString('ru')} ₽</strong>
                <button className="add-btn" onClick={() => addToCart(product)}>В корзину</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    )}
  </>
)

// ─── СТАТЬИ ─────────────────────────────────────────────────────────────────
const Articles = () => {
  const [selected, setSelected] = useState<Article | null>(null)
  const [filter, setFilter] = useState('Все')
  const tags = ['Все', ...Array.from(new Set(ARTICLES.map((a) => a.tag)))]
  const filtered = filter === 'Все' ? ARTICLES : ARTICLES.filter((a) => a.tag === filter)

  if (selected) {
    return (
      <div className="article-full">
        <button className="back-btn" onClick={() => setSelected(null)}>← Назад к статьям</button>
        <div className="article-full-img-wrap">
          <img src={selected.image} alt={selected.title} className="article-full-img" />
          <span className="article-tag-big">{selected.tag}</span>
        </div>
        <div className="article-full-body">
          <div className="article-meta">{selected.readTime} мин чтения</div>
          <h2 className="article-full-title">{selected.title}</h2>
          <p className="article-full-excerpt">{selected.excerpt}</p>
          <p className="article-full-content">{selected.content}</p>
          <div className="article-full-cta">
            <p>Нашли интересный препарат из статьи?</p>
            <Link to="/" className="cta-link-btn">Смотреть каталог →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <h2 className="section-title">Научные статьи</h2>
        <span className="section-sub">Доказательная медицина простым языком</span>
      </div>

      <div className="tag-filters">
        {tags.map((t) => (
          <button key={t} className={`tag-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <div className="articles-grid">
        {filtered.map((article) => (
          <div className="article-card" key={article.id}>
            <div className="article-img-wrap">
              <img src={article.image} alt={article.title} className="article-img" />
              <span className="article-tag">{article.tag}</span>
            </div>
            <div className="article-body">
              <div className="article-meta">{article.readTime} мин</div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <button className="read-btn" onClick={() => setSelected(article)}>Читать статью →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ПРОФИЛЬ ────────────────────────────────────────────────────────────────
const Profile = () => {
  const [tab, setTab] = useState<'overview' | 'orders' | 'health' | 'settings'>('overview')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<UserProfile>({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Лесная, д. 12, кв. 34',
    bonuses: 2450,
    initials: 'ИИ',
  })
  const [draft, setDraft] = useState(user)

  const handleSave = () => {
    const initials = draft.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    setUser({ ...draft, initials })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const TABS = [
    { key: 'overview', label: 'Обзор', icon: '⬡' },
    { key: 'orders', label: 'Заказы', icon: '📦' },
    { key: 'health', label: 'Здоровье', icon: '❤️' },
    { key: 'settings', label: 'Настройки', icon: '⚙️' },
  ] as const

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="profile-avatar">{user.initials}</div>
        <h3 className="profile-name">{user.name}</h3>
        <p className="profile-email">{user.email}</p>

        <div className="bonus-card">
          <span className="bonus-label">Бонусные баллы</span>
          <span className="bonus-value">{user.bonuses.toLocaleString('ru')}</span>
          <span className="bonus-note">≈ {Math.floor(user.bonuses * 0.1)} ₽ скидки</span>
        </div>

        <nav className="profile-nav">
          {TABS.map((t) => (
            <button key={t.key} className={`profile-nav-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn">Выйти из аккаунта</button>
      </aside>

      {/* Main content */}
      <main className="profile-main">
        {saved && <div className="save-toast">✓ Данные сохранены</div>}

        {/* ── ОБЗОР ── */}
        {tab === 'overview' && (
          <div className="tab-content">
            <div className="stats-row">
              {[['12', 'Заказов', '#10b981'], ['2 450', 'Бонусов', '#f59e0b'], ['8', 'Избранных', '#3b82f6'], ['6', 'Прочитано', '#8b5cf6']].map(([v, l, c]) => (
                <div className="stat-card" key={l} style={{ '--stat-color': c } as React.CSSProperties}>
                  <span className="stat-value">{v}</span>
                  <span className="stat-label">{l}</span>
                </div>
              ))}
            </div>

            <div className="overview-grid">
              <div className="profile-info-card">
                <div className="card-title-row">
                  <h4>Личные данные</h4>
                  {!editing && <button className="edit-trigger" onClick={() => { setEditing(true); setDraft(user) }}>Редактировать</button>}
                </div>

                {editing ? (
                  <div className="edit-form">
                    {([['Имя', 'name'], ['Email', 'email'], ['Телефон', 'phone'], ['Адрес', 'address']] as const).map(([label, field]) => (
                      <div className="input-group" key={field}>
                        <label>{label}</label>
                        <input value={draft[field]} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />
                      </div>
                    ))}
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleSave}>Сохранить</button>
                      <button className="cancel-btn" onClick={() => setEditing(false)}>Отмена</button>
                    </div>
                  </div>
                ) : (
                  <div className="info-rows">
                    {[['👤 Имя', user.name], ['✉️ Email', user.email], ['📱 Телефон', user.phone], ['📍 Адрес', user.address]].map(([l, v]) => (
                      <div className="info-row" key={l as string}><span className="info-label">{l}</span><span className="info-val">{v}</span></div>
                    ))}
                  </div>
                )}
              </div>

              <div className="recent-orders-card">
                <h4>Последние заказы</h4>
                <div className="mini-orders">
                  {MOCK_ORDERS.slice(0, 2).map((o) => (
                    <div className="mini-order" key={o.id}>
                      <div>
                        <p className="mini-order-items">{o.items}</p>
                        <p className="mini-order-date">{o.date}</p>
                      </div>
                      <div className="mini-order-right">
                        <span className="mini-order-price">{o.total.toLocaleString('ru')} ₽</span>
                        <span className="status-dot" style={{ background: STATUS_LABELS[o.status].color }}>{STATUS_LABELS[o.status].label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="view-all-btn" onClick={() => setTab('orders')}>Все заказы →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── ЗАКАЗЫ ── */}
        {tab === 'orders' && (
          <div className="tab-content">
            <h3 className="tab-title">История заказов</h3>
            <div className="orders-list">
              {MOCK_ORDERS.map((o) => (
                <div className="order-card" key={o.id}>
                  <div className="order-id">#{o.id}</div>
                  <div className="order-info">
                    <p className="order-items">{o.items}</p>
                    <p className="order-date">{o.date}</p>
                  </div>
                  <div className="order-right">
                    <span className="order-total">{o.total.toLocaleString('ru')} ₽</span>
                    <span className="order-status" style={{ color: STATUS_LABELS[o.status].color }}>{STATUS_LABELS[o.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ЗДОРОВЬЕ ── */}
        {tab === 'health' && (
          <div className="tab-content">
            <h3 className="tab-title">Профиль здоровья</h3>
            <p className="tab-sub">Персонализированные рекомендации на основе ваших покупок</p>
            <div className="health-grid">
              {[
                { icon: '💊', title: 'Регулярные добавки', items: ['Омега-3', 'Витамин D3'], color: '#10b981' },
                { icon: '📋', title: 'Рекомендуем добавить', items: ['Магний B6', 'Цинк'], color: '#f59e0b' },
                { icon: '📖', title: 'Статьи для вас', items: ['Сон и иммунитет', 'Омега-3: наука 2024'], color: '#8b5cf6' },
              ].map((block) => (
                <div className="health-card" key={block.title} style={{ '--hc': block.color } as React.CSSProperties}>
                  <div className="health-icon">{block.icon}</div>
                  <h4>{block.title}</h4>
                  <ul className="health-list">
                    {block.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="health-tip">
              <span className="tip-icon">💡</span>
              <p>По данным ваших заказов, вы уже принимаете 2 важных нутриента. Рекомендуем пройти тест на дефицит витаминов.</p>
            </div>
          </div>
        )}

        {/* ── НАСТРОЙКИ ── */}
        {tab === 'settings' && (
          <div className="tab-content">
            <h3 className="tab-title">Настройки</h3>
            <div className="settings-sections">
              {[
                { title: 'Уведомления', items: ['Email о статусе заказа', 'Push-уведомления', 'Рассылка со статьями'] },
                { title: 'Конфиденциальность', items: ['Сбор данных для рекомендаций', 'Публичный профиль'] },
              ].map((sec) => (
                <div className="settings-section" key={sec.title}>
                  <h4>{sec.title}</h4>
                  {sec.items.map((item, i) => (
                    <label className="toggle-row" key={item}>
                      <span>{item}</span>
                      <div className="toggle">
                        <input type="checkbox" defaultChecked={i === 0} />
                        <span className="toggle-slider" />
                      </div>
                    </label>
                  ))}
                </div>
              ))}

              <div className="danger-zone">
                <h4>Опасная зона</h4>
                <button className="danger-btn">Удалить аккаунт</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── КОРЗИНА ────────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, onClose, onClear, onRemove, onQtyChange }: {
  cart: CartItem[]
  onClose: () => void
  onClear: () => void
  onRemove: (id: number) => void
  onQtyChange: (id: number, delta: number) => void
}) => {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Корзина <span className="cart-count">{cart.length}</span></h3>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span>🛒</span>
              <p>Корзина пуста</p>
            </div>
          ) : (
            cart.map((i) => (
              <div className="cart-item" key={i.id}>
                <div className="cart-item-info">
                  <span className="cart-item-name">{i.name}</span>
                  <span className="cart-item-price">{(i.price * i.quantity).toLocaleString('ru')} ₽</span>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => onQtyChange(i.id, -1)}>−</button>
                  <span className="qty">{i.quantity}</span>
                  <button className="qty-btn" onClick={() => onQtyChange(i.id, +1)}>+</button>
                  <button className="remove-btn" onClick={() => onRemove(i.id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Итого</span>
              <strong>{total.toLocaleString('ru')} ₽</strong>
            </div>
            <button className="checkout-btn" onClick={onClear}>Оформить заказ</button>
            <button className="clear-cart-btn" onClick={() => { /* clear */ }}>Очистить корзину</button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── НАВИГАЦИЯ ───────────────────────────────────────────────────────────────
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const loc = useLocation()
  const active = loc.pathname === to || (to === '/' && loc.pathname === '/')
  return <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>{children}</Link>
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then((res) => { setProducts(res.data); setLoading(false) })
      .catch(() => { setProducts(MOCK_PRODUCTS); setLoading(false) })
  }, [])

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === p.id)
      if (exist) return prev.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id))

  const changeQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
  }

  const clearCart = () => { setCart([]); setIsCartOpen(false) }

  const totalQty = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <Router>
      <div className="app">
        <header className="header">
          <Link to="/" className="logo-link">
            <div className="logo-area">
              <span className="logo-mark">✚</span>
              <div>
                <h1 className="logo-text">PHARMAOS</h1>
                <p className="logo-sub">Цифровая аптека</p>
              </div>
            </div>
          </Link>

          <nav className="main-nav">
            <NavLink to="/">Каталог</NavLink>
            <NavLink to="/articles">Статьи</NavLink>
            <NavLink to="/profile">Кабинет</NavLink>
          </nav>

          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
            <span className="cart-icon">🛒</span>
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} loading={loading} />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <footer className="main-footer">
          <span>© 2025 PHARMAOS — доказательная медицина</span>
        </footer>

        {isCartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setIsCartOpen(false)}
            onClear={clearCart}
            onRemove={removeFromCart}
            onQtyChange={changeQty}
          />
        )}
      </div>
    </Router>
  )
}