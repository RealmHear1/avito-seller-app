# Avito Seller - Frontend Test Assignment

Веб-приложение для личного кабинета продавца на Avito с интеграцией AI-ассистента.

## Запуск проекта (интеграция с Ollama)

## Запуск с Docker

- Для скорости и точности модели лучше разворачивать приложение без Docker, см. раздел [Локальный запуск](#локальный-запуск-без-docker).

### Development сборка
```bash
docker-compose up --build
```

### Production сборка
```bash
docker-compose -f docker-compose.prod.yml up --build
```

Примечание:
- При первом запуске Docker скачает образ `ollama/ollama` (несколько GB).
- При первом запуске будет автоматически скачана лёгкая модель `llama3.2:3b` в Docker volume `ollama_data`.
- Запросы могут идти медленно из-за ограничений RAM в контейнере (можно увеличить в настройках Docker).

Дополнительно:
- Если нужно качество выше, можно вручную поставить `llama3`:
  - В файле `docker-compose.yml` изменить значение entrypoint на `ollama serve & sleep 2; ollama show llama3 >/dev/null 2>&1 || ollama pull llama3; wait`

Очистка места от Ollama:
```bash
docker-compose down
docker-compose -f docker-compose.prod.yml down
docker volume rm avito-test_ollama_data
```

### Доступ к сервисам
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Ollama API: http://localhost:11434

### Остановка
```bash
docker-compose down
docker-compose -f docker-compose.prod.yml down
```

---

## Локальный запуск (без Docker)

### Установка Ollama
```bash
# Скачайте и установите Ollama с официального сайта
# https://ollama.ai/download

# Загрузка модели
ollama pull llama3

# Запуск сервера
ollama serve
```

### Запуск проекта
```bash
# Терминал 1: Backend
cd server
npm start

# Терминал 2: Frontend
cd client
npm run dev

# Терминал 3: Ollama
ollama serve
```

---

## Структура проекта

```
avito-test/
├── client/         
├── server/    
├── docker-compose.yml
└── README.md
```

## Технологии

### Frontend
- React 18.2.0 с TypeScript
- Vite для сборки
- Material UI (MUI) для компонентов
- React Router для навигации
- TanStack Query для API запросов
- Redux Toolkit для стейт-менеджмента
- React Hook Form + Zod для форм
- ESLint + Prettier

### AI Integration
- Ollama для локального LLM
- llama 3 модель

---

## Использование приложения

### Основные страницы
- `/ads` - Список объявлений
- `/ads/:id` - Детальная информация
- `/ads/:id/edit` - Редактирование с AI

---

## API эндпоинты

- `GET /items` - Получение списка объявлений
- `GET /items/:id` - Получение объявления по ID
- `PUT /items/:id` - Обновление объявления