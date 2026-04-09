--
-- PostgreSQL database dump
--

\restrict GheRhvMr9RJi3MJHdua28ZH1i1efd0TqqEEmTvYEreVZCt68Pa36dGDwjEsYY2m

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: generate_report_number(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_report_number(p_org_id uuid) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_year TEXT;
    v_count INT;
BEGIN
    v_year := to_char(NOW(), 'YYYY');

    SELECT COUNT(*) + 1 INTO v_count
    FROM delivery_reports
    WHERE organization_id = p_org_id
      AND report_number IS NOT NULL
      AND report_number LIKE v_year || '-%';

    RETURN v_year || '-' || lpad(v_count::TEXT, 3, '0');
END;
$$;


--
-- Name: get_user_org_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_org_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    SELECT organization_id FROM users WHERE id = auth.uid();
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    _org_id UUID;
    _provider TEXT;
BEGIN
    _org_id := (NEW.raw_user_meta_data->>'organization_id')::uuid;
    _provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');

    -- Skip auto-insert if no organization_id in metadata.
    IF _org_id IS NULL THEN
        RETURN NEW;
    END IF;

    INSERT INTO public.users (id, organization_id, email, full_name, role, avatar_url, provider)
    VALUES (
        NEW.id,
        _org_id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'inspector'),
        NEW.raw_user_meta_data->>'avatar_url',
        _provider
    );
    RETURN NEW;
END;
$$;


--
-- Name: set_report_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_report_number() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.report_number IS NULL THEN
        NEW.report_number := generate_report_number(NEW.organization_id);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: apartments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.apartments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    building_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    number text NOT NULL,
    floor integer,
    rooms_count numeric(3,1),
    apartment_type text DEFAULT 'regular'::text,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT apartments_apartment_type_check CHECK ((apartment_type = ANY (ARRAY['regular'::text, 'garden'::text, 'penthouse'::text, 'duplex'::text, 'studio'::text]))),
    CONSTRAINT apartments_number_check CHECK ((char_length(number) >= 1)),
    CONSTRAINT apartments_rooms_count_check CHECK (((rooms_count IS NULL) OR (rooms_count > (0)::numeric))),
    CONSTRAINT apartments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'delivered'::text, 'completed'::text])))
);


--
-- Name: buildings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buildings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    floors_count integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT buildings_floors_count_check CHECK (((floors_count IS NULL) OR (floors_count > 0))),
    CONSTRAINT buildings_name_check CHECK ((char_length(name) >= 1))
);


--
-- Name: checklist_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid NOT NULL,
    name text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT checklist_categories_name_check CHECK ((char_length(name) >= 1))
);


--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    description text NOT NULL,
    default_severity text DEFAULT 'medium'::text NOT NULL,
    requires_photo boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT checklist_items_default_severity_check CHECK ((default_severity = ANY (ARRAY['critical'::text, 'medium'::text, 'low'::text]))),
    CONSTRAINT checklist_items_description_check CHECK ((char_length(description) >= 2))
);


--
-- Name: checklist_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_report_id uuid NOT NULL,
    checklist_item_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    result text NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT checklist_results_result_check CHECK ((result = ANY (ARRAY['pass'::text, 'fail'::text, 'na'::text])))
);


--
-- Name: checklist_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    name text NOT NULL,
    report_type text NOT NULL,
    is_global boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT checklist_templates_name_check CHECK ((char_length(name) >= 1)),
    CONSTRAINT checklist_templates_report_type_check CHECK ((report_type = ANY (ARRAY['delivery'::text, 'bedek_bait'::text, 'supervision'::text, 'leak_detection'::text, 'public_areas'::text])))
);


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    phone text,
    email text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT clients_name_check CHECK ((char_length(name) >= 1)),
    CONSTRAINT clients_phone_check CHECK (((phone IS NULL) OR (phone ~ '^0[2-9]\d{7,8}$'::text)))
);


--
-- Name: defect_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defect_library (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid,
    description text NOT NULL,
    category text,
    default_severity text DEFAULT 'medium'::text NOT NULL,
    standard_reference text,
    is_global boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    source text DEFAULT 'system'::text,
    title text,
    location text,
    standard text,
    standard_description text,
    recommendation text,
    cost numeric(10,2),
    cost_unit text DEFAULT 'fixed'::text,
    usage_count integer DEFAULT 0,
    last_used_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT defect_library_cost_unit_check CHECK (((cost_unit IS NULL) OR (cost_unit = ANY (ARRAY['fixed'::text, 'sqm'::text, 'lm'::text, 'unit'::text, 'day'::text])))),
    CONSTRAINT defect_library_default_severity_check CHECK ((default_severity = ANY (ARRAY['critical'::text, 'medium'::text, 'low'::text]))),
    CONSTRAINT defect_library_description_check CHECK ((char_length(description) >= 2)),
    CONSTRAINT defect_library_source_check CHECK (((source IS NULL) OR (source = ANY (ARRAY['system'::text, 'user'::text]))))
);


