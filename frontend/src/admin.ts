import "./admin-light.css";
import {
  apiAuthMe,
  apiLogin,
  apiRegisterBootstrap,
  createAdminConfig,
  createAdminUser,
  deleteAdminConfig,
  deleteAdminUser,
  listAdminConfigs,
  listBehaviorMetrics,
  listLeads,
  fetchRegistrationOpen,
  getAdminToken,
  listAdmins,
  normalizeToStringArray,
  setAdminToken,
  updateAdminConfig,
} from "./api";
import type { AdminUserPublic, BehaviorMetricsRecord, LeadResponse } from "./types";

export function getAdminHTML(): string {
  return `
  <div class="admin-page">
    <div class="page-bg" aria-hidden="true">
      <span class="orb orb-1"></span>
      <span class="orb orb-2"></span>
      <span class="orb orb-3"></span>
      <span class="orb orb-4"></span>
      <span class="orb orb-5"></span>
      <span class="orb orb-6"></span>
    </div>

    <main class="container admin-layout">
      <section id="admin-auth-view" class="hero-card admin-auth-card" aria-labelledby="admin-auth-title">
        <p class="eyebrow">Autello Concierge</p>
        <h1 id="admin-auth-title">Вход в админ-панель</h1>
        <p class="hero-subtitle">
          Доступ к управлению администраторами и услугами. Используйте логин и пароль администратора.
        </p>

        <form id="admin-login-form" class="lead-form admin-auth-form" novalidate>
          <label class="field">
            <span>Логин *</span>
            <input name="username" type="text" autocomplete="username" required minlength="3" />
          </label>
          <label class="field">
            <span>Пароль *</span>
            <input name="password" type="password" autocomplete="current-password" required minlength="8" />
          </label>
          <div class="actions">
            <button type="submit" id="admin-login-submit">Войти</button>
            <p class="status" id="admin-auth-status" role="status" aria-live="polite"></p>
          </div>
        </form>

        <div class="admin-auth-extra">
          <div class="actions">
            <button type="button" class="admin-gold-button" id="admin-register-toggle" hidden>
              Зарегистрироваться
            </button>
          </div>
          <p class="admin-hint" id="admin-register-hint" hidden>
            Регистрация доступна, пока в системе нет ни одного администратора.
          </p>
        </div>

        <div id="admin-register-panel" class="admin-register-panel" hidden>
          <h2 class="admin-register-title">Первый администратор</h2>
          <p class="hero-subtitle admin-register-lead">
            Задайте логин и пароль. После создания учётной записи эта форма будет скрыта для новых посетителей.
          </p>
          <form id="admin-register-form" class="lead-form" novalidate>
            <label class="field">
              <span>Логин *</span>
              <input name="username" type="text" autocomplete="username" required minlength="3" />
            </label>
            <label class="field">
              <span>Пароль *</span>
              <input name="password" type="password" autocomplete="new-password" required minlength="8" />
            </label>
            <label class="field">
              <span>Повтор пароля *</span>
              <input name="password2" type="password" autocomplete="new-password" required minlength="8" />
            </label>
            <div class="actions">
              <button type="submit" id="admin-register-submit">Создать и войти</button>
              <button type="button" class="admin-gold-button" id="admin-register-cancel">Отмена</button>
            </div>
          </form>
        </div>
      </section>

      <div id="admin-dashboard-view" class="admin-dashboard" hidden>
        <header class="admin-toolbar">
          <div class="admin-toolbar-left">
            <p class="eyebrow">Админ-панель</p>
            <p class="admin-user-line">
              Вы вошли как <strong id="admin-current-username">—</strong>
            </p>
          </div>
          <div class="admin-toolbar-actions">
            <button type="button" class="admin-gold-button" id="admin-open-stats-btn">Статистика</button>
          <button type="button" class="admin-gold-button" id="admin-logout-btn">Выйти</button>
          </div>
        </header>

        <section class="hero-card admin-admins-card">
          <h2 class="admin-subheading">Администраторы</h2>
          <p class="hero-subtitle admin-admins-lead">
            Создание и удаление учётных записей (нельзя удалить последнего администратора).
          </p>
          <form id="admin-new-user-form" class="lead-form admin-inline-form" novalidate>
          <div class="grid two-col">
            <label class="field">
                <span>Новый логин *</span>
                <input name="username" type="text" required minlength="3" />
            </label>
            <label class="field">
                <span>Пароль *</span>
                <input name="password" type="password" autocomplete="new-password" required minlength="8" />
            </label>
          </div>
            <div class="actions">
              <button type="submit" id="admin-create-user-btn">Добавить администратора</button>
              <p class="status" id="admin-admins-status" role="status" aria-live="polite"></p>
          </div>
          </form>
          <ul class="admin-user-list" id="admin-user-list" aria-label="Список администраторов"></ul>
        </section>

        <section class="hero-card admin-services-card">
          <h2 class="admin-subheading">Услуги</h2>
          <p class="hero-subtitle admin-services-lead">
            Редактирование каталога услуг: добавляйте, изменяйте и удаляйте услуги в таблице.
          </p>
          <div class="admin-services-layout">
            <div class="admin-services-table-wrap">
              <table class="admin-services-table" aria-label="Таблица услуг">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Услуга</th>
                  </tr>
                </thead>
                <tbody id="admin-services-body"></tbody>
              </table>
          </div>
            <aside class="admin-services-tools" aria-label="Панель инструментов услуг">
              <form id="admin-service-form" class="lead-form admin-inline-form" novalidate>
            <label class="field">
                  <span>Название услуги *</span>
                  <input id="admin-service-input" name="service_name" type="text" required minlength="2" />
            </label>
                <div class="actions admin-services-actions">
                  <button type="submit" id="admin-service-save-btn">Добавить</button>
                  <button type="button" class="admin-edit-btn" id="admin-service-edit-btn" disabled>
                    Редактировать
                  </button>
                  <button type="button" class="admin-gold-button" id="admin-service-reset-btn">Сбросить выбор</button>
                  <button type="button" class="admin-danger-btn" id="admin-service-delete-btn" disabled>
                    Удалить выбранную
                  </button>
          </div>
                <p class="status" id="admin-services-status" role="status" aria-live="polite"></p>
              </form>
            </aside>
          </div>
        </section>

        <section class="hero-card admin-leads-card">
          <div class="admin-leads-header">
            <div>
              <h2 class="admin-subheading">Заявки и интеллектуальный анализ</h2>
              <p class="hero-subtitle admin-leads-lead">
                Горячие лиды автоматически поднимаются вверх. Для каждой заявки рассчитывается приоритет и рекомендации.
              </p>
            </div>
            <button type="button" class="admin-gold-button" id="admin-refresh-leads-btn">Обновить заявки</button>
          </div>

          <section class="admin-leads-summary" id="admin-leads-summary">
            <article class="admin-stat-card">
              <h3>Всего заявок</h3>
              <p id="lead-summary-total">—</p>
            </article>
            <article class="admin-stat-card">
              <h3>Горячих</h3>
              <p id="lead-summary-hot">—</p>
            </article>
            <article class="admin-stat-card">
              <h3>Тёплых</h3>
              <p id="lead-summary-warm">—</p>
            </article>
            <article class="admin-stat-card">
              <h3>Холодных</h3>
              <p id="lead-summary-cold">—</p>
            </article>
            <article class="admin-stat-card">
              <h3>Средний score</h3>
              <p id="lead-summary-score">—</p>
            </article>
          </section>

          <div class="admin-leads-table-wrap">
            <table class="admin-services-table admin-leads-table" aria-label="Таблица заявок">
              <thead>
                <tr>
                  <th scope="col">Приоритет</th>
                  <th scope="col">Лид</th>
                  <th scope="col">Температура</th>
                  <th scope="col">Срок</th>
                  <th scope="col">Бюджет</th>
                  <th scope="col">Отдел</th>
                  <th scope="col">Рекомендация</th>
                  <th scope="col">Действие</th>
                </tr>
              </thead>
              <tbody id="admin-leads-body"></tbody>
            </table>
          </div>
          <p class="status" id="admin-leads-status" role="status" aria-live="polite"></p>
        </section>
      </div>
    </main>

    <div id="admin-stats-modal" class="admin-stats-modal" hidden>
      <div class="admin-stats-backdrop" id="admin-stats-close-backdrop"></div>
      <div class="admin-stats-panel" role="dialog" aria-modal="true" aria-labelledby="admin-stats-title">
        <header class="admin-stats-header">
          <div>
            <h2 id="admin-stats-title">Статистика пользователей</h2>
            <p>Агрегированные метрики времени и карта активности курсора</p>
          </div>
          <button type="button" class="admin-danger-btn" id="admin-stats-close-btn">Закрыть</button>
        </header>

        <section class="admin-stats-summary" id="admin-stats-summary">
          <article class="admin-stat-card">
            <h3>За день</h3>
            <p id="stats-day-max">Макс: —</p>
            <p id="stats-day-avg">Среднее: —</p>
          </article>
          <article class="admin-stat-card">
            <h3>За неделю</h3>
            <p id="stats-week-max">Макс: —</p>
            <p id="stats-week-avg">Среднее: —</p>
          </article>
          <article class="admin-stat-card">
            <h3>За месяц</h3>
            <p id="stats-month-max">Макс: —</p>
            <p id="stats-month-avg">Среднее: —</p>
          </article>
        </section>

        <section class="admin-heatmap-wrap">
          <div class="admin-heatmap-meta">
            <p id="stats-points-info">Точек: —</p>
            <p id="stats-samples-info">Сэмплов: —</p>
          </div>
          <canvas id="admin-heatmap-canvas" width="1200" height="520"></canvas>
        </section>
      </div>
    </div>

    <div id="admin-lead-details-modal" class="admin-stats-modal" hidden>
      <div class="admin-stats-backdrop" id="admin-lead-details-close-backdrop"></div>
      <div class="admin-stats-panel admin-lead-details-panel" role="dialog" aria-modal="true" aria-labelledby="admin-lead-details-title">
        <header class="admin-stats-header">
          <div>
            <h2 id="admin-lead-details-title">Детали заявки</h2>
            <p id="admin-lead-details-subtitle">—</p>
            </div>
          <button type="button" class="admin-danger-btn" id="admin-lead-details-close-btn">Закрыть</button>
        </header>
        <section class="admin-lead-details-grid" id="admin-lead-details-grid"></section>
        <section class="admin-lead-details-recommend" id="admin-lead-details-recommend"></section>
            <div class="actions">
          <button type="button" id="admin-lead-contact-btn">Связаться с человеком</button>
            </div>
      </div>
    </div>
  </div>
  `;
}

