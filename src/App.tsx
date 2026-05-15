import { useState, useEffect, useCallback } from 'react'
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'

// БЭМ-стили (разделены по блокам)
import './styles/base.css'
import './styles/header.css'
import './styles/auth-modal.css'
import './styles/hero.css'
import './styles/product-card.css'
import './styles/articles.css'
import './styles/profile.css'
import './styles/cart.css'

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

interface AuthUser {
  name: string
  email: string
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
  { id: 1, title: 'Как сон регулирует иммунный ответ', excerpt: 'Во время глубокого сна организм производит цитокины — белки, которые борются с инфекциями. Хронический недосып снижает их выработку на 30%.', content: 'Во время сна активируется так называемая «иммунная память». Лимфатическая система мозга — глимфатическая система — очищает нейроны от токсичных белков, в том числе бета-амилоида.', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800', readTime: 5, tag: 'Иммунитет' },
  { id: 2, title: 'Омега-3: что говорит наука в 2026 году', excerpt: 'Метаанализ 40 исследований подтвердил: ежедневный приём EPA и DHA снижает риск сердечно-сосудистых событий на 13% у людей старше 50 лет.', content: 'Омега-3 жирные кислоты встраиваются в мембраны клеток и влияют на воспалительные каскады. Новые исследования показывают их роль в нейропластичности.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', readTime: 7, tag: 'Питание' },
  { id: 3, title: 'Магний: дефицит, который незаметен', excerpt: 'До 80% городского населения испытывает дефицит магния из-за стресса, кофе и обработанной еды. При этом он участвует в 300+ ферментативных реакциях.', content: 'Магний необходим для синтеза АТФ — молекулы энергии. Дефицит проявляется усталостью, судорогами и тревожностью ещё до изменений в анализах крови.', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800', readTime: 6, tag: 'Минералы' },
  { id: 4, title: 'Витамин D и психическое здоровье', excerpt: 'Рецепторы витамина D обнаружены в гиппокампе и коре мозга. Его дефицит коррелирует с депрессией, тревожностью и когнитивным снижением.', content: 'Оптимальный уровень 25(OH)D в крови — 40–60 нг/мл. Большинство жителей средних широт имеют уровень ниже 20 нг/мл, особенно в зимние месяцы.', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', readTime: 8, tag: 'Нейронаука' },
  { id: 5, title: 'Микробиом кишечника и иммунитет', excerpt: '70% иммунных клеток сосредоточено в кишечнике. Разнообразие микробиома напрямую определяет силу иммунного ответа на инфекции.', content: 'Пробиотики второго поколения — живые бактерии с доказанными штаммами — способны восстанавливать нарушенный микробиом за 4–8 недель при регулярном применении.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800', readTime: 6, tag: 'Микробиом' },
  { id: 6, title: 'Коллаген: факты и мифы', excerpt: 'Морской коллаген I типа имеет пептиды меньшего размера, чем говяжий, что ускоряет его всасывание. Клинические исследования подтверждают эффект через 8 недель.', content: 'Синтез собственного коллагена снижается с 25 лет на 1% в год. Экзогенные пептиды стимулируют фибробласты к выработке нового коллагена через аминокислотный сигнальный путь.', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800', readTime: 5, tag: 'Красота' },
]

const MOCK_ORDERS: Order[] = [
  { id: 10234, date: '12 мая 2026', items: 'Омега-3 Premium, Витамин D3', total: 2050, status: 'delivered' },
  { id: 10198, date: '3 апреля 2026', items: 'Магний B6 Форте', total: 890, status: 'delivered' },
  { id: 10312, date: '17 мая 2026', items: 'Коллаген морской, Пробиотик', total: 2800, status: 'processing' },
]

const STATUS_LABELS = {
  delivered: { label: 'Доставлен', color: '#10b981' },
  processing: { label: 'Обрабатывается', color: '#f59e0b' },
  shipped: { label: 'В пути', color: '#3b82f6' },
}

// ─── AUTH MODAL ──────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onLogin }: { onClose: () => void; onLogin: (user: AuthUser) => void }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (mode === 'register' && !fields.name.trim()) e.name = 'Введите имя'
    if (!fields.email.includes('@')) e.email = 'Некорректный email'
    if (fields.password.length < 6) e.password = 'Минимум 6 символов'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    // Имитация запроса к API
    await new Promise(r => setTimeout(r, 900))
    const name = mode === 'register' ? fields.name : fields.email.split('@')[0]
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    onLogin({ name, email: fields.email, initials })
    setLoading(false)
  }

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="auth-modal__overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Авторизация">
        <button className="auth-modal__close" onClick={onClose} aria-label="Закрыть">×</button>

        <div className="auth-modal__head">
          <div className="auth-modal__brand">
            <span className="auth-modal__brand-mark">✚</span>
            <span className="auth-modal__brand-name">PHARMAOS</span>
          </div>

          <h2 className="auth-modal__title">
            {mode === 'login' ? 'С возвращением' : 'Создать аккаунт'}
          </h2>
          <p className="auth-modal__subtitle">
            {mode === 'login'
              ? 'Войдите, чтобы управлять заказами и бонусами'
              : 'Получите 300 бонусных баллов при регистрации'}
          </p>

          <div className="auth-modal__tabs">
            <button
              className={`auth-modal__tab ${mode === 'login' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => { setMode('login'); setErrors({}) }}
            >Вход</button>
            <button
              className={`auth-modal__tab ${mode === 'register' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => { setMode('register'); setErrors({}) }}
            >Регистрация</button>
          </div>
        </div>

        <div className="auth-modal__body">
          {mode === 'register' && (
            <div className="auth-modal__bonus-hint">
              <span>🎁</span>
              <span>300 бонусных баллов</span>
            </div>
          )}

          <div className="auth-form">
            {mode === 'register' && (
              <div className="auth-form__group">
                <label className="auth-form__label">Имя</label>
                <input
                  className={`auth-form__input${errors.name ? ' auth-form__input--error' : ''}`}
                  type="text"
                  placeholder="Иван Иванов"
                  value={fields.name}
                  onChange={set('name')}
                  autoFocus
                />
                {errors.name && <span className="auth-form__error">{errors.name}</span>}
              </div>
            )}

            <div className="auth-form__group">
              <label className="auth-form__label">Email</label>
              <input
                className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
                type="email"
                placeholder="ivan@example.com"
                value={fields.email}
                onChange={set('email')}
                autoFocus={mode === 'login'}
              />
              {errors.email && <span className="auth-form__error">{errors.email}</span>}
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">Пароль</label>
              <div className="auth-form__input-wrap">
                <input
                  className={`auth-form__input${errors.password ? ' auth-form__input--error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  value={fields.password}
                  onChange={set('password')}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                />
                <button
                  type="button"
                  className="auth-form__eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className="auth-form__error">{errors.password}</span>}
            </div>

            {mode === 'login' && (
              <div className="auth-form__forgot">
                <button className="auth-form__forgot-link" type="button">Забыли пароль?</button>
              </div>
            )}

            <button className="auth-form__submit" onClick={handleSubmit} disabled={loading}>
              {loading && <span className="auth-form__submit-spinner" />}
              {loading ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>

            <div className="auth-form__divider">или</div>

            <div className="auth-form__socials">
              <button className="auth-form__social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="auth-form__social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────
const Home = ({ products, addToCart, loading }: { products: Product[]; addToCart: (p: Product) => void; loading: boolean }) => (
  <>
    <section className="hero">
      <div className="hero__badge">Научный подход к здоровью</div>
      <h2 className="hero__title">Аптека, которая<br /><em>объясняет</em></h2>
      <p className="hero__sub">Только препараты с доказательной базой. Каждый товар — со статьёй о том, как он работает.</p>
      <div className="hero__stats">
        <div className="hero__stat"><span>240+</span><small>товаров</small></div>
        <div className="hero__divider" />
        <div className="hero__stat"><span>48 ч</span><small>доставка</small></div>
        <div className="hero__divider" />
        <div className="hero__stat"><span>6 статей</span><small>ежемесячно</small></div>
      </div>
    </section>

    <div className="section-header">
      <h2 className="section-header__title">Популярные товары</h2>
      <span className="section-header__sub">Выбор наших покупателей</span>
    </div>

    {loading ? (
      <div className="loading-state">
        <div className="loading-state__spinner" />
        <p>Загружаем каталог…</p>
      </div>
    ) : (
      <main className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card__img-wrap">
              {product.image?.startsWith('http') ? (
                <img src={product.image} alt={product.name} className="product-card__img" />
              ) : (
                <div className="product-card__placeholder">💊</div>
              )}
              <span className="product-card__category">{product.category}</span>
            </div>
            <div className="product-card__body">
              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__desc">{product.description}</p>
              <div className="product-card__footer">
                <strong className="product-card__price">{product.price.toLocaleString('ru')} ₽</strong>
                <button className="add-btn" onClick={() => addToCart(product)}>В корзину</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    )}
  </>
)

// ─── СТАТЬИ ──────────────────────────────────────────────────────────────────
const Articles = () => {
  const [selected, setSelected] = useState<Article | null>(null)
  const [filter, setFilter] = useState('Все')
  const tags = ['Все', ...Array.from(new Set(ARTICLES.map((a) => a.tag)))]
  const filtered = filter === 'Все' ? ARTICLES : ARTICLES.filter((a) => a.tag === filter)

  if (selected) {
    return (
      <div className="article-full">
        <button className="article-full__back-btn" onClick={() => setSelected(null)}>← Назад к статьям</button>
        <div className="article-full__img-wrap">
          <img src={selected.image} alt={selected.title} className="article-full__img" />
          <span className="article-full__tag-big">{selected.tag}</span>
        </div>
        <div className="article-full__body">
          <div className="article-full__meta">{selected.readTime} мин чтения</div>
          <h2 className="article-full__title">{selected.title}</h2>
          <p className="article-full__excerpt">{selected.excerpt}</p>
          <p className="article-full__content">{selected.content}</p>
          <div className="article-full__cta">
            <p>Нашли интересный препарат из статьи?</p>
            <Link to="/" className="article-full__cta-link">Смотреть каталог →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <h2 className="section-header__title">Научные статьи</h2>
        <span className="section-header__sub">Доказательная медицина простым языком</span>
      </div>

      <div className="tag-filters">
        {tags.map((t) => (
          <button
            key={t}
            className={`tag-filters__btn${filter === t ? ' tag-filters__btn--active' : ''}`}
            onClick={() => setFilter(t)}
          >{t}</button>
        ))}
      </div>

      <div className="articles-grid">
        {filtered.map((article) => (
          <div className="article-card" key={article.id}>
            <div className="article-card__img-wrap">
              <img src={article.image} alt={article.title} className="article-card__img" />
              <span className="article-card__tag">{article.tag}</span>
            </div>
            <div className="article-card__body">
              <div className="article-card__meta">{article.readTime} мин</div>
              <h3 className="article-card__title">{article.title}</h3>
              <p className="article-card__excerpt">{article.excerpt}</p>
              <button className="article-card__read-btn" onClick={() => setSelected(article)}>Читать статью →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ПРОФИЛЬ ─────────────────────────────────────────────────────────────────
const Profile = () => {
  const [tab, setTab] = useState<'overview' | 'orders' | 'health' | 'settings'>('overview')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<UserProfile>({
    name: 'Иван Иванов', email: 'ivan@example.com', phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Лесная, д. 12, кв. 34', bonuses: 2450, initials: 'ИИ',
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
      <aside className="profile-sidebar">
        <div className="profile-sidebar__avatar">{user.initials}</div>
        <h3 className="profile-sidebar__name">{user.name}</h3>
        <p className="profile-sidebar__email">{user.email}</p>

        <div className="bonus-card">
          <span className="bonus-card__label">Бонусные баллы</span>
          <span className="bonus-card__value">{user.bonuses.toLocaleString('ru')}</span>
          <span className="bonus-card__note">≈ {Math.floor(user.bonuses * 0.1)} ₽ скидки</span>
        </div>

        <nav className="profile-nav">
          {TABS.map((t) => (
            <button key={t.key} className={`profile-nav__btn${tab === t.key ? ' profile-nav__btn--active' : ''}`} onClick={() => setTab(t.key)}>
              <span className="profile-nav__icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn">Выйти из аккаунта</button>
      </aside>

      <main className="profile-main">
        {saved && <div className="save-toast">✓ Данные сохранены</div>}

        {tab === 'overview' && (
          <div className="profile-main__tab-content">
            <div className="stats-row">
              {[['12', 'Заказов', '#10b981'], ['2 450', 'Бонусов', '#f59e0b'], ['8', 'Избранных', '#3b82f6'], ['6', 'Прочитано', '#8b5cf6']].map(([v, l, c]) => (
                <div className="stat-card" key={l} style={{ '--stat-color': c } as React.CSSProperties}>
                  <span className="stat-card__value">{v}</span>
                  <span className="stat-card__label">{l}</span>
                </div>
              ))}
            </div>

            <div className="overview-grid">
              <div className="profile-info-card">
                <div className="profile-info-card__title-row">
                  <h4>Личные данные</h4>
                  {!editing && <button className="edit-trigger" onClick={() => { setEditing(true); setDraft(user) }}>Редактировать</button>}
                </div>

                {editing ? (
                  <div className="edit-form">
                    {([['Имя', 'name'], ['Email', 'email'], ['Телефон', 'phone'], ['Адрес', 'address']] as const).map(([label, field]) => (
                      <div className="input-group" key={field}>
                        <label className="input-group__label">{label}</label>
                        <input className="input-group__input" value={draft[field]} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />
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
                      <div className="info-row" key={l as string}>
                        <span className="info-row__label">{l}</span>
                        <span className="info-row__val">{v}</span>
                      </div>
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
                        <p className="mini-order__items">{o.items}</p>
                        <p className="mini-order__date">{o.date}</p>
                      </div>
                      <div className="mini-order__right">
                        <span className="mini-order__price">{o.total.toLocaleString('ru')} ₽</span>
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

        {tab === 'orders' && (
          <div className="profile-main__tab-content">
            <h3 className="tab-title">История заказов</h3>
            <div className="orders-list">
              {MOCK_ORDERS.map((o) => (
                <div className="order-card" key={o.id}>
                  <div className="order-card__id">#{o.id}</div>
                  <div className="order-card__info">
                    <p className="order-card__items">{o.items}</p>
                    <p className="order-card__date">{o.date}</p>
                  </div>
                  <div className="order-card__right">
                    <span className="order-card__total">{o.total.toLocaleString('ru')} ₽</span>
                    <span className="order-card__status" style={{ color: STATUS_LABELS[o.status].color }}>{STATUS_LABELS[o.status].label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'health' && (
          <div className="profile-main__tab-content">
            <h3 className="tab-title">Профиль здоровья</h3>
            <p className="tab-sub">Персонализированные рекомендации на основе ваших покупок</p>
            <div className="health-grid">
              {[
                { icon: '💊', title: 'Регулярные добавки', items: ['Омега-3', 'Витамин D3'], color: '#10b981' },
                { icon: '📋', title: 'Рекомендуем добавить', items: ['Магний B6', 'Цинк'], color: '#f59e0b' },
                { icon: '📖', title: 'Статьи для вас', items: ['Сон и иммунитет', 'Омега-3: наука 2026'], color: '#8b5cf6' },
              ].map((block) => (
                <div className="health-card" key={block.title} style={{ '--hc': block.color } as React.CSSProperties}>
                  <div className="health-card__icon">{block.icon}</div>
                  <h4 className="health-card__title">{block.title}</h4>
                  <ul className="health-card__list">
                    {block.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="health-tip">
              <span className="health-tip__icon">💡</span>
              <p>По данным ваших заказов, вы уже принимаете 2 важных нутриента. Рекомендуем пройти тест на дефицит витаминов.</p>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="profile-main__tab-content">
            <h3 className="tab-title">Настройки</h3>
            <div className="settings-sections">
              {[
                { title: 'Уведомления', items: ['Email о статусе заказа', 'Push-уведомления', 'Рассылка со статьями'] },
                { title: 'Конфиденциальность', items: ['Сбор данных для рекомендаций', 'Публичный профиль'] },
              ].map((sec) => (
                <div className="settings-section" key={sec.title}>
                  <h4 className="settings-section__title">{sec.title}</h4>
                  {sec.items.map((item, i) => (
                    <label className="toggle-row" key={item}>
                      <span>{item}</span>
                      <div className="toggle">
                        <input type="checkbox" defaultChecked={i === 0} />
                        <span className="toggle__slider" />
                      </div>
                    </label>
                  ))}
                </div>
              ))}
              <div className="danger-zone">
                <h4 className="danger-zone__title">Опасная зона</h4>
                <button className="danger-btn">Удалить аккаунт</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── КОРЗИНА ─────────────────────────────────────────────────────────────────
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
      <div className="cart-drawer__overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            Корзина <span className="cart-drawer__count">{cart.length}</span>
          </h3>
          <button className="cart-drawer__close" onClick={onClose}>×</button>
        </div>

        <div className="cart-drawer__items">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <span>🛒</span>
              <p>Корзина пуста</p>
            </div>
          ) : (
            cart.map((i) => (
              <div className="cart-item" key={i.id}>
                <div className="cart-item__info">
                  <span className="cart-item__name">{i.name}</span>
                  <span className="cart-item__price">{(i.price * i.quantity).toLocaleString('ru')} ₽</span>
                </div>
                <div className="cart-item__controls">
                  <button className="cart-item__qty-btn" onClick={() => onQtyChange(i.id, -1)}>−</button>
                  <span className="cart-item__qty">{i.quantity}</span>
                  <button className="cart-item__qty-btn" onClick={() => onQtyChange(i.id, +1)}>+</button>
                  <button className="cart-item__remove" onClick={() => onRemove(i.id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Итого</span>
              <strong>{total.toLocaleString('ru')} ₽</strong>
            </div>
            <button className="cart-drawer__checkout" onClick={onClear}>Оформить заказ</button>
            <button className="cart-drawer__clear">Очистить корзину</button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── НАВИГАЦИЯ ────────────────────────────────────────────────────────────────
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return <Link to={to} className={`main-nav__link${active ? ' main-nav__link--active' : ''}`}>{children}</Link>
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
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

  const handleLogin = useCallback((user: AuthUser) => {
    setCurrentUser(user)
    setIsAuthOpen(false)
  }, [])

  const handleLogout = () => setCurrentUser(null)

  const totalQty = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <Router>
      <div className="app">
        <header className="header">
          <Link to="/" className="logo">
            <div className="logo__area">
              <span className="logo__mark">✚</span>
              <div>
                <h1 className="logo__text">PHARMAOS</h1>
                <p className="logo__sub">Цифровая аптека</p>
              </div>
            </div>
          </Link>

          <nav className="main-nav">
            <NavLink to="/">Каталог</NavLink>
            <NavLink to="/articles">Статьи</NavLink>
            <NavLink to="/profile">Кабинет</NavLink>
          </nav>

          <div className="header-actions">
            {currentUser ? (
              <button className="auth-button auth-button--logged-in" onClick={handleLogout}>
                <div className="auth-button__avatar">{currentUser.initials}</div>
                {currentUser.name.split(' ')[0]}
              </button>
            ) : (
              <button className="auth-button" onClick={() => setIsAuthOpen(true)}>
                Войти
              </button>
            )}

            <button className="cart-button" onClick={() => setIsCartOpen(true)}>
              <span className="cart-button__icon">🛒</span>
              {totalQty > 0 && <span className="cart-button__badge">{totalQty}</span>}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} loading={loading} />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <footer className="main-footer">
          <span>© 2026 PHARMAOS — доказательная медицина</span>
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

        {isAuthOpen && (
          <AuthModal
            onClose={() => setIsAuthOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  )
}