--
-- Name: COLUMN defect_library.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.user_id IS 'Owner user (NULL = org-wide or global)';


--
-- Name: COLUMN defect_library.source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.source IS 'system (seeded) or user (user-created)';


--
-- Name: COLUMN defect_library.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.title IS 'Short title for the library item';


--
-- Name: COLUMN defect_library.location; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.location IS 'Default location/room suggestion';


--
-- Name: COLUMN defect_library.standard; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.standard IS 'Standard name (e.g., ת"י 1205)';


--
-- Name: COLUMN defect_library.standard_description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.standard_description IS 'Human description of the standard';


--
-- Name: COLUMN defect_library.recommendation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.recommendation IS 'Default recommendation text';


--
-- Name: COLUMN defect_library.cost; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.cost IS 'Default estimated repair cost';


--
-- Name: COLUMN defect_library.cost_unit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.cost_unit IS 'Cost unit: fixed | sqm | lm | unit | day';


--
-- Name: COLUMN defect_library.usage_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.usage_count IS 'Number of times this library item was used';


--
-- Name: COLUMN defect_library.last_used_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_library.last_used_at IS 'Last time this library item was used';


--
-- Name: defect_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defect_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    defect_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    image_url text NOT NULL,
    thumbnail_url text,
    annotations jsonb DEFAULT '[]'::jsonb NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    annotations_json jsonb,
    caption text
);


--
-- Name: COLUMN defect_photos.annotations_json; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_photos.annotations_json IS 'Non-destructive annotation layer (arrows, circles, underlines, text) as JSON. Original photo unchanged.';


--
-- Name: COLUMN defect_photos.caption; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defect_photos.caption IS 'Photo caption/description for PDF reports';


--
-- Name: defects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_report_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    checklist_result_id uuid,
    description text NOT NULL,
    room text,
    category text,
    severity text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    source text DEFAULT 'checklist'::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    source_defect_id uuid,
    review_status text,
    review_note text,
    standard_ref text,
    recommendation text,
    notes text,
    cost numeric(10,2),
    cost_unit text,
    CONSTRAINT defects_description_check CHECK ((char_length(description) >= 2)),
    CONSTRAINT defects_review_status_check CHECK ((review_status = ANY (ARRAY['pending_review'::text, 'fixed'::text, 'not_fixed'::text, 'partially_fixed'::text]))),
    CONSTRAINT defects_severity_check CHECK ((severity = ANY (ARRAY['critical'::text, 'medium'::text, 'low'::text]))),
    CONSTRAINT defects_source_check CHECK ((source = ANY (ARRAY['checklist'::text, 'manual'::text, 'library'::text, 'inherited'::text]))),
    CONSTRAINT defects_status_check CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'fixed'::text, 'not_fixed'::text])))
);


--
-- Name: COLUMN defects.source_defect_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.source_defect_id IS 'Reference to original defect from previous round';


--
-- Name: COLUMN defects.review_status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.review_status IS 'Review status for inherited defects in round 2';


--
-- Name: COLUMN defects.review_note; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.review_note IS 'Inspector note on review status change';


--
-- Name: COLUMN defects.standard_ref; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.standard_ref IS 'Israeli standard reference (e.g., ת"י 1205.1)';


--
-- Name: COLUMN defects.recommendation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.recommendation IS 'Inspector recommendation for repair';


--
-- Name: COLUMN defects.notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.notes IS 'Additional inspector notes';


--
-- Name: COLUMN defects.cost; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.cost IS 'Estimated repair cost';


--
-- Name: COLUMN defects.cost_unit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.defects.cost_unit IS 'Cost unit type: fixed, per_unit, etc.';


