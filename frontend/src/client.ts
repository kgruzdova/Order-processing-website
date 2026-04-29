import "./client.css";
import {
  budgetBoundsFromAdmin,
  buildBehaviorPayload,
  buildLeadPayload,
  createLead,
  fetchLatestAdminConfig,
  getDefaultServices,
  normalizeToStringArray,
  sendBehaviorMetrics,
  sendBehaviorMetricsStream,
} from "./api";

const COMPANY_LABELS = ["до 10 человек", "11–50", "51–200", "201–500", "500+"];
const BUSINESS_LABELS = ["микробизнес", "малый бизнес", "средний бизнес", "крупный бизнес"];

function formatRubles(n: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(n)} ₽`;
}

export function getClientHTML(): string {
  return `
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
  `;
}

export function initClient(): void {
  const leadForm = document.querySelector<HTMLFormElement>("#client-lead-form");
  const submitBtn = document.querySelector<HTMLButtonElement>("#client-submit-btn");
  const statusEl = document.querySelector<HTMLParagraphElement>("#client-status");
  const interestedProductSelect = document.querySelector<HTMLSelectElement>("#client-interested-product");

  const rangeCompany = document.querySelector<HTMLInputElement>("#range-company");
  const hiddenCompany = document.querySelector<HTMLInputElement>("#hidden-company");
  const outCompany = document.querySelector<HTMLOutputElement>("#out-company");

  const rangeBusiness = document.querySelector<HTMLInputElement>("#range-business");
  const hiddenBusiness = document.querySelector<HTMLInputElement>("#hidden-business");
  const outBusiness = document.querySelector<HTMLOutputElement>("#out-business");

  const rangeTaskVol = document.querySelector<HTMLInputElement>("#range-task-vol");
  const hiddenTaskVol = document.querySelector<HTMLInputElement>("#hidden-task-vol");
  const outTaskVol = document.querySelector<HTMLOutputElement>("#out-task-vol");

  const rangeNeedVol = document.querySelector<HTMLInputElement>("#range-need-vol");
  const hiddenNeedVol = document.querySelector<HTMLInputElement>("#hidden-need-vol");
  const outNeedVol = document.querySelector<HTMLOutputElement>("#out-need-vol");

  const rangeDeadline = document.querySelector<HTMLInputElement>("#range-deadline");
  const hiddenDeadline = document.querySelector<HTMLInputElement>("#hidden-deadline");
  const outDeadline = document.querySelector<HTMLOutputElement>("#out-deadline");

  const rangeBudget = document.querySelector<HTMLInputElement>("#range-budget");
  const hiddenBudget = document.querySelector<HTMLInputElement>("#hidden-budget");
  const outBudget = document.querySelector<HTMLOutputElement>("#out-budget");

  if (
    !leadForm ||
    !submitBtn ||
    !statusEl ||
    !interestedProductSelect ||
    !rangeCompany ||
    !hiddenCompany ||
    !outCompany ||
    !rangeBusiness ||
    !hiddenBusiness ||
    !outBusiness ||
    !rangeTaskVol ||
    !hiddenTaskVol ||
    !outTaskVol ||
    !rangeNeedVol ||
    !hiddenNeedVol ||
    !outNeedVol ||
    !rangeDeadline ||
    !hiddenDeadline ||
    !outDeadline ||
    !rangeBudget ||
    !hiddenBudget ||
    !outBudget
  ) {
    throw new Error("Client form elements not found");
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

  const telemetryStartedAt = Date.now();
  const buttonCounter = new Map<string, number>();
  const cursorSamples: Array<{ x: number; y: number; timestamp: number }> = [];
  let lastCursorX = 0;
  let lastCursorY = 0;

  const onMouseMove = (event: MouseEvent): void => {
    lastCursorX = event.clientX;
    lastCursorY = event.clientY;
  };
  window.addEventListener("mousemove", onMouseMove);

  const onTelemetryClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    const clickable = target.closest("button, [role='button'], input[type='submit'], input[type='button'], a");
    if (!clickable) {
      return;
    }
    const keyRaw =
      clickable.getAttribute("data-telemetry-key") ??
      clickable.getAttribute("aria-label") ??
      clickable.textContent ??
      clickable.id ??
      "unknown_button";
    const key = keyRaw.trim().replace(/\s+/g, " ").slice(0, 80) || "unknown_button";
    const prev = buttonCounter.get(key) ?? 0;
    buttonCounter.set(key, prev + 1);
  };
  document.addEventListener("click", onTelemetryClick);

  const telemetryTimer = window.setInterval(() => {
    const secondsOnPage = Math.max(1, Math.floor((Date.now() - telemetryStartedAt) / 1000));
    cursorSamples.push({
      x: Math.max(0, Math.floor(lastCursorX)),
      y: Math.max(0, Math.floor(lastCursorY)),
      timestamp: Date.now(),
    });
    if (cursorSamples.length > 600) {
      cursorSamples.shift();
    }
    const buttonsClicked = Array.from(buttonCounter.entries())
      .map(([name, count]) => `${name}:${count}`)
      .join("|");
    const cursorPositions = [...cursorSamples];

    void sendBehaviorMetricsStream({
      application_id: 0,
      time_on_page: secondsOnPage,
      buttons_clicked: buttonsClicked,
      cursor_positions: cursorPositions,
      return_frequency: 0,
    }).catch(() => {
      /* background telemetry errors are non-blocking */
    });
  }, 1000);

  const cleanupTelemetry = (): void => {
    window.clearInterval(telemetryTimer);
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("click", onTelemetryClick);
    window.removeEventListener("beforeunload", cleanupTelemetry);
    window.removeEventListener("pagehide", cleanupTelemetry);
  };
  window.addEventListener("beforeunload", cleanupTelemetry);
  window.addEventListener("pagehide", cleanupTelemetry);

  let budgetBounds = budgetBoundsFromAdmin(null);

  function syncCompany(): void {
    const i = Number.parseInt(rangeCompany.value, 10);
    const label = COMPANY_LABELS[Math.min(Math.max(i, 0), COMPANY_LABELS.length - 1)] ?? "";
    hiddenCompany.value = label;
    outCompany.textContent = label;
  }

  function syncBusiness(): void {
    const i = Number.parseInt(rangeBusiness.value, 10);
    const label = BUSINESS_LABELS[Math.min(Math.max(i, 0), BUSINESS_LABELS.length - 1)] ?? "";
    hiddenBusiness.value = label;
    outBusiness.textContent = label;
  }

  function syncScale(
    range: HTMLInputElement,
    hidden: HTMLInputElement,
    out: HTMLOutputElement,
    prefix: string,
  ): void {
    const n = Number.parseInt(range.value, 10);
    const text = `${prefix} ${n} из 10`;
    hidden.value = text;
    out.textContent = text;
  }

  function syncDeadline(): void {
    const days = Number.parseInt(rangeDeadline.value, 10);
    const text = `до ${days} дней`;
    hiddenDeadline.value = text;
    outDeadline.textContent = text;
  }

  function budgetFromSlider(): number {
    const numSteps = Number.parseInt(rangeBudget.max, 10) || 1;
    const i = Number.parseInt(rangeBudget.value, 10);
    const idx = Number.isFinite(i) ? Math.min(numSteps, Math.max(0, i)) : 0;
    const raw = budgetBounds.min + idx * budgetBounds.step;
    return Math.min(budgetBounds.max, Math.max(budgetBounds.min, raw));
  }

  function syncBudget(): void {
    const n = budgetFromSlider();
    const text = formatRubles(n);
    hiddenBudget.value = text;
    outBudget.textContent = text;
  }

  function applyBudgetSliderFromBounds(): void {
    const span = budgetBounds.max - budgetBounds.min;
    const numSteps = Math.max(1, Math.floor(span / budgetBounds.step));
    rangeBudget.min = "0";
    rangeBudget.max = String(numSteps);
    const cur = Number.parseInt(rangeBudget.value, 10);
    if (!Number.isFinite(cur) || cur > numSteps) {
      rangeBudget.value = String(Math.round(numSteps / 2));
    }
    syncBudget();
  }

  rangeCompany.addEventListener("input", syncCompany);
  rangeBusiness.addEventListener("input", syncBusiness);
  rangeTaskVol.addEventListener("input", () =>
    syncScale(rangeTaskVol, hiddenTaskVol, outTaskVol, "Уровень"),
  );
  rangeNeedVol.addEventListener("input", () =>
    syncScale(rangeNeedVol, hiddenNeedVol, outNeedVol, "Уровень"),
  );
  rangeDeadline.addEventListener("input", syncDeadline);
  rangeBudget.addEventListener("input", syncBudget);

  syncCompany();
  syncBusiness();
  syncScale(rangeTaskVol, hiddenTaskVol, outTaskVol, "Уровень");
  syncScale(rangeNeedVol, hiddenNeedVol, outNeedVol, "Уровень");
  syncDeadline();
  applyBudgetSliderFromBounds();

  void (async () => {
    const latest = await fetchLatestAdminConfig();
    if (latest) {
      const services = normalizeToStringArray(latest.services);
      fillProductOptions(interestedProductSelect, services.length > 0 ? services : getDefaultServices());
      budgetBounds = budgetBoundsFromAdmin(latest.budget_range);
    } else {
      fillProductOptions(interestedProductSelect, getDefaultServices());
    }
    applyBudgetSliderFromBounds();
  })();

  document.querySelectorAll<HTMLElement>(".client-field, .client-actions button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const zoneName = el.classList.contains("client-field")
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

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncCompany();
    syncBusiness();
    syncScale(rangeTaskVol, hiddenTaskVol, outTaskVol, "Уровень");
    syncScale(rangeNeedVol, hiddenNeedVol, outNeedVol, "Уровень");
    syncDeadline();
    syncBudget();

    if (!leadForm.reportValidity()) {
      setClientStatus(statusEl, "Проверьте обязательные поля формы.", true);
      return;
    }

    submitBtn.disabled = true;
    setClientStatus(statusEl, "Отправляем заявку...");

    const payload = buildLeadPayload(new FormData(leadForm));

    try {
      const lead = await createLead(payload);
      const metricsPayload = buildBehaviorPayload(lead.id, pageOpenTime, buttonClicks, hoverZones, returnVisitsCount);
      await sendBehaviorMetrics(metricsPayload);
      leadForm.reset();
      rangeCompany.value = "2";
      rangeBusiness.value = "1";
      rangeTaskVol.value = "5";
      rangeNeedVol.value = "5";
      rangeDeadline.value = "30";
      syncCompany();
      syncBusiness();
      syncScale(rangeTaskVol, hiddenTaskVol, outTaskVol, "Уровень");
      syncScale(rangeNeedVol, hiddenNeedVol, outNeedVol, "Уровень");
      syncDeadline();
      void fetchLatestAdminConfig().then((latest) => {
        budgetBounds = budgetBoundsFromAdmin(latest?.budget_range ?? null);
        applyBudgetSliderFromBounds();
      });
      setClientStatus(statusEl, `Заявка #${lead.id} отправлена. Мы свяжемся с вами в ближайшее время.`);
    } catch (error) {
      console.error(error);
      setClientStatus(statusEl, "Не удалось отправить заявку. Попробуйте ещё раз через минуту.", true);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function setClientStatus(el: HTMLParagraphElement, text: string, isError = false): void {
  el.textContent = text;
  el.dataset.variant = isError ? "error" : "ok";
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
