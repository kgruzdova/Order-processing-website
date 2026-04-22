(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const f of r.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&o(f)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function l(e){return(e??"").toString().trim()}function le(e){const t=l(e);return t.length>0?t:null}function ee(e){return{first_name:l(e.get("first_name")),last_name:l(e.get("last_name")),patronymic:le(e.get("patronymic")),business_info:l(e.get("business_info")),business_niche:l(e.get("business_niche")),company_size:l(e.get("company_size")),task_volume:l(e.get("task_volume")),role:l(e.get("role")),business_size:l(e.get("business_size")),need_volume:l(e.get("need_volume")),result_deadline:l(e.get("result_deadline")),task_type:l(e.get("task_type")),interested_product:l(e.get("interested_product")),budget:l(e.get("budget")),preferred_contact_method:l(e.get("preferred_contact_method")),convenient_time:l(e.get("convenient_time")),comments:l(e.get("comments"))}}async function te(e){const t=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`Lead create failed: ${t.status}`);return await t.json()}function ne(e,t,n,o,i){return{application_id:e,time_on_page_seconds:Math.max(1,Math.floor((Date.now()-t)/1e3)),button_clicks:n.length>0?n:["submit_click"],cursor_hover_zones:o.size>0?Array.from(o):["form_root"],return_visits_count:i,technical_payload:{userAgent:navigator.userAgent,language:navigator.language,viewport:`${window.innerWidth}x${window.innerHeight}`,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,referrer:document.referrer||null}}}async function ie(e){const t=await fetch("/api/behavior-metrics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`Behavior metrics create failed: ${t.status}`)}function oe(e){return Array.isArray(e)?e.filter(t=>typeof t=="string"&&t.trim().length>0):e&&typeof e=="object"?Object.values(e).filter(t=>typeof t=="string"&&t.trim().length>0):[]}function ce(e){if(!e||typeof e!="object")return null;const t=e,n=typeof t.from=="string"?t.from:null,o=typeof t.to=="string"?t.to:null,i=typeof t.label=="string"?t.label:null;return i||(n&&o?`${n} - ${o}`:n??o??null)}function Z(e){const t=e.replace(/\D/g,"");if(!t)return null;const n=Number.parseInt(t,10);return Number.isFinite(n)?n:null}const J={min:15e4,max:5e6,step:5e4};function I(e){if(!e||typeof e!="object")return J;const t=e,n=typeof t.from=="number"?t.from:typeof t.from=="string"?Z(t.from):null,o=typeof t.to=="number"?t.to:typeof t.to=="string"?Z(t.to):null;if(n!=null&&o!=null&&o>n){const i=o-n,r=Math.max(5e4,Math.round(i/40/5e4)*5e4);return{min:n,max:o,step:r}}return J}async function F(){try{const e=await fetch("/api/admin-config?limit=1");return e.ok?(await e.json())[0]??null:null}catch{return null}}function C(){return["Комплексная AI-автоматизация отдела продаж","Запуск персонального AI-консультанта","Аудит воронки и скриптов продаж","Внедрение CRM + аналитика под ключ"]}function ue(){return`
  <div class="admin-page">
    <div class="page-bg" aria-hidden="true">
      <span class="orb orb-1"></span>
      <span class="orb orb-2"></span>
      <span class="orb orb-3"></span>
      <span class="orb orb-4"></span>
      <span class="orb orb-5"></span>
      <span class="orb orb-6"></span>
    </div>

    <main class="container">
      <section class="hero-card">
        <p class="eyebrow">Autello Concierge</p>
        <h1>Премиальная заявка для теплых клиентов</h1>
        <p class="hero-subtitle">
          Заполните форму за 2 минуты — и команда подготовит персональное решение под ваш бизнес.
        </p>

        <form id="lead-form" class="lead-form" novalidate>
          <div class="grid two-col">
            <label class="field">
              <span>Имя *</span>
              <input name="first_name" required />
            </label>
            <label class="field">
              <span>Фамилия *</span>
              <input name="last_name" required />
            </label>
          </div>

          <div class="grid two-col">
            <label class="field">
              <span>Отчество</span>
              <input name="patronymic" />
            </label>
            <label class="field">
              <span>Роль в компании *</span>
              <input name="role" required />
            </label>
          </div>

          <label class="field">
            <span>Кратко о бизнесе *</span>
            <textarea name="business_info" rows="3" required></textarea>
          </label>

          <div class="grid two-col">
            <label class="field">
              <span>Ниша бизнеса *</span>
              <input name="business_niche" required />
            </label>
            <label class="field">
              <span>Размер бизнеса *</span>
              <input name="business_size" required />
            </label>
          </div>

          <div class="grid two-col">
            <label class="field">
              <span>Размер компании *</span>
              <input name="company_size" placeholder="например: 25-50 сотрудников" required />
            </label>
            <label class="field">
              <span>Объем задач *</span>
              <input name="task_volume" required />
            </label>
          </div>

          <div class="grid two-col">
            <label class="field">
              <span>Какой объем решения нужен *</span>
              <input name="need_volume" required />
            </label>
            <label class="field">
              <span>Желаемый срок результата *</span>
              <input name="result_deadline" required />
            </label>
          </div>

          <div class="grid two-col">
            <label class="field">
              <span>Тип задачи *</span>
              <input name="task_type" required />
            </label>
            <label class="field">
              <span>Интересующий продукт/услуга *</span>
              <select name="interested_product" id="interested-product" required>
                <option value="">Выберите продукт</option>
              </select>
            </label>
          </div>

          <div class="grid two-col">
            <label class="field">
              <span>Бюджет *</span>
              <input name="budget" id="budget-field" placeholder="например: от 300 000 ₽" required />
            </label>
            <label class="field">
              <span>Предпочтительный способ связи *</span>
              <select name="preferred_contact_method" required>
                <option value="Телефон">Телефон</option>
                <option value="Telegram">Telegram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
              </select>
            </label>
          </div>

          <div class="grid two-col">
            <label class="field">
              <span>Удобное время для связи *</span>
              <input name="convenient_time" placeholder="например: 10:00-13:00 МСК" required />
            </label>
            <label class="field">
              <span>Комментарии</span>
              <input name="comments" placeholder="Любые уточнения по проекту" />
            </label>
          </div>

          <div class="actions">
            <button type="submit" id="submit-btn">Отправить заявку</button>
            <p class="status" id="status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </section>
    </main>
  </div>
  `}function de(){const e=document.querySelector("#lead-form"),t=document.querySelector("#submit-btn"),n=document.querySelector("#status"),o=document.querySelector("#interested-product"),i=document.querySelector("#budget-field");if(!e||!t||!n||!o||!i)throw new Error("Admin form elements not found");const r=Date.now(),f=[],_=new Set,q=`autello:return-visits:${window.location.pathname}`,m=window.localStorage.getItem(q),g=m?Number.parseInt(m,10):0,v=Number.isFinite(g)?g:0;window.localStorage.setItem(q,String(v+1)),document.querySelectorAll(".admin-page .field, .admin-page button").forEach(c=>{c.addEventListener("mouseenter",()=>{var p;const d=c.classList.contains("field")?((p=c.querySelector("span"))==null?void 0:p.textContent)??"field":"submit-button";_.add(d)})}),e.addEventListener("click",c=>{const d=c.target;d&&(d instanceof HTMLButtonElement||d.closest("button"))&&f.push("submit_click")}),pe(o,i),e.addEventListener("submit",async c=>{if(c.preventDefault(),!e.reportValidity()){k(n,"Проверьте обязательные поля формы.",!0);return}t.disabled=!0,k(n,"Отправляем заявку...");const d=ee(new FormData(e));try{const p=await te(d),w=ne(p.id,r,f,_,v);await ie(w),e.reset(),k(n,`Заявка #${p.id} успешно отправлена. Мы свяжемся с вами в ближайшее время.`)}catch(p){console.error(p),k(n,"Не удалось отправить заявку. Попробуйте еще раз через минуту.",!0)}finally{t.disabled=!1}})}function k(e,t,n=!1){e.textContent=t,e.dataset.variant=n?"error":"ok"}async function pe(e,t){const n=await F();if(!n){G(e,C());return}const o=oe(n.services);G(e,o.length>0?o:C());const i=ce(n.budget_range);i&&(t.placeholder=i)}function G(e,t){e.innerHTML='<option value="">Выберите продукт</option>',t.forEach(n=>{const o=document.createElement("option");o.value=n,o.textContent=n,e.append(o)})}const Y=["до 10 человек","11–50","51–200","201–500","500+"],Q=["микробизнес","малый бизнес","средний бизнес","крупный бизнес"];function me(e){return`${new Intl.NumberFormat("ru-RU").format(e)} ₽`}function fe(){return`
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
  `}function be(){const e=document.querySelector("#client-lead-form"),t=document.querySelector("#client-submit-btn"),n=document.querySelector("#client-status"),o=document.querySelector("#client-interested-product"),i=document.querySelector("#range-company"),r=document.querySelector("#hidden-company"),f=document.querySelector("#out-company"),_=document.querySelector("#range-business"),M=document.querySelector("#hidden-business"),q=document.querySelector("#out-business"),m=document.querySelector("#range-task-vol"),g=document.querySelector("#hidden-task-vol"),v=document.querySelector("#out-task-vol"),c=document.querySelector("#range-need-vol"),d=document.querySelector("#hidden-need-vol"),p=document.querySelector("#out-need-vol"),w=document.querySelector("#range-deadline"),P=document.querySelector("#hidden-deadline"),D=document.querySelector("#out-deadline"),y=document.querySelector("#range-budget"),V=document.querySelector("#hidden-budget"),$=document.querySelector("#out-budget");if(!e||!t||!n||!o||!i||!r||!f||!_||!M||!q||!m||!g||!v||!c||!d||!p||!w||!P||!D||!y||!V||!$)throw new Error("Client form elements not found");const se=Date.now(),z=[],R=new Set,H=`autello:return-visits:${window.location.pathname}`,j=window.localStorage.getItem(H),W=j?Number.parseInt(j,10):0,U=Number.isFinite(W)?W:0;window.localStorage.setItem(H,String(U+1));let b=I(null);function E(){const s=Number.parseInt(i.value,10),a=Y[Math.min(Math.max(s,0),Y.length-1)]??"";r.value=a,f.textContent=a}function L(){const s=Number.parseInt(_.value,10),a=Q[Math.min(Math.max(s,0),Q.length-1)]??"";M.value=a,q.textContent=a}function h(s,a,u,S){const x=Number.parseInt(s.value,10),K=`${S} ${x} из 10`;a.value=K,u.textContent=K}function N(){const a=`до ${Number.parseInt(w.value,10)} дней`;P.value=a,D.textContent=a}function re(){const s=Number.parseInt(y.max,10)||1,a=Number.parseInt(y.value,10),u=Number.isFinite(a)?Math.min(s,Math.max(0,a)):0,S=b.min+u*b.step;return Math.min(b.max,Math.max(b.min,S))}function T(){const s=re(),a=me(s);V.value=a,$.textContent=a}function B(){const s=b.max-b.min,a=Math.max(1,Math.floor(s/b.step));y.min="0",y.max=String(a);const u=Number.parseInt(y.value,10);(!Number.isFinite(u)||u>a)&&(y.value=String(Math.round(a/2))),T()}i.addEventListener("input",E),_.addEventListener("input",L),m.addEventListener("input",()=>h(m,g,v,"Уровень")),c.addEventListener("input",()=>h(c,d,p,"Уровень")),w.addEventListener("input",N),y.addEventListener("input",T),E(),L(),h(m,g,v,"Уровень"),h(c,d,p,"Уровень"),N(),B(),(async()=>{const s=await F();if(s){const a=oe(s.services);X(o,a.length>0?a:C()),b=I(s.budget_range)}else X(o,C());B()})(),document.querySelectorAll(".client-field, .client-actions button").forEach(s=>{s.addEventListener("mouseenter",()=>{var u;const a=s.classList.contains("client-field")?((u=s.querySelector("span"))==null?void 0:u.textContent)??"field":"submit-button";R.add(a)})}),e.addEventListener("click",s=>{const a=s.target;a&&(a instanceof HTMLButtonElement||a.closest("button"))&&z.push("submit_click")}),e.addEventListener("submit",async s=>{if(s.preventDefault(),E(),L(),h(m,g,v,"Уровень"),h(c,d,p,"Уровень"),N(),T(),!e.reportValidity()){A(n,"Проверьте обязательные поля формы.",!0);return}t.disabled=!0,A(n,"Отправляем заявку...");const a=ee(new FormData(e));try{const u=await te(a),S=ne(u.id,se,z,R,U);await ie(S),e.reset(),i.value="2",_.value="1",m.value="5",c.value="5",w.value="30",E(),L(),h(m,g,v,"Уровень"),h(c,d,p,"Уровень"),N(),F().then(x=>{b=I((x==null?void 0:x.budget_range)??null),B()}),A(n,`Заявка #${u.id} отправлена. Мы свяжемся с вами в ближайшее время.`)}catch(u){console.error(u),A(n,"Не удалось отправить заявку. Попробуйте ещё раз через минуту.",!0)}finally{t.disabled=!1}})}function A(e,t,n=!1){e.textContent=t,e.dataset.variant=n?"error":"ok"}function X(e,t){e.innerHTML='<option value="">Выберите продукт</option>',t.forEach(n=>{const o=document.createElement("option");o.value=n,o.textContent=n,e.append(o)})}const O=document.querySelector("#app");if(!O)throw new Error("Root #app not found");function ae(){const e=window.location.pathname,t=e==="/admin"||e.startsWith("/admin/");document.body.className=t?"admin-route":"client-route",document.title=t?"Autello — админ":"Autello — заявка",t?(O.innerHTML=ue(),de()):(O.innerHTML=fe(),be())}ae();window.addEventListener("popstate",ae);