--
-- Name: delivery_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delivery_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    apartment_id uuid,
    organization_id uuid NOT NULL,
    inspector_id uuid NOT NULL,
    checklist_template_id uuid,
    report_type text DEFAULT 'delivery'::text NOT NULL,
    round_number integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    tenant_name text,
    tenant_phone text,
    tenant_email text,
    notes text,
    pdf_url text,
    report_date timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    previous_round_id uuid,
    project_name_freetext text,
    apartment_label_freetext text,
    checklist_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    report_number text,
    client_name text,
    client_phone text,
    client_email text,
    client_id_number text,
    property_type text,
    property_area numeric(8,2),
    property_floor integer,
    property_description text,
    report_content jsonb DEFAULT '{}'::jsonb NOT NULL,
    pdf_draft_url text,
    weather_conditions text,
    contractor_name text,
    contractor_phone text,
    inspector_full_name_snapshot text,
    inspector_license_number_snapshot text,
    inspector_professional_title_snapshot text,
    inspector_education_snapshot text,
    inspector_signature_url_snapshot text,
    inspector_stamp_url_snapshot text,
    inspector_phone_snapshot text,
    inspector_email_snapshot text,
    organization_name_snapshot text,
    organization_logo_url_snapshot text,
    organization_legal_name_snapshot text,
    organization_tax_id_snapshot text,
    organization_address_snapshot text,
    organization_phone_snapshot text,
    organization_email_snapshot text,
    organization_legal_disclaimer_snapshot text,
    CONSTRAINT delivery_reports_report_type_check CHECK ((report_type = ANY (ARRAY['delivery'::text, 'bedek_bait'::text, 'supervision'::text, 'leak_detection'::text, 'public_areas'::text]))),
    CONSTRAINT delivery_reports_round_number_check CHECK ((round_number > 0)),
    CONSTRAINT delivery_reports_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'in_progress'::text, 'completed'::text, 'sent'::text]))),
    CONSTRAINT delivery_reports_tenant_phone_check CHECK (((tenant_phone IS NULL) OR (tenant_phone ~ '^0[2-9]\d{7,8}$'::text)))
);


--
-- Name: COLUMN delivery_reports.previous_round_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.previous_round_id IS 'Links round 2 report to round 1 report';


--
-- Name: COLUMN delivery_reports.project_name_freetext; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.project_name_freetext IS 'Free-text project name when not linked to a DB project';


--
-- Name: COLUMN delivery_reports.apartment_label_freetext; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.apartment_label_freetext IS 'Free-text apartment label when not linked to a DB apartment';


--
-- Name: COLUMN delivery_reports.checklist_state; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.checklist_state IS 'Stores checklist progress: { statuses: {itemId: status}, defectTexts: {itemId: text}, bathTypes: {roomId: type} }';


--
-- Name: COLUMN delivery_reports.report_number; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.report_number IS 'Formatted report number: YYYY-NNN (per org per year)';


--
-- Name: COLUMN delivery_reports.report_content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.report_content IS 'JSONB: declaration, scope, limitations, tools, general_notes, property_description';


--
-- Name: COLUMN delivery_reports.pdf_draft_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.pdf_draft_url IS 'Local URI of draft PDF (before finalization)';


--
-- Name: COLUMN delivery_reports.inspector_full_name_snapshot; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.inspector_full_name_snapshot IS 'Iron Rule: inspector name frozen at report creation';


--
-- Name: COLUMN delivery_reports.organization_name_snapshot; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.delivery_reports.organization_name_snapshot IS 'Iron Rule: org name frozen at report creation';


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    notification_type text NOT NULL,
    title text NOT NULL,
    body text,
    is_read boolean DEFAULT false NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT notifications_notification_type_check CHECK ((notification_type = ANY (ARRAY['app_update'::text, 'system_message'::text, 'reminder'::text])))
);


--
-- Name: organization_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    invited_by uuid NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'inspector'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_invitations_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'project_manager'::text, 'inspector'::text]))),
    CONSTRAINT organization_invitations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'expired'::text])))
);


--
-- Name: organization_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'inspector'::text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_members_role_check CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'project_manager'::text, 'inspector'::text])))
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo_url text,
    settings jsonb DEFAULT '{"defaultLanguage": "he", "defaultReportType": "delivery", "pdfBrandingEnabled": true}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    mode text DEFAULT 'solo'::text NOT NULL,
    CONSTRAINT organizations_mode_check CHECK ((mode = ANY (ARRAY['solo'::text, 'team'::text]))),
    CONSTRAINT organizations_name_check CHECK ((char_length(name) >= 1))
);


--
-- Name: COLUMN organizations.mode; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.organizations.mode IS 'solo = single inspector, team = multi-user org';


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    address text,
    city text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    report_type_default text DEFAULT 'delivery'::text NOT NULL,
    default_checklist_template_id uuid,
    CONSTRAINT projects_name_check CHECK ((char_length(name) >= 1)),
    CONSTRAINT projects_report_type_default_check CHECK ((report_type_default = ANY (ARRAY['delivery'::text, 'bedek_bait'::text]))),
    CONSTRAINT projects_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'archived'::text])))
);