let currentAdminId: number | null = null;
let servicesSectionBound = false;
let activeConfigId: number | null = null;
let activeConfigIds: number[] = [];
let activeServices: string[] = [];
let selectedServiceIndex: number | null = null;
let editingServiceIndex: number | null = null;
let leadsSectionBound = false;
let leadDetailsModalBound = false;
let analyzedLeads: LeadWithAnalysis[] = [];
let leadDetailsOpenId: number | null = null;

export async function initAdmin(): Promise<void> {
  const authView = document.querySelector<HTMLElement>("#admin-auth-view");
  const dashboardView = document.querySelector<HTMLElement>("#admin-dashboard-view");
  const authStatus = document.querySelector<HTMLParagraphElement>("#admin-auth-status");
  const loginForm = document.querySelector<HTMLFormElement>("#admin-login-form");
  const registerToggle = document.querySelector<HTMLButtonElement>("#admin-register-toggle");
  const registerHint = document.querySelector<HTMLParagraphElement>("#admin-register-hint");
  const registerPanel = document.querySelector<HTMLElement>("#admin-register-panel");
  const registerForm = document.querySelector<HTMLFormElement>("#admin-register-form");
  const registerCancel = document.querySelector<HTMLButtonElement>("#admin-register-cancel");
  const usernameLabel = document.querySelector<HTMLElement>("#admin-current-username");
  const openStatsBtn = document.querySelector<HTMLButtonElement>("#admin-open-stats-btn");
  const logoutBtn = document.querySelector<HTMLButtonElement>("#admin-logout-btn");
  const statsModal = document.querySelector<HTMLElement>("#admin-stats-modal");
  const statsCloseBtn = document.querySelector<HTMLButtonElement>("#admin-stats-close-btn");
  const statsBackdrop = document.querySelector<HTMLElement>("#admin-stats-close-backdrop");

  if (
    !authView ||
    !dashboardView ||
    !authStatus ||
    !loginForm ||
    !registerToggle ||
    !registerHint ||
    !registerPanel ||
    !registerForm ||
    !registerCancel ||
    !usernameLabel ||
    !openStatsBtn ||
    !logoutBtn ||
    !statsModal ||
    !statsCloseBtn ||
    !statsBackdrop
  ) {
    throw new Error("Admin shell elements not found");
  }

  setupStatsModal(openStatsBtn, statsModal, statsCloseBtn, statsBackdrop);

  let registrationOpen = false;
  try {
    const ro = await fetchRegistrationOpen();
    registrationOpen = ro.registration_open;
  } catch {
    setAuthStatus(authStatus, "Не удалось проверить доступность регистрации.", true);
  }

  registerToggle.hidden = !registrationOpen;
  registerHint.hidden = !registrationOpen;

  registerToggle.addEventListener("click", () => {
    registerPanel.hidden = false;
    registerToggle.hidden = true;
    registerHint.hidden = true;
  });

  registerCancel.addEventListener("click", () => {
    registerPanel.hidden = true;
    registerForm.reset();
    if (registrationOpen) {
      registerToggle.hidden = false;
      registerHint.hidden = false;
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) {
      setAuthStatus(authStatus, "Проверьте логин и пароль.", true);
      return;
    }
    const data = new FormData(loginForm);
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    setAuthStatus(authStatus, "Входим…");
    try {
      const token = await apiLogin(username, password);
      setAdminToken(token.access_token);
      await enterDashboard(dashboardView, authView, usernameLabel);
      setAuthStatus(authStatus, "");
    } catch (error) {
      console.error(error);
      setAuthStatus(authStatus, error instanceof Error ? error.message : "Ошибка входа", true);
    }
  });

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!registerForm.reportValidity()) {
      setAuthStatus(authStatus, "Заполните все поля корректно.", true);
      return;
    }
    const data = new FormData(registerForm);
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const password2 = String(data.get("password2") ?? "");
    if (password !== password2) {
      setAuthStatus(authStatus, "Пароли не совпадают.", true);
      return;
    }
    setAuthStatus(authStatus, "Создаём учётную запись…");
    try {
      await apiRegisterBootstrap(username, password);
      const token = await apiLogin(username, password);
      setAdminToken(token.access_token);
      registrationOpen = false;
      registerPanel.hidden = true;
      registerToggle.hidden = true;
      registerHint.hidden = true;
      await enterDashboard(dashboardView, authView, usernameLabel);
      setAuthStatus(authStatus, "");
    } catch (error) {
      console.error(error);
      setAuthStatus(authStatus, error instanceof Error ? error.message : "Ошибка регистрации", true);
    }
  });

  logoutBtn.addEventListener("click", () => {
    setAdminToken(null);
    currentAdminId = null;
    activeConfigId = null;
    activeConfigIds = [];
    activeServices = [];
    selectedServiceIndex = null;
    editingServiceIndex = null;
    analyzedLeads = [];
    leadDetailsOpenId = null;
    dashboardView.hidden = true;
    authView.hidden = false;
    loginForm.reset();
    registerForm.reset();
    registerPanel.hidden = true;
    setAuthStatus(authStatus, "");
    void refreshRegistrationAfterLogout(registerToggle, registerHint, registerPanel, registerForm);
  });

  const existing = getAdminToken();
  if (existing) {
    try {
      const me = await apiAuthMe();
      currentAdminId = me.id;
      usernameLabel.textContent = me.username;
      authView.hidden = true;
      dashboardView.hidden = false;
      setupAdminsSection();
      setupServicesSection();
      setupLeadsSection();
    } catch {
      setAdminToken(null);
      authView.hidden = false;
      dashboardView.hidden = true;
    }
  }
}

