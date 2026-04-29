(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const re="autello_admin_jwt";function je(){return window.localStorage.getItem(re)}function G(e){e?window.localStorage.setItem(re,e):window.localStorage.removeItem(re)}function _(){const e=je(),t={"Content-Type":"application/json"};return e&&(t.Authorization=`Bearer ${e}`),t}async function ze(){const e=await fetch("/api/auth/registration-open");if(!e.ok)throw new Error("registration-open failed");return await e.json()}async function be(e,t){const n=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})});if(!n.ok){const s=(await n.json().catch(()=>({}))).detail,i=typeof s=="string"?s:"Не удалось войти";throw new Error(i)}return await n.json()}async function Xe(e,t){const n=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})});if(!n.ok){const s=(await n.json().catch(()=>({}))).detail,i=typeof s=="string"?s:"register failed";throw new Error(i)}return await n.json()}async function Fe(){const e=await fetch("/api/auth/me",{headers:_()});if(!e.ok)throw new Error("me failed");return await e.json()}async function Ge(){const e=await fetch("/api/admins",{headers:_()});if(!e.ok)throw new Error("list admins failed");return await e.json()}async function Ze(e,t){const n=await fetch("/api/admins",{method:"POST",headers:_(),body:JSON.stringify({username:e,password:t})});if(!n.ok)throw new Error("create admin failed");return await n.json()}async function Qe(e){if(!(await fetch(`/api/admins/${e}`,{method:"DELETE",headers:_()})).ok)throw new Error("delete admin failed")}function S(e){return(e??"").toString().trim()}function et(e){const t=S(e);return t.length>0?t:null}function tt(e){return{first_name:S(e.get("first_name")),last_name:S(e.get("last_name")),patronymic:et(e.get("patronymic")),business_info:S(e.get("business_info")),business_niche:S(e.get("business_niche")),company_size:S(e.get("company_size")),task_volume:S(e.get("task_volume")),role:S(e.get("role")),business_size:S(e.get("business_size")),need_volume:S(e.get("need_volume")),result_deadline:S(e.get("result_deadline")),task_type:S(e.get("task_type")),interested_product:S(e.get("interested_product")),budget:S(e.get("budget")),preferred_contact_method:S(e.get("preferred_contact_method")),convenient_time:S(e.get("convenient_time")),comments:S(e.get("comments"))}}async function nt(e){const t=await fetch("/api/leads",{method:"POST",headers:_(),body:JSON.stringify(e)});if(!t.ok)throw new Error(`Lead create failed: ${t.status}`);return await t.json()}async function at(e=0,t=100){const n=await fetch(`/api/leads?skip=${e}&limit=${t}`,{headers:_()});if(!n.ok)throw new Error(`list leads failed: ${n.status}`);return await n.json()}function st(e,t,n,a,s){return{application_id:e,time_on_page_seconds:Math.max(1,Math.floor((Date.now()-t)/1e3)),button_clicks:n.length>0?n:["submit_click"],cursor_hover_zones:a.size>0?Array.from(a):["form_root"],return_visits_count:s,technical_payload:{userAgent:navigator.userAgent,language:navigator.language,viewport:`${window.innerWidth}x${window.innerHeight}`,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,referrer:document.referrer||null}}}async function it(e){const t=await fetch("/api/behavior-metrics",{method:"POST",headers:_(),body:JSON.stringify(e)});if(!t.ok)throw new Error(`Behavior metrics create failed: ${t.status}`)}async function rt(e){const t=await fetch("/api/behavior-metrics",{method:"POST",headers:_(),body:JSON.stringify(e)});if(!t.ok)throw new Error(`Behavior stream create failed: ${t.status}`)}async function ot(e=0,t=100){const n=await fetch(`/api/behavior-metrics?skip=${e}&limit=${t}`,{headers:_()});if(!n.ok)throw new Error(`list behavior metrics failed: ${n.status}`);return await n.json()}function ee(e){return Array.isArray(e)?e.filter(t=>typeof t=="string"&&t.trim().length>0):e&&typeof e=="object"?Object.values(e).filter(t=>typeof t=="string"&&t.trim().length>0):[]}function ve(e){const t=e.replace(/\D/g,"");if(!t)return null;const n=Number.parseInt(t,10);return Number.isFinite(n)?n:null}const Se={min:15e4,max:5e6,step:5e4};function se(e){if(!e||typeof e!="object")return Se;const t=e,n=typeof t.from=="number"?t.from:typeof t.from=="string"?ve(t.from):null,a=typeof t.to=="number"?t.to:typeof t.to=="string"?ve(t.to):null;if(n!=null&&a!=null&&a>n){const s=a-n,i=Math.max(5e4,Math.round(s/40/5e4)*5e4);return{min:n,max:a,step:i}}return Se}async function we(){try{const e=await fetch("/api/admin-config?limit=1",{headers:_()});return e.ok?(await e.json())[0]??null:null}catch{return null}}async function dt(e=1e3){const t=await fetch(`/api/admin-config?limit=${e}`,{headers:_()});if(!t.ok)throw new Error(`list admin config failed: ${t.status}`);return await t.json()}async function ct(e){const t=await fetch("/api/admin-config",{method:"POST",headers:_(),body:JSON.stringify(e)});if(!t.ok)throw new Error(`create admin config failed: ${t.status}`);return await t.json()}async function lt(e,t){const n=await fetch(`/api/admin-config/${e}`,{method:"PUT",headers:_(),body:JSON.stringify(t)});if(!n.ok)throw new Error(`update admin config failed: ${n.status}`);return await n.json()}async function xe(e){const t=await fetch(`/api/admin-config/${e}`,{method:"DELETE",headers:_()});if(!t.ok)throw new Error(`delete admin config failed: ${t.status}`)}function Ee(){return["Комплексная AI-автоматизация отдела продаж","Запуск персонального AI-консультанта","Аудит воронки и скриптов продаж","Внедрение CRM + аналитика под ключ"]}function ut(){return`
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
  `}let H=null,_e=!1,I=null,M=[],x=[],b=null,L=null,ke=!1,Ce=!1,F=[],V=null;async function mt(){const e=document.querySelector("#admin-auth-view"),t=document.querySelector("#admin-dashboard-view"),n=document.querySelector("#admin-auth-status"),a=document.querySelector("#admin-login-form"),s=document.querySelector("#admin-register-toggle"),i=document.querySelector("#admin-register-hint"),r=document.querySelector("#admin-register-panel"),o=document.querySelector("#admin-register-form"),u=document.querySelector("#admin-register-cancel"),c=document.querySelector("#admin-current-username"),f=document.querySelector("#admin-open-stats-btn"),d=document.querySelector("#admin-logout-btn"),p=document.querySelector("#admin-stats-modal"),h=document.querySelector("#admin-stats-close-btn"),v=document.querySelector("#admin-stats-close-backdrop");if(!e||!t||!n||!a||!s||!i||!r||!o||!u||!c||!f||!d||!p||!h||!v)throw new Error("Admin shell elements not found");Nt(f,p,h,v);let g=!1;try{g=(await ze()).registration_open}catch{$(n,"Не удалось проверить доступность регистрации.",!0)}if(s.hidden=!g,i.hidden=!g,s.addEventListener("click",()=>{r.hidden=!1,s.hidden=!0,i.hidden=!0}),u.addEventListener("click",()=>{r.hidden=!0,o.reset(),g&&(s.hidden=!1,i.hidden=!1)}),a.addEventListener("submit",async q=>{if(q.preventDefault(),!a.reportValidity()){$(n,"Проверьте логин и пароль.",!0);return}const N=new FormData(a),C=String(N.get("username")??"").trim(),D=String(N.get("password")??"");$(n,"Входим…");try{const A=await be(C,D);G(A.access_token),await qe(t,e,c),$(n,"")}catch(A){console.error(A),$(n,A instanceof Error?A.message:"Ошибка входа",!0)}}),o.addEventListener("submit",async q=>{if(q.preventDefault(),!o.reportValidity()){$(n,"Заполните все поля корректно.",!0);return}const N=new FormData(o),C=String(N.get("username")??"").trim(),D=String(N.get("password")??""),A=String(N.get("password2")??"");if(D!==A){$(n,"Пароли не совпадают.",!0);return}$(n,"Создаём учётную запись…");try{await Xe(C,D);const z=await be(C,D);G(z.access_token),g=!1,r.hidden=!0,s.hidden=!0,i.hidden=!0,await qe(t,e,c),$(n,"")}catch(z){console.error(z),$(n,z instanceof Error?z.message:"Ошибка регистрации",!0)}}),d.addEventListener("click",()=>{G(null),H=null,I=null,M=[],x=[],b=null,L=null,F=[],V=null,t.hidden=!0,e.hidden=!1,a.reset(),o.reset(),r.hidden=!0,$(n,""),pt(s,i,r,o)}),je())try{const q=await Fe();H=q.id,c.textContent=q.username,e.hidden=!0,t.hidden=!1,Pe(),Re(),Ve()}catch{G(null),e.hidden=!1,t.hidden=!0}}async function pt(e,t,n,a){try{const i=(await ze()).registration_open;e.hidden=!i||!n.hidden,t.hidden=!i||!n.hidden,i||(n.hidden=!0,a.reset())}catch{}}async function qe(e,t,n){const a=await Fe();H=a.id,n.textContent=a.username,t.hidden=!0,e.hidden=!1,Pe(),Re(),Ve()}function $(e,t,n=!1){e.textContent=t,e.dataset.variant=n?"error":t?"ok":""}let Le=!1;function Pe(){if(Le){Q();return}Le=!0;const e=document.querySelector("#admin-new-user-form"),t=document.querySelector("#admin-admins-status");!e||!t||(e.addEventListener("submit",async n=>{if(n.preventDefault(),!e.reportValidity()){t.textContent="Проверьте логин и пароль.",t.dataset.variant="error";return}const a=new FormData(e),s=String(a.get("username")??"").trim(),i=String(a.get("password")??"");t.textContent="Создаём…",t.dataset.variant="";try{await Ze(s,i),e.reset(),t.textContent="Администратор добавлен.",t.dataset.variant="ok",await Q()}catch(r){console.error(r),t.textContent="Не удалось создать администратора.",t.dataset.variant="error"}}),Q())}async function Q(){const e=document.querySelector("#admin-user-list");if(!e)return;let t=[];try{t=await Ge()}catch{e.innerHTML='<li class="admin-user-row admin-user-row--error">Не удалось загрузить список.</li>';return}e.innerHTML="",t.forEach(n=>{const a=document.createElement("li");a.className="admin-user-row";const s=document.createElement("div");if(s.className="admin-user-meta",s.innerHTML=`<span class="admin-user-name">${w(n.username)}</span><span class="admin-user-id">#${n.id}</span>`,a.append(s),H!=null&&n.id!==H){const i=document.createElement("button");i.type="button",i.className="admin-danger-btn",i.textContent="Удалить",i.addEventListener("click",async()=>{if(window.confirm(`Удалить администратора «${n.username}»?`))try{await Qe(n.id),await Q()}catch{window.alert("Не удалось удалить. Возможно, это последний администратор.")}}),a.append(i)}e.append(a)})}function w(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Re(){const e=document.querySelector("#admin-services-body"),t=document.querySelector("#admin-service-form"),n=document.querySelector("#admin-service-input"),a=document.querySelector("#admin-service-save-btn"),s=document.querySelector("#admin-service-edit-btn"),i=document.querySelector("#admin-service-reset-btn"),r=document.querySelector("#admin-service-delete-btn"),o=document.querySelector("#admin-services-status");!e||!t||!n||!a||!s||!i||!r||!o||(_e||(_e=!0,t.addEventListener("submit",async u=>{u.preventDefault();const c=n.value.trim();if(!c){E(o,"Введите название услуги.",!0);return}if(x.findIndex((p,h)=>p.toLowerCase()===c.toLowerCase()&&h!==L)>=0){E(o,"Такая услуга уже есть в таблице.",!0);return}const d=[...x];L==null?d.push(c):d[L]=c,a.disabled=!0,s.disabled=!0,r.disabled=!0,E(o,L==null?"Добавляем услугу...":"Сохраняем изменения...");try{await $e(d),b=null,L=null,n.value="",R(e,n,a,s,r),E(o,"Изменения сохранены.")}catch(p){console.error(p),E(o,"Не удалось сохранить изменения списка услуг.",!0)}finally{a.disabled=!1,s.disabled=b==null,r.disabled=b==null}}),s.addEventListener("click",()=>{if(b==null){E(o,"Сначала выберите услугу в таблице.",!0);return}L=b,n.value=x[b]??"",n.focus(),E(o,"Режим редактирования включён."),R(e,n,a,s,r)}),i.addEventListener("click",()=>{b=null,L=null,n.value="",E(o,""),R(e,n,a,s,r)}),r.addEventListener("click",async()=>{if(b==null)return;const u=x[b]??"";if(!window.confirm(`Удалить услугу «${u}»?`))return;const c=x.filter((f,d)=>d!==b);a.disabled=!0,s.disabled=!0,r.disabled=!0,E(o,"Удаляем услугу...");try{await $e(c),b=null,L=null,n.value="",R(e,n,a,s,r),E(o,"Услуга удалена.")}catch(f){console.error(f),E(o,"Не удалось удалить услугу.",!0)}finally{a.disabled=!1,s.disabled=b==null,r.disabled=b==null}})),ft(e,n,a,s,r,o))}function E(e,t,n=!1){e.textContent=t,t?e.dataset.variant=n?"error":"ok":e.dataset.variant=""}async function ft(e,t,n,a,s,i){try{const r=await dt();r.length>0?(M=r.map(o=>o.id),I=M[0]??null,x=ht(r)):(M=[],I=null,x=[]),b=null,L=null,t.value="",R(e,t,n,a,s),x.length===0?E(i,"Список услуг пуст. Добавьте первую запись."):E(i,"")}catch(r){console.error(r),E(i,"Не удалось загрузить таблицу услуг.",!0)}}function R(e,t,n,a,s){if(e.innerHTML="",x.length===0){const i=document.createElement("tr"),r=document.createElement("td");r.colSpan=2,r.className="admin-services-empty",r.textContent="Нет услуг. Добавьте первую запись через панель справа.",i.append(r),e.append(i)}else x.forEach((i,r)=>{const o=document.createElement("tr");o.className="admin-service-row",b===r&&o.classList.add("is-selected"),o.addEventListener("click",()=>{b=r,L=null,R(e,t,n,a,s)});const u=document.createElement("td");u.textContent=String(r+1);const c=document.createElement("td");c.textContent=i,o.append(u,c),e.append(o)});L==null?n.textContent="Добавить":n.textContent="Сохранить",b==null?(a.disabled=!0,s.disabled=!0):(a.disabled=!1,s.disabled=!1)}async function $e(e){if(I==null){if(e.length===0){M=[],x=[];return}const a=await ct({services:e,budget_range:{},extra_ui:{}});I=a.id,M=[a.id],x=ee(a.services);return}if(e.length===0){const a=M.length>0?[...M]:[I];for(const s of a)await xe(s);I=null,M=[],x=[];return}const t=await lt(I,{services:e}),n=M.filter(a=>a!==I);for(const a of n)await xe(a);M=[I],x=ee(t.services)}function ht(e){const t=[],n=new Set;return e.forEach(a=>{ee(a.services).forEach(s=>{const i=s.trim().toLowerCase();!i||n.has(i)||(n.add(i),t.push(s.trim()))})}),t}function Ve(){const e=document.querySelector("#admin-leads-body"),t=document.querySelector("#admin-refresh-leads-btn"),n=document.querySelector("#admin-leads-status");!e||!t||!n||(ke||(ke=!0,t.addEventListener("click",()=>{Me()}),yt()),Me())}function yt(){if(Ce)return;Ce=!0;const e=document.querySelector("#admin-lead-details-modal"),t=document.querySelector("#admin-lead-details-close-btn"),n=document.querySelector("#admin-lead-details-close-backdrop"),a=document.querySelector("#admin-lead-contact-btn");if(!e||!t||!n||!a)return;const s=()=>{e.hidden=!0,V=null};t.addEventListener("click",s),n.addEventListener("click",s),document.addEventListener("keydown",i=>{i.key==="Escape"&&!e.hidden&&s()}),a.addEventListener("click",async()=>{if(V==null)return;const i=F.find(o=>o.lead.id===V);if(!i)return;const r=wt(i);try{await navigator.clipboard.writeText(r),window.alert("Контактные данные и рекомендации скопированы в буфер.")}catch{window.alert(r)}})}async function Me(){const e=document.querySelector("#admin-leads-body"),t=document.querySelector("#admin-leads-status"),n=document.querySelector("#admin-refresh-leads-btn");if(!(!e||!t||!n)){t.textContent="Загружаем заявки и рассчитываем приоритет...",t.dataset.variant="",n.disabled=!0;try{F=(await gt(1e3)).filter(i=>!bt(i)).map(i=>({lead:i,analysis:vt(i)})).sort((i,r)=>r.analysis.score-i.analysis.score||r.lead.id-i.lead.id),Ne(F),Ae(e,F),t.textContent=`Заявок: ${F.length}. Отсортировано по срочности и температуре.`,t.dataset.variant="ok"}catch(a){console.error(a),F=[],Ne([]),Ae(e,[]),t.textContent="Не удалось загрузить заявки.",t.dataset.variant="error"}finally{n.disabled=!1}}}async function gt(e){const n=[];for(let a=0;a<e;a+=100){const s=await at(a,Math.min(100,e-a));if(s.length===0||(n.push(...s),s.length<100))break}return n}function bt(e){const t=e.first_name.trim().toLowerCase(),n=e.last_name.trim().toLowerCase(),a=e.business_niche.trim().toLowerCase();return e.id===0||t==="system"||n==="telemetry"||a==="telemetry"}function vt(e){let t=0;const n=[],a=Et(e.result_deadline);t+=a,n.push(`Срок: +${a}`);const s=Te(e.need_volume),i=s==null?0:Math.round(s/10*20);t+=i,n.push(`Потребность: +${i}`);const r=Te(e.task_volume),o=r==null?0:Math.round(r/10*10);t+=o,n.push(`Объём: +${o}`);const u=$t(e.budget),c=_t(u);t+=c,n.push(`Бюджет: +${c}`);const f=kt(e.company_size,e.business_size);t+=f,n.push(`Размер компании: +${f}`);const d=Ct(e.role);t+=d,n.push(`Роль: +${d}`);const p=qt(e.business_niche);t+=p,n.push(`Ниша: +${p}`),t=Je(t,0,100);const h=t>=75?"hot":t>=50?"warm":"cold",v=a>=15||s!=null&&s>=8,g=t>=45,k=t>=72||u!=null&&u>=4e5,q=Lt(e,t);return{score:t,temperature:h,isUrgent:v,spendTime:g,personalManager:k,targetDepartment:q,recommendation:g?k?"Высокий приоритет: назначьте персонального менеджера и быстрый созвон.":"Хороший потенциал: обработайте стандартной очередью отдела продаж.":"Лид холодный: оставьте в автоворонке и дайте базовое КП.",reasoning:n}}function Ne(e){const t=document.querySelector("#lead-summary-total"),n=document.querySelector("#lead-summary-hot"),a=document.querySelector("#lead-summary-warm"),s=document.querySelector("#lead-summary-cold"),i=document.querySelector("#lead-summary-score");if(!t||!n||!a||!s||!i)return;const r=e.length,o=e.filter(d=>d.analysis.temperature==="hot").length,u=e.filter(d=>d.analysis.temperature==="warm").length,c=e.filter(d=>d.analysis.temperature==="cold").length,f=r>0?Math.round(e.reduce((d,p)=>d+p.analysis.score,0)/r):0;t.textContent=String(r),n.textContent=String(o),a.textContent=String(u),s.textContent=String(c),i.textContent=`${f} / 100`}function Ae(e,t){if(e.innerHTML="",t.length===0){const n=document.createElement("tr"),a=document.createElement("td");a.colSpan=8,a.className="admin-services-empty",a.textContent="Нет заявок для отображения.",n.append(a),e.append(n);return}t.forEach((n,a)=>{const s=document.createElement("tr");s.className="admin-lead-row",s.dataset.temperature=n.analysis.temperature;const i=n.analysis.isUrgent?"Срочно":a<5?"Высокий":"Планово",r=`${n.lead.last_name} ${n.lead.first_name}`.trim(),o=n.analysis.temperature==="hot"?`Горячий (${n.analysis.score})`:n.analysis.temperature==="warm"?`Тёплый (${n.analysis.score})`:`Холодный (${n.analysis.score})`;s.innerHTML=`
      <td>${w(i)}</td>
      <td>
        <strong>${w(r)}</strong>
        <div class="admin-lead-meta">${w(n.lead.business_niche||"—")} · #${n.lead.id}</div>
      </td>
      <td>${w(o)}</td>
      <td>${w(n.lead.result_deadline||"—")}</td>
      <td>${w(n.lead.budget||"—")}</td>
      <td>${w(n.analysis.targetDepartment)}</td>
      <td>${w(xt(n.analysis.recommendation))}</td>
      <td><button type="button" class="admin-gold-button admin-lead-open-btn">Открыть</button></td>
    `;const u=s.querySelector(".admin-lead-open-btn");u==null||u.addEventListener("click",()=>{St(n)}),e.append(s)})}function St(e){const t=document.querySelector("#admin-lead-details-modal"),n=document.querySelector("#admin-lead-details-subtitle"),a=document.querySelector("#admin-lead-details-grid"),s=document.querySelector("#admin-lead-details-recommend");if(!t||!n||!a||!s)return;V=e.lead.id,n.textContent=`${e.lead.last_name} ${e.lead.first_name} · #${e.lead.id}`;const i=[["Ниша",e.lead.business_niche],["Размер компании",e.lead.company_size],["Масштаб бизнеса",e.lead.business_size],["Роль",e.lead.role],["Объём задачи",e.lead.task_volume],["Потребность",e.lead.need_volume],["Срок",e.lead.result_deadline],["Тип задачи",e.lead.task_type],["Продукт",e.lead.interested_product],["Бюджет",e.lead.budget],["Способ связи",e.lead.preferred_contact_method],["Удобное время",e.lead.convenient_time],["Комментарий",e.lead.comments]];a.innerHTML=i.map(([r,o])=>`
      <article class="admin-lead-field">
        <h4>${w(r)}</h4>
        <p>${w((o??"—").toString())}</p>
      </article>
    `).join(""),s.innerHTML=`
    <article class="admin-stat-card">
      <h3>Результат анализа</h3>
      <p><strong>Температура:</strong> ${w(He(e.analysis.temperature))} (${e.analysis.score}/100)</p>
      <p><strong>Приоритет:</strong> ${e.analysis.isUrgent?"Срочно":"Стандартно"}</p>
      <p><strong>Тратить время:</strong> ${e.analysis.spendTime?"Да":"Ограниченно"}</p>
      <p><strong>Персональный менеджер:</strong> ${e.analysis.personalManager?"Нужен":"Не обязателен"}</p>
      <p><strong>Рекомендуемый отдел:</strong> ${w(e.analysis.targetDepartment)}</p>
      <p><strong>Рекомендация:</strong> ${w(e.analysis.recommendation)}</p>
      <p><strong>Факторы:</strong> ${w(e.analysis.reasoning.join(", "))}</p>
    </article>
  `,t.hidden=!1}function wt(e){return[`Лид #${e.lead.id}: ${e.lead.last_name} ${e.lead.first_name}`.trim(),`Температура: ${He(e.analysis.temperature)} (${e.analysis.score}/100)`,`Отдел: ${e.analysis.targetDepartment}`,`Способ связи: ${e.lead.preferred_contact_method||"—"}`,`Удобное время: ${e.lead.convenient_time||"—"}`,`Комментарий: ${e.lead.comments||"—"}`,`Рекомендация: ${e.analysis.recommendation}`].join(`
`)}function xt(e){return e.length>54?`${e.slice(0,54)}...`:e}function He(e){return e==="hot"?"Горячий":e==="warm"?"Тёплый":"Холодный"}function Et(e){const t=e.trim().toLowerCase();if(!t)return 0;if(t.includes("сегодня")||t.includes("срочно")||t.includes("как можно"))return 25;const n=Mt(t);return n==null?6:n<=7?22:n<=14?16:n<=30?10:5}function _t(e){return e==null?3:e>=1e6?20:e>=5e5?16:e>=25e4?12:e>=1e5?8:3}function kt(e,t){const n=`${e} ${t}`.toLowerCase();return n.includes("500")||n.includes("крупн")?12:n.includes("201")||n.includes("сред")?10:n.includes("51")||n.includes("101")?8:n.includes("11")||n.includes("мал")?6:4}function Ct(e){const t=e.toLowerCase();return t.includes("ceo")||t.includes("основатель")||t.includes("owner")||t.includes("директор")?10:t.includes("руковод")?8:t.includes("аналитик")||t.includes("менеджер")?6:4}function qt(e){const t=e.toLowerCase();return t.includes("it")||t.includes("fin")||t.includes("ecom")?8:t.includes("логист")||t.includes("retail")||t.includes("b2b")?6:4}function Lt(e,t){const n=e.task_type.toLowerCase(),a=e.interested_product.toLowerCase();return t>=80?"Enterprise-продажи":n.includes("сопровождение")||n.includes("развитие")?"Отдел сопровождения":n.includes("внедрение")||n.includes("интеграц")||a.includes("crm")||a.includes("автомат")?"Технический отдел":"Отдел первичных консультаций"}function Te(e){const t=e.match(/(\d+)\s*из\s*10/i);if(t){const n=Number.parseInt(t[1],10);return Number.isFinite(n)?Je(n,0,10):null}return null}function $t(e){const t=e.replace(/\D/g,"");if(!t)return null;const n=Number.parseInt(t,10);return Number.isFinite(n)?n:null}function Mt(e){const t=e.match(/(\d+)/);if(!t)return null;const n=Number.parseInt(t[1],10);return Number.isFinite(n)?n:null}function Je(e,t,n){return Math.min(n,Math.max(t,e))}function Nt(e,t,n,a){const s=()=>{t.hidden=!0},i=()=>{t.hidden=!1,At()};e.addEventListener("click",i),n.addEventListener("click",s),a.addEventListener("click",s),document.addEventListener("keydown",r=>{r.key==="Escape"&&!t.hidden&&s()})}async function At(){const e=document.querySelector("#stats-day-max"),t=document.querySelector("#stats-day-avg"),n=document.querySelector("#stats-week-max"),a=document.querySelector("#stats-week-avg"),s=document.querySelector("#stats-month-max"),i=document.querySelector("#stats-month-avg"),r=document.querySelector("#stats-points-info"),o=document.querySelector("#stats-samples-info"),u=document.querySelector("#admin-heatmap-canvas");if(!(!e||!t||!n||!a||!s||!i||!r||!o||!u))try{const c=await Tt(1e3);if(c.length===0){e.textContent="Макс: 0 сек",t.textContent="Среднее: 0 сек",n.textContent="Макс: 0 сек",a.textContent="Среднее: 0 сек",s.textContent="Макс: 0 сек",i.textContent="Среднее: 0 сек",r.textContent="Точек: 0",o.textContent="Сэмплов: 0",Ie(u,[]);return}const f=ie(c,86400),d=ie(c,604800),p=ie(c,2592e3);e.textContent=`Макс: ${P(f.maxSeconds)}`,t.textContent=`Среднее: ${P(f.avgSeconds)}`,n.textContent=`Макс: ${P(d.maxSeconds)}`,a.textContent=`Среднее: ${P(d.avgSeconds)}`,s.textContent=`Макс: ${P(p.maxSeconds)}`,i.textContent=`Среднее: ${P(p.avgSeconds)}`;const h=It(c);r.textContent=`Точек: ${h.length}`,o.textContent=`Сэмплов: ${c.length}`,Ie(u,h)}catch{e.textContent="Макс: ошибка",t.textContent="Среднее: ошибка",n.textContent="Макс: ошибка",a.textContent="Среднее: ошибка",s.textContent="Макс: ошибка",i.textContent="Среднее: ошибка"}}async function Tt(e){const n=[];for(let a=0;a<e;a+=100){const s=await ot(a,Math.min(100,e-a));if(s.length===0||(n.push(...s),s.length<100))break}return n}function ie(e,t){const n=e.slice(0,Math.min(t,e.length));if(n.length===0)return{maxSeconds:0,avgSeconds:0};let a=0,s=0;return n.forEach(i=>{const r=Number.isFinite(i.time_on_page_seconds)?i.time_on_page_seconds:0;a=Math.max(a,r),s+=r}),{maxSeconds:a,avgSeconds:Math.round(s/n.length)}}function P(e){const t=Math.max(0,Math.floor(e));if(t<60)return`${t} сек`;const n=Math.floor(t/60),a=t%60;return`${n} мин ${a} сек`}function It(e){const t=[];return e.forEach(n=>{const a=n.cursor_hover_zones;if(a){if(Array.isArray(a)){a.forEach(s=>{if(!s||typeof s!="object")return;const i=s,r=typeof i.x=="number"?i.x:Number.parseInt(String(i.x??""),10),o=typeof i.y=="number"?i.y:Number.parseInt(String(i.y??""),10);!Number.isFinite(r)||!Number.isFinite(o)||r<0||o<0||t.push({x:r,y:o})});return}typeof a=="string"&&a.split(";").forEach(s=>{const[,i]=s.split(":");if(!i)return;const[r,o]=i.split(","),u=Number.parseInt(r,10),c=Number.parseInt(o,10);!Number.isFinite(u)||!Number.isFinite(c)||u<0||c<0||t.push({x:u,y:c})})}}),t.slice(-12e3)}function Ie(e,t){const n=e.getContext("2d");if(!n)return;const a=e.width,s=e.height;if(n.clearRect(0,0,a,s),n.fillStyle="#f7fbff",n.fillRect(0,0,a,s),n.strokeStyle="#d4e0ee",n.strokeRect(.5,.5,a-1,s-1),t.length===0){n.fillStyle="#6f849b",n.font="16px Manrope, sans-serif",n.fillText("Нет данных координат для визуализации",24,34);return}const i=Math.max(...t.map(d=>d.x),1),r=Math.max(...t.map(d=>d.y),1),o=20,u=new Map;t.forEach(d=>{const p=Math.round(d.x/20),h=Math.round(d.y/20),v=`${p}:${h}`,g=u.get(v);g?g.count+=1:u.set(v,{x:p*20,y:h*20,count:1})});const c=Array.from(u.values()),f=Math.max(...c.map(d=>d.count),1);c.forEach(d=>{const p=o+d.x/i*(a-o*2),h=o+d.y/r*(s-o*2),v=d.count/f,g=6+v*28,k=n.createRadialGradient(p,h,1,p,h,g);k.addColorStop(0,`rgba(238, 60, 92, ${.65*v+.15})`),k.addColorStop(.65,`rgba(255, 145, 60, ${.35*v+.1})`),k.addColorStop(1,"rgba(255, 145, 60, 0)"),n.fillStyle=k,n.beginPath(),n.arc(p,h,g,0,Math.PI*2),n.fill()})}const Be=["до 10 человек","11–50","51–200","201–500","500+"],De=["микробизнес","малый бизнес","средний бизнес","крупный бизнес"];function Bt(e){return`${new Intl.NumberFormat("ru-RU").format(e)} ₽`}function Dt(){return`
  <div class="client-site">
    <header class="client-header">
      <p class="brand">Autello Concierge</p>
      <h1>AI-автоматизация продаж и сервиса под ключ</h1>
      <p class="lead">
        Мы помогаем компаниям внедрять умных ассистентов, настраивать воронки и CRM так,
        чтобы заявки обрабатывались быстрее, а клиенты получали ответ без ожидания.
        Оставьте заявку — подберём формат работы под ваш масштаб и задачи.
      </p>
    </header>

    <section class="client-card">
      <h2>Заявка</h2>
      <form id="client-lead-form" class="client-form" novalidate>
        <div class="client-grid">
          <label class="client-field">
            <span>Имя *</span>
            <input type="text" name="first_name" required autocomplete="given-name" />
          </label>
          <label class="client-field">
            <span>Фамилия *</span>
            <input type="text" name="last_name" required autocomplete="family-name" />
          </label>
        </div>

        <div class="client-grid">
          <label class="client-field">
            <span>Отчество</span>
            <input type="text" name="patronymic" autocomplete="additional-name" />
          </label>
          <label class="client-field">
            <span>Роль в компании *</span>
            <input type="text" name="role" required autocomplete="organization-title" />
          </label>
        </div>

        <label class="client-field">
          <span>Кратко о бизнесе *</span>
          <textarea name="business_info" rows="3" required placeholder="Чем занимаетесь, что хотите улучшить"></textarea>
        </label>

        <div class="client-grid">
          <label class="client-field">
            <span>Ниша бизнеса *</span>
            <input type="text" name="business_niche" required />
          </label>
          <label class="client-field">
            <span>Тип задачи *</span>
            <select name="task_type" required>
              <option value="">Выберите</option>
              <option value="Консультация и стратегия">Консультация и стратегия</option>
              <option value="Внедрение под ключ">Внедрение под ключ</option>
              <option value="Сопровождение и развитие">Сопровождение и развитие</option>
              <option value="Аудит и доработка">Аудит и доработка</option>
            </select>
          </label>
        </div>

        <div class="client-field range-block">
          <div class="range-top">
            <span>Размер компании *</span>
            <output id="out-company" for="range-company"></output>
          </div>
          <input type="hidden" name="company_size" id="hidden-company" required />
          <input type="range" id="range-company" min="0" max="4" step="1" value="2" />
        </div>

        <div class="client-field range-block">
          <div class="range-top">
            <span>Масштаб бизнеса *</span>
            <output id="out-business" for="range-business"></output>
          </div>
          <input type="hidden" name="business_size" id="hidden-business" required />
          <input type="range" id="range-business" min="0" max="3" step="1" value="1" />
        </div>

        <div class="client-field range-block">
          <div class="range-top">
            <span>Объём текущих задач *</span>
            <output id="out-task-vol" for="range-task-vol"></output>
          </div>
          <input type="hidden" name="task_volume" id="hidden-task-vol" required />
          <input type="range" id="range-task-vol" min="1" max="10" step="1" value="5" />
        </div>

        <div class="client-field range-block">
          <div class="range-top">
            <span>Нужный объём решения *</span>
            <output id="out-need-vol" for="range-need-vol"></output>
          </div>
          <input type="hidden" name="need_volume" id="hidden-need-vol" required />
          <input type="range" id="range-need-vol" min="1" max="10" step="1" value="5" />
        </div>

        <div class="client-field range-block">
          <div class="range-top">
            <span>Желаемый срок первого результата *</span>
            <output id="out-deadline" for="range-deadline"></output>
          </div>
          <input type="hidden" name="result_deadline" id="hidden-deadline" required />
          <input type="range" id="range-deadline" min="7" max="180" step="7" value="30" />
        </div>

        <div class="client-grid">
          <label class="client-field">
            <span>Интересующий продукт *</span>
            <select name="interested_product" id="client-interested-product" required>
              <option value="">Выберите продукт</option>
            </select>
          </label>
          <div class="client-field range-block">
            <div class="range-top">
              <span>Бюджет проекта *</span>
              <output id="out-budget" for="range-budget"></output>
            </div>
            <input type="hidden" name="budget" id="hidden-budget" required />
            <input type="range" id="range-budget" min="0" max="97" step="1" value="48" />
          </div>
        </div>

        <div class="client-grid">
          <label class="client-field">
            <span>Способ связи *</span>
            <select name="preferred_contact_method" required>
              <option value="Телефон">Телефон</option>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </label>
          <label class="client-field">
            <span>Удобное время *</span>
            <input type="text" name="convenient_time" required placeholder="Например: 10:00–14:00 МСК" />
          </label>
        </div>

        <label class="client-field">
          <span>Комментарии</span>
          <input type="text" name="comments" placeholder="Дополнительно" />
        </label>

        <div class="client-actions">
          <button type="submit" id="client-submit-btn">Отправить заявку</button>
          <p class="client-status" id="client-status" role="status" aria-live="polite"></p>
        </div>
      </form>
    </section>
  </div>
  `}function Ot(){const e=document.querySelector("#client-lead-form"),t=document.querySelector("#client-submit-btn"),n=document.querySelector("#client-status"),a=document.querySelector("#client-interested-product"),s=document.querySelector("#range-company"),i=document.querySelector("#hidden-company"),r=document.querySelector("#out-company"),o=document.querySelector("#range-business"),u=document.querySelector("#hidden-business"),c=document.querySelector("#out-business"),f=document.querySelector("#range-task-vol"),d=document.querySelector("#hidden-task-vol"),p=document.querySelector("#out-task-vol"),h=document.querySelector("#range-need-vol"),v=document.querySelector("#hidden-need-vol"),g=document.querySelector("#out-need-vol"),k=document.querySelector("#range-deadline"),q=document.querySelector("#hidden-deadline"),N=document.querySelector("#out-deadline"),C=document.querySelector("#range-budget"),D=document.querySelector("#hidden-budget"),A=document.querySelector("#out-budget");if(!e||!t||!n||!a||!s||!i||!r||!o||!u||!c||!f||!d||!p||!h||!v||!g||!k||!q||!N||!C||!D||!A)throw new Error("Client form elements not found");const z=Date.now(),de=[],ce=new Set,le=`autello:return-visits:${window.location.pathname}`,ue=window.localStorage.getItem(le),me=ue?Number.parseInt(ue,10):0,pe=Number.isFinite(me)?me:0;window.localStorage.setItem(le,String(pe+1));const We=Date.now(),te=new Map,J=[];let fe=0,he=0;const ye=m=>{fe=m.clientX,he=m.clientY};window.addEventListener("mousemove",ye);const ge=m=>{const l=m.target;if(!l)return;const y=l.closest("button, [role='button'], input[type='submit'], input[type='button'], a");if(!y)return;const T=(y.getAttribute("data-telemetry-key")??y.getAttribute("aria-label")??y.textContent??y.id??"unknown_button").trim().replace(/\s+/g," ").slice(0,80)||"unknown_button",X=te.get(T)??0;te.set(T,X+1)};document.addEventListener("click",ge);const Ye=window.setInterval(()=>{const m=Math.max(1,Math.floor((Date.now()-We)/1e3));J.push({x:Math.max(0,Math.floor(fe)),y:Math.max(0,Math.floor(he)),timestamp:Date.now()}),J.length>600&&J.shift();const l=Array.from(te.entries()).map(([j,T])=>`${j}:${T}`).join("|"),y=[...J];rt({application_id:0,time_on_page:m,buttons_clicked:l,cursor_positions:y,return_frequency:0}).catch(()=>{})},1e3),U=()=>{window.clearInterval(Ye),window.removeEventListener("mousemove",ye),document.removeEventListener("click",ge),window.removeEventListener("beforeunload",U),window.removeEventListener("pagehide",U)};window.addEventListener("beforeunload",U),window.addEventListener("pagehide",U);let B=se(null);function W(){const m=Number.parseInt(s.value,10),l=Be[Math.min(Math.max(m,0),Be.length-1)]??"";i.value=l,r.textContent=l}function Y(){const m=Number.parseInt(o.value,10),l=De[Math.min(Math.max(m,0),De.length-1)]??"";u.value=l,c.textContent=l}function O(m,l,y,j){const T=Number.parseInt(m.value,10),X=`${j} ${T} из 10`;l.value=X,y.textContent=X}function K(){const l=`до ${Number.parseInt(k.value,10)} дней`;q.value=l,N.textContent=l}function Ke(){const m=Number.parseInt(C.max,10)||1,l=Number.parseInt(C.value,10),y=Number.isFinite(l)?Math.min(m,Math.max(0,l)):0,j=B.min+y*B.step;return Math.min(B.max,Math.max(B.min,j))}function ne(){const m=Ke(),l=Bt(m);D.value=l,A.textContent=l}function ae(){const m=B.max-B.min,l=Math.max(1,Math.floor(m/B.step));C.min="0",C.max=String(l);const y=Number.parseInt(C.value,10);(!Number.isFinite(y)||y>l)&&(C.value=String(Math.round(l/2))),ne()}s.addEventListener("input",W),o.addEventListener("input",Y),f.addEventListener("input",()=>O(f,d,p,"Уровень")),h.addEventListener("input",()=>O(h,v,g,"Уровень")),k.addEventListener("input",K),C.addEventListener("input",ne),W(),Y(),O(f,d,p,"Уровень"),O(h,v,g,"Уровень"),K(),ae(),(async()=>{const m=await we();if(m){const l=ee(m.services);Oe(a,l.length>0?l:Ee()),B=se(m.budget_range)}else Oe(a,Ee());ae()})(),document.querySelectorAll(".client-field, .client-actions button").forEach(m=>{m.addEventListener("mouseenter",()=>{var y;const l=m.classList.contains("client-field")?((y=m.querySelector("span"))==null?void 0:y.textContent)??"field":"submit-button";ce.add(l)})}),e.addEventListener("click",m=>{const l=m.target;l&&(l instanceof HTMLButtonElement||l.closest("button"))&&de.push("submit_click")}),e.addEventListener("submit",async m=>{if(m.preventDefault(),W(),Y(),O(f,d,p,"Уровень"),O(h,v,g,"Уровень"),K(),ne(),!e.reportValidity()){Z(n,"Проверьте обязательные поля формы.",!0);return}t.disabled=!0,Z(n,"Отправляем заявку...");const l=tt(new FormData(e));try{const y=await nt(l),j=st(y.id,z,de,ce,pe);await it(j),e.reset(),s.value="2",o.value="1",f.value="5",h.value="5",k.value="30",W(),Y(),O(f,d,p,"Уровень"),O(h,v,g,"Уровень"),K(),we().then(T=>{B=se((T==null?void 0:T.budget_range)??null),ae()}),Z(n,`Заявка #${y.id} отправлена. Мы свяжемся с вами в ближайшее время.`)}catch(y){console.error(y),Z(n,"Не удалось отправить заявку. Попробуйте ещё раз через минуту.",!0)}finally{t.disabled=!1}})}function Z(e,t,n=!1){e.textContent=t,e.dataset.variant=n?"error":"ok"}function Oe(e,t){e.innerHTML='<option value="">Выберите продукт</option>',t.forEach(n=>{const a=document.createElement("option");a.value=n,a.textContent=n,e.append(a)})}const oe=document.querySelector("#app");if(!oe)throw new Error("Root #app not found");function Ue(){const e=window.location.pathname,t=e==="/admin"||e.startsWith("/admin/");document.body.className=t?"admin-route":"client-route",document.title=t?"Autello — админ":"Autello — заявка",t?(oe.innerHTML=ut(),mt()):(oe.innerHTML=Dt(),Ot())}Ue();window.addEventListener("popstate",Ue);