--
-- Name: COLUMN projects.report_type_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.projects.report_type_default IS 'Default report type for new reports in this project';


--
-- Name: COLUMN projects.default_checklist_template_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.projects.default_checklist_template_id IS 'Default checklist template for delivery reports in this project';


--
-- Name: report_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_report_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    details jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT report_log_action_check CHECK ((action = ANY (ARRAY['pdf_generated'::text, 'status_completed'::text, 'status_draft'::text, 'status_in_progress'::text, 'defect_added'::text, 'defect_updated'::text, 'defect_deleted'::text, 'photos_updated'::text, 'whatsapp_sent'::text])))
);


--
-- Name: signatures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signatures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    delivery_report_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    signer_type text NOT NULL,
    signer_name text NOT NULL,
    image_url text NOT NULL,
    signed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT signatures_signer_name_check CHECK ((char_length(signer_name) >= 1)),
    CONSTRAINT signatures_signer_type_check CHECK ((signer_type = ANY (ARRAY['inspector'::text, 'tenant'::text])))
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT teams_name_check CHECK ((char_length(name) >= 1))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    organization_id uuid,
    email text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'inspector'::text NOT NULL,
    phone text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    signature_url text,
    stamp_url text,
    first_name text,
    profession text,
    inspector_settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    avatar_url text,
    provider text DEFAULT 'email'::text NOT NULL,
    CONSTRAINT users_full_name_check CHECK ((char_length(full_name) >= 0)),
    CONSTRAINT users_phone_check CHECK (((phone IS NULL) OR (phone ~ '^0[2-9]\d{7,8}$'::text))),
    CONSTRAINT users_profession_check CHECK (((profession IS NULL) OR (profession = ANY (ARRAY['engineer'::text, 'constructor'::text, 'inspector'::text, 'project_manager'::text, 'architect'::text, 'building_technician'::text, 'site_manager'::text])))),
    CONSTRAINT users_provider_check CHECK ((provider = ANY (ARRAY['email'::text, 'google'::text, 'apple'::text]))),
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'project_manager'::text, 'inspector'::text])))
);


--
-- Name: COLUMN users.signature_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.signature_url IS 'URL to inspector signature PNG in storage';


--
-- Name: COLUMN users.stamp_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.stamp_url IS 'URL to inspector stamp/logo PNG in storage';


--
-- Name: COLUMN users.first_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.first_name IS 'First name for greeting display (שם פרטי)';


--
-- Name: COLUMN users.profession; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.profession IS 'Professional role selected during registration';


--
-- Name: COLUMN users.inspector_settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.inspector_settings IS 'JSONB: license_number, education, experience, company_name, company_logo_url, default_declaration, default_tools, default_limitations';


--
-- Name: apartments apartments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartments
    ADD CONSTRAINT apartments_pkey PRIMARY KEY (id);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (id);


--
-- Name: checklist_categories checklist_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_categories
    ADD CONSTRAINT checklist_categories_pkey PRIMARY KEY (id);


--
-- Name: checklist_items checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_pkey PRIMARY KEY (id);


--
-- Name: checklist_results checklist_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_results
    ADD CONSTRAINT checklist_results_pkey PRIMARY KEY (id);


--
-- Name: checklist_templates checklist_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_templates
    ADD CONSTRAINT checklist_templates_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: defect_library defect_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect_library
    ADD CONSTRAINT defect_library_pkey PRIMARY KEY (id);


--
-- Name: defect_photos defect_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect_photos
    ADD CONSTRAINT defect_photos_pkey PRIMARY KEY (id);


--
-- Name: defects defects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_pkey PRIMARY KEY (id);


--
-- Name: delivery_reports delivery_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_reports
    ADD CONSTRAINT delivery_reports_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: organization_invitations organization_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_pkey PRIMARY KEY (id);


--
-- Name: organization_members organization_members_organization_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_user_id_key UNIQUE (organization_id, user_id);


--
-- Name: organization_members organization_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: report_log report_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_log
    ADD CONSTRAINT report_log_pkey PRIMARY KEY (id);


--
-- Name: signatures signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_apartments_building; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_apartments_building ON public.apartments USING btree (building_id);


--
-- Name: idx_apartments_org_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_apartments_org_status ON public.apartments USING btree (organization_id, status);


--
-- Name: idx_buildings_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buildings_project ON public.buildings USING btree (project_id);


--
-- Name: idx_checklist_categories_template; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_checklist_categories_template ON public.checklist_categories USING btree (template_id);