async function refreshRegistrationAfterLogout(
  registerToggle: HTMLButtonElement,
  registerHint: HTMLParagraphElement,
  registerPanel: HTMLElement,
  registerForm: HTMLFormElement,
): Promise<void> {
  try {
    const ro = await fetchRegistrationOpen();
    const open = ro.registration_open;
    registerToggle.hidden = !open || !registerPanel.hidden;
    registerHint.hidden = !open || !registerPanel.hidden;
    if (!open) {
      registerPanel.hidden = true;
      registerForm.reset();
    }
  } catch {
    /* keep UI as is */
  }
}

async function enterDashboard(
  dashboardView: HTMLElement,
  authView: HTMLElement,
  usernameLabel: HTMLElement,
): Promise<void> {
  const me = await apiAuthMe();
  currentAdminId = me.id;
  usernameLabel.textContent = me.username;
  authView.hidden = true;
  dashboardView.hidden = false;
  setupAdminsSection();
  setupServicesSection();
  setupLeadsSection();
}

function setAuthStatus(statusEl: HTMLParagraphElement, text: string, isError = false): void {
  statusEl.textContent = text;
  statusEl.dataset.variant = isError ? "error" : text ? "ok" : "";
}

let adminsSectionBound = false;

function setupAdminsSection(): void {
  if (adminsSectionBound) {
    void refreshAdminsList();
    return;
  }
  adminsSectionBound = true;

  const form = document.querySelector<HTMLFormElement>("#admin-new-user-form");
  const statusEl = document.querySelector<HTMLParagraphElement>("#admin-admins-status");
  if (!form || !statusEl) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      statusEl.textContent = "Проверьте логин и пароль.";
      statusEl.dataset.variant = "error";
      return;
    }
    const data = new FormData(form);
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    statusEl.textContent = "Создаём…";
    statusEl.dataset.variant = "";
    try {
      await createAdminUser(username, password);
      form.reset();
      statusEl.textContent = "Администратор добавлен.";
      statusEl.dataset.variant = "ok";
      await refreshAdminsList();
    } catch (error) {
      console.error(error);
      statusEl.textContent = "Не удалось создать администратора.";
      statusEl.dataset.variant = "error";
    }
  });

  void refreshAdminsList();
}

