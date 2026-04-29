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
  id: number;
  services: unknown;
  budget_range: unknown;
  extra_ui: unknown;
  updated_at: string;
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

export type BehaviorMetricsStreamPayload = {
  application_id: number;
  time_on_page: number;
  buttons_clicked: string;
  cursor_positions: Array<{ x: number; y: number; timestamp: number }>;
  return_frequency: number;
};

export type BehaviorMetricsRecord = {
  application_id: number;
  time_on_page_seconds: number;
  button_clicks: unknown;
  cursor_hover_zones: unknown;
  return_visits_count: number;
  technical_payload: Record<string, unknown>;
};

export const ADMIN_JWT_KEY = "autello_admin_jwt";

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type RegistrationOpenResponse = {
  registration_open: boolean;
};

export type AdminUserPublic = {
  id: number;
  username: string;
  created_at: string;
};