--
-- Name: idx_checklist_items_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_checklist_items_category ON public.checklist_items USING btree (category_id);


--
-- Name: idx_checklist_results_report; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_checklist_results_report ON public.checklist_results USING btree (delivery_report_id);


--
-- Name: idx_checklist_results_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_checklist_results_unique ON public.checklist_results USING btree (delivery_report_id, checklist_item_id);


--
-- Name: idx_checklist_templates_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_checklist_templates_org ON public.checklist_templates USING btree (organization_id);


--
-- Name: idx_clients_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clients_org ON public.clients USING btree (organization_id);


--
-- Name: idx_defect_library_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defect_library_org ON public.defect_library USING btree (organization_id);


--
-- Name: idx_defect_library_search; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defect_library_search ON public.defect_library USING gin (to_tsvector('simple'::regconfig, description));


--
-- Name: idx_defect_photos_defect; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defect_photos_defect ON public.defect_photos USING btree (defect_id);


--
-- Name: idx_defects_org_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defects_org_status ON public.defects USING btree (organization_id, status);


--
-- Name: idx_defects_report; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defects_report ON public.defects USING btree (delivery_report_id);


--
-- Name: idx_defects_source_defect; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defects_source_defect ON public.defects USING btree (source_defect_id);


--
-- Name: idx_delivery_reports_apartment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_delivery_reports_apartment ON public.delivery_reports USING btree (apartment_id);


--
-- Name: idx_delivery_reports_inspector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_delivery_reports_inspector ON public.delivery_reports USING btree (inspector_id);


--
-- Name: idx_delivery_reports_org_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_delivery_reports_org_status ON public.delivery_reports USING btree (organization_id, status);


--
-- Name: idx_delivery_reports_previous_round; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_delivery_reports_previous_round ON public.delivery_reports USING btree (previous_round_id);


--
-- Name: idx_notifications_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_org ON public.notifications USING btree (organization_id);


--
-- Name: idx_notifications_user_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_unread ON public.notifications USING btree (user_id, is_read) WHERE (is_read = false);


--
-- Name: idx_organization_invitations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_invitations_email ON public.organization_invitations USING btree (email);


--
-- Name: idx_organization_invitations_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_invitations_org ON public.organization_invitations USING btree (organization_id);


--
-- Name: idx_organization_members_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_members_org ON public.organization_members USING btree (organization_id);


--
-- Name: idx_organization_members_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_organization_members_user ON public.organization_members USING btree (user_id);


--
-- Name: idx_projects_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_projects_org ON public.projects USING btree (organization_id);


--
-- Name: idx_report_log_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_report_log_org ON public.report_log USING btree (organization_id);


--
-- Name: idx_report_log_report; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_report_log_report ON public.report_log USING btree (delivery_report_id);


--
-- Name: idx_signatures_report; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_signatures_report ON public.signatures USING btree (delivery_report_id);


--
-- Name: idx_signatures_unique_per_report; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_signatures_unique_per_report ON public.signatures USING btree (delivery_report_id, signer_type);