async function refreshAdminsList(): Promise<void> {
  const listEl = document.querySelector<HTMLUListElement>("#admin-user-list");
  if (!listEl) {
    return;
  }
  let admins: AdminUserPublic[] = [];
  try {
    admins = await listAdmins();
  } catch {
    listEl.innerHTML = `<li class="admin-user-row admin-user-row--error">Не удалось загрузить список.</li>`;
    return;
  }
  listEl.innerHTML = "";
  admins.forEach((a) => {
    const li = document.createElement("li");
    li.className = "admin-user-row";
    const meta = document.createElement("div");
    meta.className = "admin-user-meta";
    meta.innerHTML = `<span class="admin-user-name">${escapeHtml(a.username)}</span><span class="admin-user-id">#${a.id}</span>`;
    li.append(meta);
    if (currentAdminId != null && a.id !== currentAdminId) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "admin-danger-btn";
      del.textContent = "Удалить";
      del.addEventListener("click", async () => {
        if (!window.confirm(`Удалить администратора «${a.username}»?`)) {
          return;
        }
        try {
          await deleteAdminUser(a.id);
          await refreshAdminsList();
        } catch {
          window.alert("Не удалось удалить. Возможно, это последний администратор.");
        }
      });
      li.append(del);
    }
    listEl.append(li);
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setupServicesSection(): void {
  const body = document.querySelector<HTMLTableSectionElement>("#admin-services-body");
  const form = document.querySelector<HTMLFormElement>("#admin-service-form");
  const input = document.querySelector<HTMLInputElement>("#admin-service-input");
  const saveBtn = document.querySelector<HTMLButtonElement>("#admin-service-save-btn");
  const editBtn = document.querySelector<HTMLButtonElement>("#admin-service-edit-btn");
  const resetBtn = document.querySelector<HTMLButtonElement>("#admin-service-reset-btn");
  const deleteBtn = document.querySelector<HTMLButtonElement>("#admin-service-delete-btn");
  const statusEl = document.querySelector<HTMLParagraphElement>("#admin-services-status");
  if (!body || !form || !input || !saveBtn || !editBtn || !resetBtn || !deleteBtn || !statusEl) {
    return;
  }

  if (!servicesSectionBound) {
    servicesSectionBound = true;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = input.value.trim();
      if (!name) {
        setServicesStatus(statusEl, "Введите название услуги.", true);
        return;
      }
      const duplicateIndex = activeServices.findIndex(
        (value, idx) => value.toLowerCase() === name.toLowerCase() && idx !== editingServiceIndex,
      );
      if (duplicateIndex >= 0) {
        setServicesStatus(statusEl, "Такая услуга уже есть в таблице.", true);
        return;
      }

      const nextServices = [...activeServices];
      if (editingServiceIndex == null) {
        nextServices.push(name);
      } else {
        nextServices[editingServiceIndex] = name;
      }

      saveBtn.disabled = true;
      editBtn.disabled = true;
      deleteBtn.disabled = true;
      setServicesStatus(statusEl, editingServiceIndex == null ? "Добавляем услугу..." : "Сохраняем изменения...");
      try {
        await persistServices(nextServices);
        selectedServiceIndex = null;
        editingServiceIndex = null;
        input.value = "";
        renderServicesTable(body, input, saveBtn, editBtn, deleteBtn);
        setServicesStatus(statusEl, "Изменения сохранены.");
      } catch (error) {
        console.error(error);
        setServicesStatus(statusEl, "Не удалось сохранить изменения списка услуг.", true);
      } finally {
        saveBtn.disabled = false;
        editBtn.disabled = selectedServiceIndex == null;
        deleteBtn.disabled = selectedServiceIndex == null;
      }
    });

    editBtn.addEventListener("click", () => {
      if (selectedServiceIndex == null) {
        setServicesStatus(statusEl, "Сначала выберите услугу в таблице.", true);
        return;
      }
      editingServiceIndex = selectedServiceIndex;
      input.value = activeServices[selectedServiceIndex] ?? "";
      input.focus();
      setServicesStatus(statusEl, "Режим редактирования включён.");
      renderServicesTable(body, input, saveBtn, editBtn, deleteBtn);
    });

    resetBtn.addEventListener("click", () => {
      selectedServiceIndex = null;
      editingServiceIndex = null;
      input.value = "";
      setServicesStatus(statusEl, "");
      renderServicesTable(body, input, saveBtn, editBtn, deleteBtn);
    });

    deleteBtn.addEventListener("click", async () => {
      if (selectedServiceIndex == null) {
        return;
      }
      const serviceName = activeServices[selectedServiceIndex] ?? "";
      if (!window.confirm(`Удалить услугу «${serviceName}»?`)) {
        return;
      }

      const nextServices = activeServices.filter((_, idx) => idx !== selectedServiceIndex);
      saveBtn.disabled = true;
      editBtn.disabled = true;
      deleteBtn.disabled = true;
      setServicesStatus(statusEl, "Удаляем услугу...");
      try {
        await persistServices(nextServices);
        selectedServiceIndex = null;
        editingServiceIndex = null;
        input.value = "";
        renderServicesTable(body, input, saveBtn, editBtn, deleteBtn);
        setServicesStatus(statusEl, "Услуга удалена.");
      } catch (error) {
        console.error(error);
        setServicesStatus(statusEl, "Не удалось удалить услугу.", true);
      } finally {
        saveBtn.disabled = false;
        editBtn.disabled = selectedServiceIndex == null;
        deleteBtn.disabled = selectedServiceIndex == null;
      }
    });
  }

  void refreshServicesSection(body, input, saveBtn, editBtn, deleteBtn, statusEl);
}

function setServicesStatus(el: HTMLParagraphElement, text: string, isError = false): void {
  el.textContent = text;
  if (!text) {
    el.dataset.variant = "";
  } else {
    el.dataset.variant = isError ? "error" : "ok";
  }
}

async function refreshServicesSection(
  body: HTMLTableSectionElement,
  input: HTMLInputElement,
  saveBtn: HTMLButtonElement,
  editBtn: HTMLButtonElement,
  deleteBtn: HTMLButtonElement,
  statusEl: HTMLParagraphElement,
): Promise<void> {
  try {
    const configs = await listAdminConfigs();
    if (configs.length > 0) {
      activeConfigIds = configs.map((row) => row.id);
      activeConfigId = activeConfigIds[0] ?? null;
      activeServices = collectServicesFromConfigs(configs);
    } else {
      activeConfigIds = [];
      activeConfigId = null;
      activeServices = [];
    }
    selectedServiceIndex = null;
    editingServiceIndex = null;
    input.value = "";
    renderServicesTable(body, input, saveBtn, editBtn, deleteBtn);
    if (activeServices.length === 0) {
      setServicesStatus(statusEl, "Список услуг пуст. Добавьте первую запись.");
    } else {
      setServicesStatus(statusEl, "");
    }
  } catch (error) {
    console.error(error);
    setServicesStatus(statusEl, "Не удалось загрузить таблицу услуг.", true);
  }
}

function renderServicesTable(
  body: HTMLTableSectionElement,
  input: HTMLInputElement,
  saveBtn: HTMLButtonElement,
  editBtn: HTMLButtonElement,
  deleteBtn: HTMLButtonElement,
): void {
  body.innerHTML = "";
  if (activeServices.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.className = "admin-services-empty";
    td.textContent = "Нет услуг. Добавьте первую запись через панель справа.";
    tr.append(td);
    body.append(tr);
  } else {
    activeServices.forEach((serviceName, index) => {
      const tr = document.createElement("tr");
      tr.className = "admin-service-row";
      if (selectedServiceIndex === index) {
        tr.classList.add("is-selected");
      }

      tr.addEventListener("click", () => {
        selectedServiceIndex = index;
        editingServiceIndex = null;
        renderServicesTable(body, input, saveBtn, editBtn, deleteBtn);
      });

      const indexCell = document.createElement("td");
      indexCell.textContent = String(index + 1);
      const nameCell = document.createElement("td");
      nameCell.textContent = serviceName;
      tr.append(indexCell, nameCell);
      body.append(tr);
    });
  }

  if (editingServiceIndex == null) {
    saveBtn.textContent = "Добавить";
  } else {
    saveBtn.textContent = "Сохранить";
  }

  if (selectedServiceIndex == null) {
    editBtn.disabled = true;
    deleteBtn.disabled = true;
  } else {
    editBtn.disabled = false;
    deleteBtn.disabled = false;
  }
}

