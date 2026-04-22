export type LeadPayload = {
  first_name: string;
  last_name: string;
  patronymic: string | null;
  business_info: string;
  business_niche: string;
  company_size: string;
  task_volume: string;
  role: string;
  business_size: string;
  need_volume: string;
  result_deadline: string;
  task_type: string;
  interested_product: string;
  budget: string;
  preferred_contact_method: string;
  convenient_time: string;
  comments: string;
};

export type AdminConfig = {
  services?: unknown;
  budget_range?: unknown;
  extra_ui?: unknown;
};

export type LeadResponse = LeadPayload & {
  id: number;
  created_at: string;
};

export type BehaviorMetricsPayload = {
  application_id: number;
  time_on_page_seconds: number;
  button_clicks: string[];
  cursor_hover_zones: string[];
  return_visits_count: number;
  technical_payload: Record<string, unknown>;
};