--
-- Name: idx_teams_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_teams_org ON public.teams USING btree (organization_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_org; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_org ON public.users USING btree (organization_id);


--
-- Name: apartments set_apartments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_apartments_updated_at BEFORE UPDATE ON public.apartments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: buildings set_buildings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: checklist_results set_checklist_results_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_checklist_results_updated_at BEFORE UPDATE ON public.checklist_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: checklist_templates set_checklist_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_checklist_templates_updated_at BEFORE UPDATE ON public.checklist_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: clients set_clients_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: defect_library set_defect_library_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_defect_library_updated_at BEFORE UPDATE ON public.defect_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: defects set_defects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_defects_updated_at BEFORE UPDATE ON public.defects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: delivery_reports set_delivery_reports_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_delivery_reports_updated_at BEFORE UPDATE ON public.delivery_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: organization_invitations set_organization_invitations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_organization_invitations_updated_at BEFORE UPDATE ON public.organization_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: organization_members set_organization_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_organization_members_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: organizations set_organizations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: projects set_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: teams set_teams_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: delivery_reports trg_set_report_number; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_report_number BEFORE INSERT ON public.delivery_reports FOR EACH ROW EXECUTE FUNCTION public.set_report_number();


--
-- Name: apartments apartments_building_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartments
    ADD CONSTRAINT apartments_building_id_fkey FOREIGN KEY (building_id) REFERENCES public.buildings(id) ON DELETE CASCADE;


--
-- Name: apartments apartments_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartments
    ADD CONSTRAINT apartments_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: buildings buildings_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: buildings buildings_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: checklist_categories checklist_categories_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_categories
    ADD CONSTRAINT checklist_categories_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.checklist_templates(id) ON DELETE CASCADE;


--
-- Name: checklist_items checklist_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.checklist_categories(id) ON DELETE CASCADE;


--
-- Name: checklist_results checklist_results_checklist_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_results
    ADD CONSTRAINT checklist_results_checklist_item_id_fkey FOREIGN KEY (checklist_item_id) REFERENCES public.checklist_items(id);


--
-- Name: checklist_results checklist_results_delivery_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_results
    ADD CONSTRAINT checklist_results_delivery_report_id_fkey FOREIGN KEY (delivery_report_id) REFERENCES public.delivery_reports(id) ON DELETE CASCADE;


--
-- Name: checklist_results checklist_results_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_results
    ADD CONSTRAINT checklist_results_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: checklist_templates checklist_templates_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_templates
    ADD CONSTRAINT checklist_templates_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: clients clients_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: defect_library defect_library_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect_library
    ADD CONSTRAINT defect_library_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: defect_library defect_library_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect_library
    ADD CONSTRAINT defect_library_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: defect_photos defect_photos_defect_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect_photos
    ADD CONSTRAINT defect_photos_defect_id_fkey FOREIGN KEY (defect_id) REFERENCES public.defects(id) ON DELETE CASCADE;


--
-- Name: defect_photos defect_photos_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect_photos
    ADD CONSTRAINT defect_photos_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: defects defects_checklist_result_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_checklist_result_id_fkey FOREIGN KEY (checklist_result_id) REFERENCES public.checklist_results(id);


--
-- Name: defects defects_delivery_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_delivery_report_id_fkey FOREIGN KEY (delivery_report_id) REFERENCES public.delivery_reports(id) ON DELETE CASCADE;


--
-- Name: defects defects_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: defects defects_source_defect_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_source_defect_id_fkey FOREIGN KEY (source_defect_id) REFERENCES public.defects(id) ON DELETE SET NULL;


--
-- Name: delivery_reports delivery_reports_apartment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_reports
    ADD CONSTRAINT delivery_reports_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES public.apartments(id);


--
-- Name: delivery_reports delivery_reports_checklist_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_reports
    ADD CONSTRAINT delivery_reports_checklist_template_id_fkey FOREIGN KEY (checklist_template_id) REFERENCES public.checklist_templates(id);


--
-- Name: delivery_reports delivery_reports_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_reports
    ADD CONSTRAINT delivery_reports_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.users(id);


--
-- Name: delivery_reports delivery_reports_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_reports
    ADD CONSTRAINT delivery_reports_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: delivery_reports delivery_reports_previous_round_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_reports
    ADD CONSTRAINT delivery_reports_previous_round_id_fkey FOREIGN KEY (previous_round_id) REFERENCES public.delivery_reports(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: organization_invitations organization_invitations_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(id);


--
-- Name: organization_invitations organization_invitations_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invitations
    ADD CONSTRAINT organization_invitations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_default_checklist_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_default_checklist_template_id_fkey FOREIGN KEY (default_checklist_template_id) REFERENCES public.checklist_templates(id) ON DELETE SET NULL;


--
-- Name: projects projects_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: report_log report_log_delivery_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_log
    ADD CONSTRAINT report_log_delivery_report_id_fkey FOREIGN KEY (delivery_report_id) REFERENCES public.delivery_reports(id) ON DELETE CASCADE;


--
-- Name: report_log report_log_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_log
    ADD CONSTRAINT report_log_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: report_log report_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_log
    ADD CONSTRAINT report_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: signatures signatures_delivery_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_delivery_report_id_fkey FOREIGN KEY (delivery_report_id) REFERENCES public.delivery_reports(id) ON DELETE CASCADE;


--
-- Name: signatures signatures_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: teams teams_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: users users_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: apartments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

--
-- Name: apartments apartments_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY apartments_delete ON public.apartments FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: apartments apartments_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY apartments_insert ON public.apartments FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: apartments apartments_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY apartments_select ON public.apartments FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: apartments apartments_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY apartments_update ON public.apartments FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: buildings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

--
-- Name: buildings buildings_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY buildings_delete ON public.buildings FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: buildings buildings_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY buildings_insert ON public.buildings FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: buildings buildings_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY buildings_select ON public.buildings FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: buildings buildings_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY buildings_update ON public.buildings FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: checklist_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.checklist_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: checklist_categories checklist_categories_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_categories_delete ON public.checklist_categories FOR DELETE USING (((template_id IN ( SELECT checklist_templates.id
   FROM public.checklist_templates
  WHERE (checklist_templates.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_categories checklist_categories_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_categories_insert ON public.checklist_categories FOR INSERT WITH CHECK (((template_id IN ( SELECT checklist_templates.id
   FROM public.checklist_templates
  WHERE (checklist_templates.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_categories checklist_categories_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_categories_select ON public.checklist_categories FOR SELECT USING ((template_id IN ( SELECT checklist_templates.id
   FROM public.checklist_templates
  WHERE ((checklist_templates.is_global = true) OR (checklist_templates.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid())))))));


--
-- Name: checklist_categories checklist_categories_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_categories_update ON public.checklist_categories FOR UPDATE USING (((template_id IN ( SELECT checklist_templates.id
   FROM public.checklist_templates
  WHERE (checklist_templates.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

--
-- Name: checklist_items checklist_items_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_items_delete ON public.checklist_items FOR DELETE USING (((category_id IN ( SELECT cc.id
   FROM (public.checklist_categories cc
     JOIN public.checklist_templates ct ON ((cc.template_id = ct.id)))
  WHERE (ct.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_items checklist_items_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_items_insert ON public.checklist_items FOR INSERT WITH CHECK (((category_id IN ( SELECT cc.id
   FROM (public.checklist_categories cc
     JOIN public.checklist_templates ct ON ((cc.template_id = ct.id)))
  WHERE (ct.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_items checklist_items_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_items_select ON public.checklist_items FOR SELECT USING ((category_id IN ( SELECT cc.id
   FROM (public.checklist_categories cc
     JOIN public.checklist_templates ct ON ((cc.template_id = ct.id)))
  WHERE ((ct.is_global = true) OR (ct.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid())))))));


--
-- Name: checklist_items checklist_items_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_items_update ON public.checklist_items FOR UPDATE USING (((category_id IN ( SELECT cc.id
   FROM (public.checklist_categories cc
     JOIN public.checklist_templates ct ON ((cc.template_id = ct.id)))
  WHERE (ct.organization_id = ( SELECT users.organization_id
           FROM public.users
          WHERE (users.id = auth.uid()))))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.checklist_results ENABLE ROW LEVEL SECURITY;

--
-- Name: checklist_results checklist_results_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_results_delete ON public.checklist_results FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_results checklist_results_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_results_insert ON public.checklist_results FOR INSERT WITH CHECK ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: checklist_results checklist_results_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_results_select ON public.checklist_results FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: checklist_results checklist_results_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_results_update ON public.checklist_results FOR UPDATE USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: checklist_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: checklist_templates checklist_templates_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_templates_delete ON public.checklist_templates FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_templates checklist_templates_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_templates_insert ON public.checklist_templates FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: checklist_templates checklist_templates_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_templates_select ON public.checklist_templates FOR SELECT USING (((is_global = true) OR (organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid())))));


--
-- Name: checklist_templates checklist_templates_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY checklist_templates_update ON public.checklist_templates FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: clients clients_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY clients_delete ON public.clients FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: clients clients_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY clients_insert ON public.clients FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: clients clients_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY clients_select ON public.clients FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: clients clients_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY clients_update ON public.clients FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: defect_library; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.defect_library ENABLE ROW LEVEL SECURITY;

--
-- Name: defect_library defect_library_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_library_delete ON public.defect_library FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: defect_library defect_library_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_library_insert ON public.defect_library FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: defect_library defect_library_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_library_select ON public.defect_library FOR SELECT USING (((is_global = true) OR (organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid())))));


--
-- Name: defect_library defect_library_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_library_update ON public.defect_library FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: defect_photos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.defect_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: defect_photos defect_photos_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_photos_delete ON public.defect_photos FOR DELETE USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: defect_photos defect_photos_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_photos_insert ON public.defect_photos FOR INSERT WITH CHECK ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: defect_photos defect_photos_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defect_photos_select ON public.defect_photos FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: defects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.defects ENABLE ROW LEVEL SECURITY;

--
-- Name: defects defects_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defects_delete ON public.defects FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: defects defects_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defects_insert ON public.defects FOR INSERT WITH CHECK ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: defects defects_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defects_select ON public.defects FOR SELECT USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text]))))) OR (delivery_report_id IN ( SELECT delivery_reports.id
   FROM public.delivery_reports
  WHERE (delivery_reports.inspector_id = auth.uid()))))));


--
-- Name: defects defects_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY defects_update ON public.defects FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text]))))) OR (delivery_report_id IN ( SELECT delivery_reports.id
   FROM public.delivery_reports
  WHERE (delivery_reports.inspector_id = auth.uid()))))));


--
-- Name: delivery_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.delivery_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: delivery_reports delivery_reports_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY delivery_reports_delete ON public.delivery_reports FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: delivery_reports delivery_reports_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY delivery_reports_insert ON public.delivery_reports FOR INSERT WITH CHECK ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: delivery_reports delivery_reports_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY delivery_reports_select ON public.delivery_reports FOR SELECT USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text]))))) OR (inspector_id = auth.uid()))));