async function persistServices(nextServices: string[]): Promise<void> {
  if (activeConfigId == null) {
    if (nextServices.length === 0) {
      activeConfigIds = [];
      activeServices = [];
      return;
    }
    const created = await createAdminConfig({
      services: nextServices,
      budget_range: {},
      extra_ui: {},
    });
    activeConfigId = created.id;
    activeConfigIds = [created.id];
    activeServices = normalizeToStringArray(created.services);
    return;
  }

  if (nextServices.length === 0) {
    const idsToDelete = activeConfigIds.length > 0 ? [...activeConfigIds] : [activeConfigId];
    for (const configId of idsToDelete) {
      await deleteAdminConfig(configId);
    }
    activeConfigId = null;
    activeConfigIds = [];
    activeServices = [];
    return;
  }

  const updated = await updateAdminConfig(activeConfigId, { services: nextServices });
  const staleIds = activeConfigIds.filter((id) => id !== activeConfigId);
  for (const staleId of staleIds) {
    await deleteAdminConfig(staleId);
  }
  activeConfigIds = [activeConfigId];
  activeServices = normalizeToStringArray(updated.services);
}

function collectServicesFromConfigs(configs: Array<{ services: unknown }>): string[] {
  const merged: string[] = [];
  const seen = new Set<string>();
  configs.forEach((row) => {
    normalizeToStringArray(row.services).forEach((item) => {
      const key = item.trim().toLowerCase();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      merged.push(item.trim());
    });
  });
  return merged;
}

type LeadTemperature = "hot" | "warm" | "cold";

type LeadAnalysis = {
  score: number;
  temperature: LeadTemperature;
  isUrgent: boolean;
  spendTime: boolean;
  personalManager: boolean;
  targetDepartment: string;
  recommendation: string;
  reasoning: string[];
};

type LeadWithAnalysis = {
  lead: LeadResponse;
  analysis: LeadAnalysis;
};

function setupLeadsSection(): void {
  const body = document.querySelector<HTMLTableSectionElement>("#admin-leads-body");
  const refreshBtn = document.querySelector<HTMLButtonElement>("#admin-refresh-leads-btn");
  const statusEl = document.querySelector<HTMLParagraphElement>("#admin-leads-status");
  if (!body || !refreshBtn || !statusEl) {
    return;
  }

  if (!leadsSectionBound) {
    leadsSectionBound = true;
    refreshBtn.addEventListener("click", () => {
      void refreshLeadsSection();
    });
    setupLeadDetailsModal();
  }

  void refreshLeadsSection();
}

function setupLeadDetailsModal(): void {
  if (leadDetailsModalBound) {
    return;
  }
  leadDetailsModalBound = true;
  const modal = document.querySelector<HTMLElement>("#admin-lead-details-modal");
  const closeBtn = document.querySelector<HTMLButtonElement>("#admin-lead-details-close-btn");
  const backdrop = document.querySelector<HTMLElement>("#admin-lead-details-close-backdrop");
  const contactBtn = document.querySelector<HTMLButtonElement>("#admin-lead-contact-btn");
  if (!modal || !closeBtn || !backdrop || !contactBtn) {
    return;
  }

  const closeModal = (): void => {
    modal.hidden = true;
    leadDetailsOpenId = null;
  };

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  contactBtn.addEventListener("click", async () => {
    if (leadDetailsOpenId == null) {
      return;
    }
    const row = analyzedLeads.find((item) => item.lead.id === leadDetailsOpenId);
    if (!row) {
      return;
    }
    const text = buildLeadContactText(row);
    try {
      await navigator.clipboard.writeText(text);
      window.alert("Контактные данные и рекомендации скопированы в буфер.");
    } catch {
      window.alert(text);
    }
  });
}

async function refreshLeadsSection(): Promise<void> {
  const body = document.querySelector<HTMLTableSectionElement>("#admin-leads-body");
  const statusEl = document.querySelector<HTMLParagraphElement>("#admin-leads-status");
  const refreshBtn = document.querySelector<HTMLButtonElement>("#admin-refresh-leads-btn");
  if (!body || !statusEl || !refreshBtn) {
    return;
  }

  statusEl.textContent = "Загружаем заявки и рассчитываем приоритет...";
  statusEl.dataset.variant = "";
  refreshBtn.disabled = true;
  try {
    const leads = await fetchAllLeads(1000);
    const filtered = leads.filter((lead) => !isTelemetryLead(lead));
    analyzedLeads = filtered
      .map((lead) => ({ lead, analysis: analyzeLead(lead) }))
      .sort((a, b) => b.analysis.score - a.analysis.score || b.lead.id - a.lead.id);
    renderLeadSummary(analyzedLeads);
    renderLeadsTable(body, analyzedLeads);
    statusEl.textContent = `Заявок: ${analyzedLeads.length}. Отсортировано по срочности и температуре.`;
    statusEl.dataset.variant = "ok";
  } catch (error) {
    console.error(error);
    analyzedLeads = [];
    renderLeadSummary([]);
    renderLeadsTable(body, []);
    statusEl.textContent = "Не удалось загрузить заявки.";
    statusEl.dataset.variant = "error";
  } finally {
    refreshBtn.disabled = false;
  }
}

async function fetchAllLeads(limit: number): Promise<LeadResponse[]> {
  const pageSize = 100;
  const all: LeadResponse[] = [];
  for (let skip = 0; skip < limit; skip += pageSize) {
    const page = await listLeads(skip, Math.min(pageSize, limit - skip));
    if (page.length === 0) {
      break;
    }
    all.push(...page);
    if (page.length < pageSize) {
      break;
    }
  }
  return all;
}

function isTelemetryLead(lead: LeadResponse): boolean {
  const firstName = lead.first_name.trim().toLowerCase();
  const lastName = lead.last_name.trim().toLowerCase();
  const niche = lead.business_niche.trim().toLowerCase();
  return lead.id === 0 || firstName === "system" || lastName === "telemetry" || niche === "telemetry";
}

