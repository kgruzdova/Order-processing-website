import "./admin.css";
import {
  buildBehaviorPayload,
  buildLeadPayload,
  createLead,
  extractBudgetRangeText,
  fetchLatestAdminConfig,
  getDefaultServices,
  normalizeToStringArray,
  sendBehaviorMetrics,
} from "./api";

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
  `;
}

export function initAdmin(): void {
  const leadForm = document.querySelector<HTMLFormElement>("#lead-form");
  const submitBtn = document.querySelector<HTMLButtonElement>("#submit-btn");
  const statusEl = document.querySelector<HTMLParagraphElement>("#status");
  const interestedProductSelect = document.querySelector<HTMLSelectElement>("#interested-product");
  const budgetField = document.querySelector<HTMLInputElement>("#budget-field");

  if (!leadForm || !submitBtn || !statusEl || !interestedProductSelect || !budgetField) {
    throw new Error("Admin form elements not found");
  }

  const pageOpenTime = Date.now();
  const buttonClicks: string[] = [];
  const hoverZones = new Set<string>();
  const currentPath = window.location.pathname;
  const visitsKey = `autello:return-visits:${currentPath}`;
  const prevVisitsRaw = window.localStorage.getItem(visitsKey);
  const prevVisits = prevVisitsRaw ? Number.parseInt(prevVisitsRaw, 10) : 0;
  const returnVisitsCount = Number.isFinite(prevVisits) ? prevVisits : 0;
  window.localStorage.setItem(visitsKey, String(returnVisitsCount + 1));

  document.querySelectorAll<HTMLElement>(".admin-page .field, .admin-page button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const zoneName = el.classList.contains("field")
        ? (el.querySelector("span")?.textContent ?? "field")
        : "submit-button";
      hoverZones.add(zoneName);
    });
  });

  leadForm.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    if (target instanceof HTMLButtonElement || target.closest("button")) {
      buttonClicks.push("submit_click");
    }
  });

  void hydrateAdminForm(interestedProductSelect, budgetField);

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!leadForm.reportValidity()) {
      setStatus(statusEl, "Проверьте обязательные поля формы.", true);
      return;
    }

    submitBtn.disabled = true;
    setStatus(statusEl, "Отправляем заявку...");

    const payload = buildLeadPayload(new FormData(leadForm));

    try {
      const lead = await createLead(payload);
      const metricsPayload = buildBehaviorPayload(lead.id, pageOpenTime, buttonClicks, hoverZones, returnVisitsCount);
      await sendBehaviorMetrics(metricsPayload);
      leadForm.reset();
      setStatus(statusEl, `Заявка #${lead.id} успешно отправлена. Мы свяжемся с вами в ближайшее время.`);
    } catch (error) {
      console.error(error);
      setStatus(statusEl, "Не удалось отправить заявку. Попробуйте еще раз через минуту.", true);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function setStatus(statusEl: HTMLParagraphElement, text: string, isError = false): void {
  statusEl.textContent = text;
  statusEl.dataset.variant = isError ? "error" : "ok";
}

async function hydrateAdminForm(
  interestedProductSelect: HTMLSelectElement,
  budgetField: HTMLInputElement,
): Promise<void> {
  const latest = await fetchLatestAdminConfig();
  if (!latest) {
    fillProductOptions(interestedProductSelect, getDefaultServices());
    return;
  }

  const services = normalizeToStringArray(latest.services);
  fillProductOptions(interestedProductSelect, services.length > 0 ? services : getDefaultServices());

  const budgetRange = extractBudgetRangeText(latest.budget_range);
  if (budgetRange) {
    budgetField.placeholder = budgetRange;
  }
}

function fillProductOptions(select: HTMLSelectElement, values: string[]): void {
  select.innerHTML = `<option value="">Выберите продукт</option>`;
  values.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.append(option);
  });
}