--
-- Name: delivery_reports delivery_reports_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY delivery_reports_update ON public.delivery_reports FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text]))))) OR (inspector_id = auth.uid()))));


--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications notifications_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_delete ON public.notifications FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: notifications notifications_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_insert ON public.notifications FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: notifications notifications_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_select ON public.notifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: notifications notifications_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY notifications_update ON public.notifications FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: organization_invitations org_invitations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_invitations_delete ON public.organization_invitations FOR DELETE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: organization_invitations org_invitations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_invitations_insert ON public.organization_invitations FOR INSERT WITH CHECK (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: organization_invitations org_invitations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_invitations_select ON public.organization_invitations FOR SELECT USING ((organization_id = public.get_user_org_id()));


--
-- Name: organization_invitations org_invitations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_invitations_update ON public.organization_invitations FOR UPDATE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: organization_members org_members_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_delete ON public.organization_members FOR DELETE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: organization_members org_members_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_insert ON public.organization_members FOR INSERT WITH CHECK (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: organization_members org_members_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_select ON public.organization_members FOR SELECT USING ((organization_id = public.get_user_org_id()));


--
-- Name: organization_members org_members_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_members_update ON public.organization_members FOR UPDATE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: organization_invitations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations organizations_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_insert ON public.organizations FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: organizations organizations_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_select ON public.organizations FOR SELECT USING ((id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: organizations organizations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_update ON public.organizations FOR UPDATE USING (((id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: projects projects_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY projects_delete ON public.projects FOR DELETE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text))))));


--
-- Name: projects projects_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY projects_insert ON public.projects FOR INSERT WITH CHECK (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: projects projects_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY projects_select ON public.projects FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: projects projects_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY projects_update ON public.projects FOR UPDATE USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text])))))));