function analyzeLead(lead: LeadResponse): LeadAnalysis {
  let score = 0;
  const reasoning: string[] = [];

  const deadlineScore = scoreByDeadline(lead.result_deadline);
  score += deadlineScore;
  reasoning.push(`Срок: +${deadlineScore}`);

  const needVolume = extractLevelValue(lead.need_volume);
  const needScore = needVolume == null ? 0 : Math.round((needVolume / 10) * 20);
  score += needScore;
  reasoning.push(`Потребность: +${needScore}`);

  const taskVolume = extractLevelValue(lead.task_volume);
  const taskScore = taskVolume == null ? 0 : Math.round((taskVolume / 10) * 10);
  score += taskScore;
  reasoning.push(`Объём: +${taskScore}`);

  const budgetValue = parseMoneyValue(lead.budget);
  const budgetScore = scoreByBudget(budgetValue);
  score += budgetScore;
  reasoning.push(`Бюджет: +${budgetScore}`);

  const companyScore = scoreByCompany(lead.company_size, lead.business_size);
  score += companyScore;
  reasoning.push(`Размер компании: +${companyScore}`);

  const roleScore = scoreByRole(lead.role);
  score += roleScore;
  reasoning.push(`Роль: +${roleScore}`);

  const nicheBoost = scoreByNiche(lead.business_niche);
  score += nicheBoost;
  reasoning.push(`Ниша: +${nicheBoost}`);

  score = clamp(score, 0, 100);
  const temperature: LeadTemperature = score >= 75 ? "hot" : score >= 50 ? "warm" : "cold";
  const isUrgent = deadlineScore >= 15 || (needVolume != null && needVolume >= 8);
  const spendTime = score >= 45;
  const personalManager = score >= 72 || (budgetValue != null && budgetValue >= 400000);
  const targetDepartment = chooseDepartment(lead, score);
  const recommendation = !spendTime
    ? "Лид холодный: оставьте в автоворонке и дайте базовое КП."
    : personalManager
      ? "Высокий приоритет: назначьте персонального менеджера и быстрый созвон."
      : "Хороший потенциал: обработайте стандартной очередью отдела продаж.";

  return {
    score,
    temperature,
    isUrgent,
    spendTime,
    personalManager,
    targetDepartment,
    recommendation,
    reasoning,
  };
}

function renderLeadSummary(rows: LeadWithAnalysis[]): void {
  const totalEl = document.querySelector<HTMLElement>("#lead-summary-total");
  const hotEl = document.querySelector<HTMLElement>("#lead-summary-hot");
  const warmEl = document.querySelector<HTMLElement>("#lead-summary-warm");
  const coldEl = document.querySelector<HTMLElement>("#lead-summary-cold");
  const scoreEl = document.querySelector<HTMLElement>("#lead-summary-score");
  if (!totalEl || !hotEl || !warmEl || !coldEl || !scoreEl) {
    return;
  }
  const total = rows.length;
  const hot = rows.filter((row) => row.analysis.temperature === "hot").length;
  const warm = rows.filter((row) => row.analysis.temperature === "warm").length;
  const cold = rows.filter((row) => row.analysis.temperature === "cold").length;
  const avgScore = total > 0 ? Math.round(rows.reduce((sum, row) => sum + row.analysis.score, 0) / total) : 0;
  totalEl.textContent = String(total);
  hotEl.textContent = String(hot);
  warmEl.textContent = String(warm);
  coldEl.textContent = String(cold);
  scoreEl.textContent = `${avgScore} / 100`;
}

function renderLeadsTable(body: HTMLTableSectionElement, rows: LeadWithAnalysis[]): void {
  body.innerHTML = "";
  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 8;
    td.className = "admin-services-empty";
    td.textContent = "Нет заявок для отображения.";
    tr.append(td);
    body.append(tr);
    return;
  }

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.className = "admin-lead-row";
    tr.dataset.temperature = row.analysis.temperature;

    const priority = row.analysis.isUrgent ? "Срочно" : index < 5 ? "Высокий" : "Планово";
    const fullName = `${row.lead.last_name} ${row.lead.first_name}`.trim();
    const temperatureText =
      row.analysis.temperature === "hot"
        ? `Горячий (${row.analysis.score})`
        : row.analysis.temperature === "warm"
          ? `Тёплый (${row.analysis.score})`
          : `Холодный (${row.analysis.score})`;

    tr.innerHTML = `
      <td>${escapeHtml(priority)}</td>
      <td>
        <strong>${escapeHtml(fullName)}</strong>
        <div class="admin-lead-meta">${escapeHtml(row.lead.business_niche || "—")} · #${row.lead.id}</div>
      </td>
      <td>${escapeHtml(temperatureText)}</td>
      <td>${escapeHtml(row.lead.result_deadline || "—")}</td>
      <td>${escapeHtml(row.lead.budget || "—")}</td>
      <td>${escapeHtml(row.analysis.targetDepartment)}</td>
      <td>${escapeHtml(shortRecommendation(row.analysis.recommendation))}</td>
      <td><button type="button" class="admin-gold-button admin-lead-open-btn">Открыть</button></td>
    `;

    const openBtn = tr.querySelector<HTMLButtonElement>(".admin-lead-open-btn");
    openBtn?.addEventListener("click", () => {
      showLeadDetails(row);
    });
    body.append(tr);
  });
}

function showLeadDetails(row: LeadWithAnalysis): void {
  const modal = document.querySelector<HTMLElement>("#admin-lead-details-modal");
  const subtitle = document.querySelector<HTMLElement>("#admin-lead-details-subtitle");
  const grid = document.querySelector<HTMLElement>("#admin-lead-details-grid");
  const recommend = document.querySelector<HTMLElement>("#admin-lead-details-recommend");
  if (!modal || !subtitle || !grid || !recommend) {
    return;
  }
  leadDetailsOpenId = row.lead.id;
  subtitle.textContent = `${row.lead.last_name} ${row.lead.first_name} · #${row.lead.id}`;

  const fields: Array<[string, string | null | undefined]> = [
    ["Ниша", row.lead.business_niche],
    ["Размер компании", row.lead.company_size],
    ["Масштаб бизнеса", row.lead.business_size],
    ["Роль", row.lead.role],
    ["Объём задачи", row.lead.task_volume],
    ["Потребность", row.lead.need_volume],
    ["Срок", row.lead.result_deadline],
    ["Тип задачи", row.lead.task_type],
    ["Продукт", row.lead.interested_product],
    ["Бюджет", row.lead.budget],
    ["Способ связи", row.lead.preferred_contact_method],
    ["Удобное время", row.lead.convenient_time],
    ["Комментарий", row.lead.comments],
  ];

  grid.innerHTML = fields
    .map(
      ([label, value]) => `
      <article class="admin-lead-field">
        <h4>${escapeHtml(label)}</h4>
        <p>${escapeHtml((value ?? "—").toString())}</p>
      </article>
    `,
    )
    .join("");

  recommend.innerHTML = `
    <article class="admin-stat-card">
      <h3>Результат анализа</h3>
      <p><strong>Температура:</strong> ${escapeHtml(temperatureRu(row.analysis.temperature))} (${row.analysis.score}/100)</p>
      <p><strong>Приоритет:</strong> ${row.analysis.isUrgent ? "Срочно" : "Стандартно"}</p>
      <p><strong>Тратить время:</strong> ${row.analysis.spendTime ? "Да" : "Ограниченно"}</p>
      <p><strong>Персональный менеджер:</strong> ${row.analysis.personalManager ? "Нужен" : "Не обязателен"}</p>
      <p><strong>Рекомендуемый отдел:</strong> ${escapeHtml(row.analysis.targetDepartment)}</p>
      <p><strong>Рекомендация:</strong> ${escapeHtml(row.analysis.recommendation)}</p>
      <p><strong>Факторы:</strong> ${escapeHtml(row.analysis.reasoning.join(", "))}</p>
    </article>
  `;

  modal.hidden = false;
}