--
-- Name: report_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.report_log ENABLE ROW LEVEL SECURITY;

--
-- Name: report_log report_log_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY report_log_insert ON public.report_log FOR INSERT WITH CHECK ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: report_log report_log_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY report_log_select ON public.report_log FOR SELECT USING (((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))) AND ((EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND (users.role = ANY (ARRAY['admin'::text, 'project_manager'::text]))))) OR (delivery_report_id IN ( SELECT delivery_reports.id
   FROM public.delivery_reports
  WHERE (delivery_reports.inspector_id = auth.uid()))))));


--
-- Name: signatures; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

--
-- Name: signatures signatures_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY signatures_insert ON public.signatures FOR INSERT WITH CHECK ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: signatures signatures_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY signatures_select ON public.signatures FOR SELECT USING ((organization_id = ( SELECT users.organization_id
   FROM public.users
  WHERE (users.id = auth.uid()))));


--
-- Name: teams; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

--
-- Name: teams teams_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY teams_delete ON public.teams FOR DELETE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: teams teams_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY teams_insert ON public.teams FOR INSERT WITH CHECK (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: teams teams_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY teams_select ON public.teams FOR SELECT USING ((organization_id = public.get_user_org_id()));


--
-- Name: teams teams_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY teams_update ON public.teams FOR UPDATE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_delete ON public.users FOR DELETE USING (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: users users_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_insert ON public.users FOR INSERT WITH CHECK (((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text))))));


--
-- Name: users users_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_insert_own ON public.users FOR INSERT WITH CHECK ((id = auth.uid()));


--
-- Name: users users_select_org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select_org ON public.users FOR SELECT USING ((organization_id = public.get_user_org_id()));


--
-- Name: users users_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select_own ON public.users FOR SELECT USING ((id = auth.uid()));


--
-- Name: users users_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_update ON public.users FOR UPDATE USING (((id = auth.uid()) OR ((organization_id = public.get_user_org_id()) AND (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = auth.uid()) AND (u.role = 'admin'::text)))))));


--
-- PostgreSQL database dump complete
--

\unrestrict GheRhvMr9RJi3MJHdua28ZH1i1efd0TqqEEmTvYEreVZCt68Pa36dGDwjEsYY2m