function buildLeadContactText(row: LeadWithAnalysis): string {
  return [
    `Лид #${row.lead.id}: ${row.lead.last_name} ${row.lead.first_name}`.trim(),
    `Температура: ${temperatureRu(row.analysis.temperature)} (${row.analysis.score}/100)`,
    `Отдел: ${row.analysis.targetDepartment}`,
    `Способ связи: ${row.lead.preferred_contact_method || "—"}`,
    `Удобное время: ${row.lead.convenient_time || "—"}`,
    `Комментарий: ${row.lead.comments || "—"}`,
    `Рекомендация: ${row.analysis.recommendation}`,
  ].join("\n");
}

function shortRecommendation(value: string): string {
  return value.length > 54 ? `${value.slice(0, 54)}...` : value;
}

function temperatureRu(value: LeadTemperature): string {
  if (value === "hot") {
    return "Горячий";
  }
  if (value === "warm") {
    return "Тёплый";
  }
  return "Холодный";
}

function scoreByDeadline(raw: string): number {
  const value = raw.trim().toLowerCase();
  if (!value) {
    return 0;
  }
  if (value.includes("сегодня") || value.includes("срочно") || value.includes("как можно")) {
    return 25;
  }
  const days = extractNumber(value);
  if (days == null) {
    return 6;
  }
  if (days <= 7) {
    return 22;
  }
  if (days <= 14) {
    return 16;
  }
  if (days <= 30) {
    return 10;
  }
  return 5;
}

function scoreByBudget(budget: number | null): number {
  if (budget == null) {
    return 3;
  }
  if (budget >= 1_000_000) {
    return 20;
  }
  if (budget >= 500_000) {
    return 16;
  }
  if (budget >= 250_000) {
    return 12;
  }
  if (budget >= 100_000) {
    return 8;
  }
  return 3;
}

function scoreByCompany(companySizeRaw: string, businessSizeRaw: string): number {
  const value = `${companySizeRaw} ${businessSizeRaw}`.toLowerCase();
  if (value.includes("500") || value.includes("крупн")) {
    return 12;
  }
  if (value.includes("201") || value.includes("сред")) {
    return 10;
  }
  if (value.includes("51") || value.includes("101")) {
    return 8;
  }
  if (value.includes("11") || value.includes("мал")) {
    return 6;
  }
  return 4;
}

function scoreByRole(roleRaw: string): number {
  const role = roleRaw.toLowerCase();
  if (
    role.includes("ceo") ||
    role.includes("основатель") ||
    role.includes("owner") ||
    role.includes("директор")
  ) {
    return 10;
  }
  if (role.includes("руковод")) {
    return 8;
  }
  if (role.includes("аналитик") || role.includes("менеджер")) {
    return 6;
  }
  return 4;
}

function scoreByNiche(nicheRaw: string): number {
  const niche = nicheRaw.toLowerCase();
  if (niche.includes("it") || niche.includes("fin") || niche.includes("ecom")) {
    return 8;
  }
  if (niche.includes("логист") || niche.includes("retail") || niche.includes("b2b")) {
    return 6;
  }
  return 4;
}

function chooseDepartment(lead: LeadResponse, score: number): string {
  const taskType = lead.task_type.toLowerCase();
  const product = lead.interested_product.toLowerCase();
  if (score >= 80) {
    return "Enterprise-продажи";
  }
  if (taskType.includes("сопровождение") || taskType.includes("развитие")) {
    return "Отдел сопровождения";
  }
  if (
    taskType.includes("внедрение") ||
    taskType.includes("интеграц") ||
    product.includes("crm") ||
    product.includes("автомат")
  ) {
    return "Технический отдел";
  }
  return "Отдел первичных консультаций";
}

function extractLevelValue(raw: string): number | null {
  const match = raw.match(/(\d+)\s*из\s*10/i);
  if (match) {
    const value = Number.parseInt(match[1], 10);
    return Number.isFinite(value) ? clamp(value, 0, 10) : null;
  }
  return null;
}

function parseMoneyValue(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  const value = Number.parseInt(digits, 10);
  return Number.isFinite(value) ? value : null;
}

function extractNumber(raw: string): number | null {
  const match = raw.match(/(\d+)/);
  if (!match) {
    return null;
  }
  const value = Number.parseInt(match[1], 10);
  return Number.isFinite(value) ? value : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function setupStatsModal(
  openBtn: HTMLButtonElement,
  modal: HTMLElement,
  closeBtn: HTMLButtonElement,
  backdrop: HTMLElement,
): void {
  const closeModal = (): void => {
    modal.hidden = true;
  };

  const openModal = (): void => {
    modal.hidden = false;
    void loadAndRenderStats();
  };

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

async function loadAndRenderStats(): Promise<void> {
  const dayMaxEl = document.querySelector<HTMLElement>("#stats-day-max");
  const dayAvgEl = document.querySelector<HTMLElement>("#stats-day-avg");
  const weekMaxEl = document.querySelector<HTMLElement>("#stats-week-max");
  const weekAvgEl = document.querySelector<HTMLElement>("#stats-week-avg");
  const monthMaxEl = document.querySelector<HTMLElement>("#stats-month-max");
  const monthAvgEl = document.querySelector<HTMLElement>("#stats-month-avg");
  const pointsInfoEl = document.querySelector<HTMLElement>("#stats-points-info");
  const samplesInfoEl = document.querySelector<HTMLElement>("#stats-samples-info");
  const heatmapCanvas = document.querySelector<HTMLCanvasElement>("#admin-heatmap-canvas");
  if (
    !dayMaxEl ||
    !dayAvgEl ||
    !weekMaxEl ||
    !weekAvgEl ||
    !monthMaxEl ||
    !monthAvgEl ||
    !pointsInfoEl ||
    !samplesInfoEl ||
    !heatmapCanvas
  ) {
    return;
  }

  try {
    const rows = await fetchBehaviorMetricsRows(1000);
    if (rows.length === 0) {
      dayMaxEl.textContent = "Макс: 0 сек";
      dayAvgEl.textContent = "Среднее: 0 сек";
      weekMaxEl.textContent = "Макс: 0 сек";
      weekAvgEl.textContent = "Среднее: 0 сек";
      monthMaxEl.textContent = "Макс: 0 сек";
      monthAvgEl.textContent = "Среднее: 0 сек";
      pointsInfoEl.textContent = "Точек: 0";
      samplesInfoEl.textContent = "Сэмплов: 0";
      drawHeatmap(heatmapCanvas, []);
      return;
    }

    const dayStats = calcWindowStats(rows, 86_400);
    const weekStats = calcWindowStats(rows, 604_800);
    const monthStats = calcWindowStats(rows, 2_592_000);

    dayMaxEl.textContent = `Макс: ${formatSeconds(dayStats.maxSeconds)}`;
    dayAvgEl.textContent = `Среднее: ${formatSeconds(dayStats.avgSeconds)}`;
    weekMaxEl.textContent = `Макс: ${formatSeconds(weekStats.maxSeconds)}`;
    weekAvgEl.textContent = `Среднее: ${formatSeconds(weekStats.avgSeconds)}`;
    monthMaxEl.textContent = `Макс: ${formatSeconds(monthStats.maxSeconds)}`;
    monthAvgEl.textContent = `Среднее: ${formatSeconds(monthStats.avgSeconds)}`;

    const points = extractCursorPoints(rows);
    pointsInfoEl.textContent = `Точек: ${points.length}`;
    samplesInfoEl.textContent = `Сэмплов: ${rows.length}`;
    drawHeatmap(heatmapCanvas, points);
  } catch {
    dayMaxEl.textContent = "Макс: ошибка";
    dayAvgEl.textContent = "Среднее: ошибка";
    weekMaxEl.textContent = "Макс: ошибка";
    weekAvgEl.textContent = "Среднее: ошибка";
    monthMaxEl.textContent = "Макс: ошибка";
    monthAvgEl.textContent = "Среднее: ошибка";
  }
}

async function fetchBehaviorMetricsRows(limit: number): Promise<BehaviorMetricsRecord[]> {
  const pageSize = 100;
  const all: BehaviorMetricsRecord[] = [];
  for (let skip = 0; skip < limit; skip += pageSize) {
    const page = await listBehaviorMetrics(skip, Math.min(pageSize, limit - skip));
    if (page.length === 0) {
      break;
    }
    all.push(...page);
    if (page.length < pageSize) {
      break;
    }
  }
  return all;
}

function calcWindowStats(
  rows: BehaviorMetricsRecord[],
  windowSeconds: number,
): { maxSeconds: number; avgSeconds: number } {
  const scoped = rows.slice(0, Math.min(windowSeconds, rows.length));
  if (scoped.length === 0) {
    return { maxSeconds: 0, avgSeconds: 0 };
  }
  let maxSeconds = 0;
  let sumSeconds = 0;
  scoped.forEach((row) => {
    const value = Number.isFinite(row.time_on_page_seconds) ? row.time_on_page_seconds : 0;
    maxSeconds = Math.max(maxSeconds, value);
    sumSeconds += value;
  });
  return {
    maxSeconds,
    avgSeconds: Math.round(sumSeconds / scoped.length),
  };
}

function formatSeconds(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds));
  if (secs < 60) {
    return `${secs} сек`;
  }
  const mins = Math.floor(secs / 60);
  const rest = secs % 60;
  return `${mins} мин ${rest} сек`;
}

function extractCursorPoints(rows: BehaviorMetricsRecord[]): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  rows.forEach((row) => {
    const raw = row.cursor_hover_zones;
    if (!raw) {
      return;
    }
    if (Array.isArray(raw)) {
      raw.forEach((item) => {
        if (!item || typeof item !== "object") {
          return;
        }
        const sample = item as Record<string, unknown>;
        const x = typeof sample.x === "number" ? sample.x : Number.parseInt(String(sample.x ?? ""), 10);
        const y = typeof sample.y === "number" ? sample.y : Number.parseInt(String(sample.y ?? ""), 10);
        if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0) {
          return;
        }
        points.push({ x, y });
      });
      return;
    }
    if (typeof raw === "string") {
      raw.split(";").forEach((sample) => {
        const [, coords] = sample.split(":");
        if (!coords) {
          return;
        }
        const [xRaw, yRaw] = coords.split(",");
        const x = Number.parseInt(xRaw, 10);
        const y = Number.parseInt(yRaw, 10);
        if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0) {
          return;
        }
        points.push({ x, y });
      });
    }
  });
  return points.slice(-12_000);
}

function drawHeatmap(canvas: HTMLCanvasElement, points: Array<{ x: number; y: number }>): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f7fbff";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#d4e0ee";
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

  if (points.length === 0) {
    ctx.fillStyle = "#6f849b";
    ctx.font = "16px Manrope, sans-serif";
    ctx.fillText("Нет данных координат для визуализации", 24, 34);
    return;
  }

  const maxX = Math.max(...points.map((p) => p.x), 1);
  const maxY = Math.max(...points.map((p) => p.y), 1);
  const pad = 20;
  const bins = new Map<string, { x: number; y: number; count: number }>();

  points.forEach((p) => {
    const bx = Math.round(p.x / 20);
    const by = Math.round(p.y / 20);
    const key = `${bx}:${by}`;
    const prev = bins.get(key);
    if (prev) {
      prev.count += 1;
    } else {
      bins.set(key, { x: bx * 20, y: by * 20, count: 1 });
    }
  });

  const hotspots = Array.from(bins.values());
  const maxCount = Math.max(...hotspots.map((s) => s.count), 1);
  hotspots.forEach((spot) => {
    const sx = pad + (spot.x / maxX) * (w - pad * 2);
    const sy = pad + (spot.y / maxY) * (h - pad * 2);
    const intensity = spot.count / maxCount;
    const radius = 6 + intensity * 28;
    const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, radius);
    grad.addColorStop(0, `rgba(238, 60, 92, ${0.65 * intensity + 0.15})`);
    grad.addColorStop(0.65, `rgba(255, 145, 60, ${0.35 * intensity + 0.1})`);
    grad.addColorStop(1, "rgba(255, 145, 60, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

