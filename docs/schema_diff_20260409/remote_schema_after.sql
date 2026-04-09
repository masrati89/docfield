Initialising login role...
Dumping schemas from remote database...



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."generate_report_number"("p_org_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql"
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


ALTER FUNCTION "public"."generate_report_number"("p_org_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_org_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
    SELECT organization_id FROM users WHERE id = auth.uid();
$$;


ALTER FUNCTION "public"."get_user_org_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
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


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_report_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.report_number IS NULL THEN
        NEW.report_number := generate_report_number(NEW.organization_id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_report_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."apartments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "building_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "number" "text" NOT NULL,
    "floor" integer,
    "rooms_count" numeric(3,1),
    "apartment_type" "text" DEFAULT 'regular'::"text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "apartments_apartment_type_check" CHECK (("apartment_type" = ANY (ARRAY['regular'::"text", 'garden'::"text", 'penthouse'::"text", 'duplex'::"text", 'studio'::"text"]))),
    CONSTRAINT "apartments_number_check" CHECK (("char_length"("number") >= 1)),
    CONSTRAINT "apartments_rooms_count_check" CHECK ((("rooms_count" IS NULL) OR ("rooms_count" > (0)::numeric))),
    CONSTRAINT "apartments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'delivered'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."apartments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."buildings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "floors_count" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "buildings_floors_count_check" CHECK ((("floors_count" IS NULL) OR ("floors_count" > 0))),
    CONSTRAINT "buildings_name_check" CHECK (("char_length"("name") >= 1))
);


ALTER TABLE "public"."buildings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "template_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checklist_categories_name_check" CHECK (("char_length"("name") >= 1))
);


ALTER TABLE "public"."checklist_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "default_severity" "text" DEFAULT 'medium'::"text" NOT NULL,
    "requires_photo" boolean DEFAULT false NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checklist_items_default_severity_check" CHECK (("default_severity" = ANY (ARRAY['critical'::"text", 'medium'::"text", 'low'::"text"]))),
    CONSTRAINT "checklist_items_description_check" CHECK (("char_length"("description") >= 2))
);


ALTER TABLE "public"."checklist_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "delivery_report_id" "uuid" NOT NULL,
    "checklist_item_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "result" "text" NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checklist_results_result_check" CHECK (("result" = ANY (ARRAY['pass'::"text", 'fail'::"text", 'na'::"text"])))
);


ALTER TABLE "public"."checklist_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid",
    "name" "text" NOT NULL,
    "report_type" "text" NOT NULL,
    "is_global" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checklist_templates_name_check" CHECK (("char_length"("name") >= 1)),
    CONSTRAINT "checklist_templates_report_type_check" CHECK (("report_type" = ANY (ARRAY['delivery'::"text", 'bedek_bait'::"text", 'supervision'::"text", 'leak_detection'::"text", 'public_areas'::"text"])))
);


ALTER TABLE "public"."checklist_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "phone" "text",
    "email" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "clients_name_check" CHECK (("char_length"("name") >= 1)),
    CONSTRAINT "clients_phone_check" CHECK ((("phone" IS NULL) OR ("phone" ~ '^0[2-9]\d{7,8}$'::"text")))
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."defect_library" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid",
    "description" "text" NOT NULL,
    "category" "text",
    "default_severity" "text" DEFAULT 'medium'::"text" NOT NULL,
    "standard_reference" "text",
    "is_global" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "source" "text" DEFAULT 'system'::"text",
    "title" "text",
    "location" "text",
    "standard" "text",
    "standard_description" "text",
    "recommendation" "text",
    "cost" numeric(10,2),
    "cost_unit" "text" DEFAULT 'fixed'::"text",
    "usage_count" integer DEFAULT 0,
    "last_used_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "defect_library_cost_unit_check" CHECK (("cost_unit" = ANY (ARRAY['fixed'::"text", 'sqm'::"text", 'lm'::"text", 'unit'::"text", 'day'::"text"]))),
    CONSTRAINT "defect_library_default_severity_check" CHECK (("default_severity" = ANY (ARRAY['critical'::"text", 'medium'::"text", 'low'::"text"]))),
    CONSTRAINT "defect_library_description_check" CHECK (("char_length"("description") >= 2)),
    CONSTRAINT "defect_library_source_check" CHECK (("source" = ANY (ARRAY['system'::"text", 'user'::"text"])))
);


ALTER TABLE "public"."defect_library" OWNER TO "postgres";


COMMENT ON COLUMN "public"."defect_library"."user_id" IS 'Owner user (NULL = org-wide or global)';



COMMENT ON COLUMN "public"."defect_library"."source" IS 'system (seeded) or user (user-created)';



COMMENT ON COLUMN "public"."defect_library"."title" IS 'Short title for the library item';



COMMENT ON COLUMN "public"."defect_library"."location" IS 'Default location/room suggestion';



COMMENT ON COLUMN "public"."defect_library"."standard" IS 'Standard name (e.g., ת"י 1205)';



COMMENT ON COLUMN "public"."defect_library"."standard_description" IS 'Human description of the standard';



COMMENT ON COLUMN "public"."defect_library"."recommendation" IS 'Default recommendation text';



COMMENT ON COLUMN "public"."defect_library"."cost" IS 'Default estimated repair cost';



COMMENT ON COLUMN "public"."defect_library"."cost_unit" IS 'Cost unit: fixed | sqm | lm | unit | day';



COMMENT ON COLUMN "public"."defect_library"."usage_count" IS 'Number of times this library item was used';



COMMENT ON COLUMN "public"."defect_library"."last_used_at" IS 'Last time this library item was used';



CREATE TABLE IF NOT EXISTS "public"."defect_photos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "defect_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "thumbnail_url" "text",
    "annotations" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "caption" "text",
    "annotations_json" "jsonb"
);


ALTER TABLE "public"."defect_photos" OWNER TO "postgres";


COMMENT ON COLUMN "public"."defect_photos"."caption" IS 'Photo caption/description for PDF reports';



COMMENT ON COLUMN "public"."defect_photos"."annotations_json" IS 'Non-destructive annotation layer (arrows, circles, underlines, text) as JSON. Original photo unchanged.';



CREATE TABLE IF NOT EXISTS "public"."defects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "delivery_report_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "checklist_result_id" "uuid",
    "description" "text" NOT NULL,
    "room" "text",
    "category" "text",
    "severity" "text" NOT NULL,
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "source" "text" DEFAULT 'checklist'::"text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_defect_id" "uuid",
    "review_status" "text",
    "review_note" "text",
    "standard_ref" "text",
    "recommendation" "text",
    "notes" "text",
    "cost" numeric(10,2),
    "cost_unit" "text",
    CONSTRAINT "defects_description_check" CHECK (("char_length"("description") >= 2)),
    CONSTRAINT "defects_review_status_check" CHECK (("review_status" = ANY (ARRAY['pending_review'::"text", 'fixed'::"text", 'not_fixed'::"text", 'partially_fixed'::"text"]))),
    CONSTRAINT "defects_severity_check" CHECK (("severity" = ANY (ARRAY['critical'::"text", 'medium'::"text", 'low'::"text"]))),
    CONSTRAINT "defects_source_check" CHECK (("source" = ANY (ARRAY['checklist'::"text", 'manual'::"text", 'library'::"text", 'inherited'::"text"]))),
    CONSTRAINT "defects_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'in_progress'::"text", 'fixed'::"text", 'not_fixed'::"text"])))
);


ALTER TABLE "public"."defects" OWNER TO "postgres";


COMMENT ON COLUMN "public"."defects"."source_defect_id" IS 'Reference to original defect from previous round';



COMMENT ON COLUMN "public"."defects"."review_status" IS 'Review status for inherited defects in round 2';



COMMENT ON COLUMN "public"."defects"."review_note" IS 'Inspector note on review status change';



COMMENT ON COLUMN "public"."defects"."standard_ref" IS 'Israeli standard reference (e.g., ת"י 1205.1)';



COMMENT ON COLUMN "public"."defects"."recommendation" IS 'Inspector recommendation for repair';



COMMENT ON COLUMN "public"."defects"."notes" IS 'Additional inspector notes';



COMMENT ON COLUMN "public"."defects"."cost" IS 'Estimated repair cost';



COMMENT ON COLUMN "public"."defects"."cost_unit" IS 'Cost unit type: fixed, per_unit, etc.';



CREATE TABLE IF NOT EXISTS "public"."delivery_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "apartment_id" "uuid",
    "organization_id" "uuid" NOT NULL,
    "inspector_id" "uuid" NOT NULL,
    "checklist_template_id" "uuid",
    "report_type" "text" DEFAULT 'delivery'::"text" NOT NULL,
    "round_number" integer DEFAULT 1 NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "tenant_name" "text",
    "tenant_phone" "text",
    "tenant_email" "text",
    "notes" "text",
    "pdf_url" "text",
    "report_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "previous_round_id" "uuid",
    "project_name_freetext" "text",
    "apartment_label_freetext" "text",
    "checklist_state" "jsonb" DEFAULT '{}'::"jsonb",
    "report_number" "text",
    "client_name" "text",
    "client_phone" "text",
    "client_email" "text",
    "client_id_number" "text",
    "property_type" "text",
    "property_area" numeric(8,2),
    "property_floor" integer,
    "property_description" "text",
    "report_content" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "pdf_draft_url" "text",
    "weather_conditions" "text",
    "contractor_name" "text",
    "contractor_phone" "text",
    "inspector_full_name_snapshot" "text",
    "inspector_license_number_snapshot" "text",
    "inspector_professional_title_snapshot" "text",
    "inspector_education_snapshot" "text",
    "inspector_signature_url_snapshot" "text",
    "inspector_stamp_url_snapshot" "text",
    "inspector_phone_snapshot" "text",
    "inspector_email_snapshot" "text",
    "organization_name_snapshot" "text",
    "organization_logo_url_snapshot" "text",
    "organization_legal_name_snapshot" "text",
    "organization_tax_id_snapshot" "text",
    "organization_address_snapshot" "text",
    "organization_phone_snapshot" "text",
    "organization_email_snapshot" "text",
    "organization_legal_disclaimer_snapshot" "text",
    CONSTRAINT "delivery_reports_report_type_check" CHECK (("report_type" = ANY (ARRAY['delivery'::"text", 'bedek_bait'::"text", 'supervision'::"text", 'leak_detection'::"text", 'public_areas'::"text"]))),
    CONSTRAINT "delivery_reports_round_number_check" CHECK (("round_number" > 0)),
    CONSTRAINT "delivery_reports_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'in_progress'::"text", 'completed'::"text", 'sent'::"text"]))),
    CONSTRAINT "delivery_reports_tenant_phone_check" CHECK ((("tenant_phone" IS NULL) OR ("tenant_phone" ~ '^0[2-9]\d{7,8}$'::"text")))
);


ALTER TABLE "public"."delivery_reports" OWNER TO "postgres";


COMMENT ON COLUMN "public"."delivery_reports"."previous_round_id" IS 'Links round 2 report to round 1 report';



COMMENT ON COLUMN "public"."delivery_reports"."project_name_freetext" IS 'Free-text project name when not linked to a DB project';



COMMENT ON COLUMN "public"."delivery_reports"."apartment_label_freetext" IS 'Free-text apartment label when not linked to a DB apartment';



COMMENT ON COLUMN "public"."delivery_reports"."report_number" IS 'Formatted report number: YYYY-NNN (per org per year)';



COMMENT ON COLUMN "public"."delivery_reports"."report_content" IS 'JSONB: declaration, scope, limitations, tools, general_notes, property_description';



COMMENT ON COLUMN "public"."delivery_reports"."pdf_draft_url" IS 'Local URI of draft PDF (before finalization)';



COMMENT ON COLUMN "public"."delivery_reports"."inspector_full_name_snapshot" IS 'Iron Rule: inspector name frozen at report creation';



COMMENT ON COLUMN "public"."delivery_reports"."organization_name_snapshot" IS 'Iron Rule: org name frozen at report creation';



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notification_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "body" "text",
    "is_read" boolean DEFAULT false NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "notifications_notification_type_check" CHECK (("notification_type" = ANY (ARRAY['app_update'::"text", 'system_message'::"text", 'reminder'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organization_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "invited_by" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "text" DEFAULT 'inspector'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "organization_invitations_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text", 'inspector'::"text"]))),
    CONSTRAINT "organization_invitations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'declined'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."organization_invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organization_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'inspector'::"text" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "organization_members_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'project_manager'::"text", 'inspector'::"text"])))
);


ALTER TABLE "public"."organization_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "logo_url" "text",
    "settings" "jsonb" DEFAULT '{"defaultLanguage": "he", "defaultReportType": "delivery", "pdfBrandingEnabled": true}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mode" "text" DEFAULT 'solo'::"text" NOT NULL,
    CONSTRAINT "organizations_mode_check" CHECK (("mode" = ANY (ARRAY['solo'::"text", 'team'::"text"]))),
    CONSTRAINT "organizations_name_check" CHECK (("char_length"("name") >= 1))
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


COMMENT ON COLUMN "public"."organizations"."mode" IS 'solo = single inspector, team = multi-user org';



CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "city" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "report_type_default" "text" DEFAULT 'delivery'::"text" NOT NULL,
    "default_checklist_template_id" "uuid",
    CONSTRAINT "projects_name_check" CHECK (("char_length"("name") >= 1)),
    CONSTRAINT "projects_report_type_default_check" CHECK (("report_type_default" = ANY (ARRAY['delivery'::"text", 'bedek_bait'::"text"]))),
    CONSTRAINT "projects_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'completed'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


COMMENT ON COLUMN "public"."projects"."report_type_default" IS 'Default report type for new reports in this project';



COMMENT ON COLUMN "public"."projects"."default_checklist_template_id" IS 'Default checklist template for delivery reports in this project';



CREATE TABLE IF NOT EXISTS "public"."report_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "delivery_report_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "details" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "report_log_action_check" CHECK (("action" = ANY (ARRAY['pdf_generated'::"text", 'status_completed'::"text", 'status_draft'::"text", 'status_in_progress'::"text", 'defect_added'::"text", 'defect_updated'::"text", 'defect_deleted'::"text", 'photos_updated'::"text", 'whatsapp_sent'::"text"])))
);


ALTER TABLE "public"."report_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."signatures" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "delivery_report_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "signer_type" "text" NOT NULL,
    "signer_name" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "signed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "signatures_signer_name_check" CHECK (("char_length"("signer_name") >= 1)),
    CONSTRAINT "signatures_signer_type_check" CHECK (("signer_type" = ANY (ARRAY['inspector'::"text", 'tenant'::"text"])))
);


ALTER TABLE "public"."signatures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "teams_name_check" CHECK (("char_length"("name") >= 1))
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "organization_id" "uuid",
    "email" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "role" "text" DEFAULT 'inspector'::"text" NOT NULL,
    "phone" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "signature_url" "text",
    "first_name" "text",
    "profession" "text",
    "inspector_settings" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "avatar_url" "text",
    "provider" "text" DEFAULT 'email'::"text" NOT NULL,
    "stamp_url" "text",
    CONSTRAINT "users_full_name_check" CHECK (("char_length"("full_name") >= 0)),
    CONSTRAINT "users_phone_check" CHECK ((("phone" IS NULL) OR ("phone" ~ '^0[2-9]\d{7,8}$'::"text"))),
    CONSTRAINT "users_profession_check" CHECK ((("profession" IS NULL) OR ("profession" = ANY (ARRAY['engineer'::"text", 'constructor'::"text", 'inspector'::"text", 'project_manager'::"text", 'architect'::"text", 'building_technician'::"text", 'site_manager'::"text"])))),
    CONSTRAINT "users_provider_check" CHECK (("provider" = ANY (ARRAY['email'::"text", 'google'::"text", 'apple'::"text"]))),
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text", 'inspector'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."signature_url" IS 'URL to stored inspector signature image';



COMMENT ON COLUMN "public"."users"."first_name" IS 'First name for greeting display (שם פרטי)';



COMMENT ON COLUMN "public"."users"."profession" IS 'Professional role selected during registration';



COMMENT ON COLUMN "public"."users"."inspector_settings" IS 'JSONB: license_number, education, experience, company_name, company_logo_url, default_declaration, default_tools, default_limitations';



COMMENT ON COLUMN "public"."users"."stamp_url" IS 'URL to inspector stamp/logo PNG in storage';



ALTER TABLE ONLY "public"."apartments"
    ADD CONSTRAINT "apartments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."buildings"
    ADD CONSTRAINT "buildings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_results"
    ADD CONSTRAINT "checklist_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_templates"
    ADD CONSTRAINT "checklist_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."defect_library"
    ADD CONSTRAINT "defect_library_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."defect_photos"
    ADD CONSTRAINT "defect_photos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."defects"
    ADD CONSTRAINT "defects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."delivery_reports"
    ADD CONSTRAINT "delivery_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization_invitations"
    ADD CONSTRAINT "organization_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_organization_id_user_id_key" UNIQUE ("organization_id", "user_id");



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."report_log"
    ADD CONSTRAINT "report_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."signatures"
    ADD CONSTRAINT "signatures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_apartments_building" ON "public"."apartments" USING "btree" ("building_id");



CREATE INDEX "idx_apartments_org_status" ON "public"."apartments" USING "btree" ("organization_id", "status");



CREATE INDEX "idx_buildings_project" ON "public"."buildings" USING "btree" ("project_id");



CREATE INDEX "idx_checklist_categories_template" ON "public"."checklist_categories" USING "btree" ("template_id");



CREATE INDEX "idx_checklist_items_category" ON "public"."checklist_items" USING "btree" ("category_id");



CREATE INDEX "idx_checklist_results_report" ON "public"."checklist_results" USING "btree" ("delivery_report_id");



CREATE UNIQUE INDEX "idx_checklist_results_unique" ON "public"."checklist_results" USING "btree" ("delivery_report_id", "checklist_item_id");



CREATE INDEX "idx_checklist_templates_org" ON "public"."checklist_templates" USING "btree" ("organization_id");



CREATE INDEX "idx_clients_org" ON "public"."clients" USING "btree" ("organization_id");



CREATE INDEX "idx_defect_library_org" ON "public"."defect_library" USING "btree" ("organization_id");



CREATE INDEX "idx_defect_library_search" ON "public"."defect_library" USING "gin" ("to_tsvector"('"simple"'::"regconfig", "description"));



CREATE INDEX "idx_defect_photos_defect" ON "public"."defect_photos" USING "btree" ("defect_id");



CREATE INDEX "idx_defects_org_status" ON "public"."defects" USING "btree" ("organization_id", "status");



CREATE INDEX "idx_defects_report" ON "public"."defects" USING "btree" ("delivery_report_id");



CREATE INDEX "idx_defects_source_defect" ON "public"."defects" USING "btree" ("source_defect_id");



CREATE INDEX "idx_delivery_reports_apartment" ON "public"."delivery_reports" USING "btree" ("apartment_id");



CREATE INDEX "idx_delivery_reports_inspector" ON "public"."delivery_reports" USING "btree" ("inspector_id");



CREATE INDEX "idx_delivery_reports_org_status" ON "public"."delivery_reports" USING "btree" ("organization_id", "status");



CREATE INDEX "idx_delivery_reports_previous_round" ON "public"."delivery_reports" USING "btree" ("previous_round_id");



CREATE INDEX "idx_notifications_org" ON "public"."notifications" USING "btree" ("organization_id");



CREATE INDEX "idx_notifications_user_unread" ON "public"."notifications" USING "btree" ("user_id", "is_read") WHERE ("is_read" = false);



CREATE INDEX "idx_organization_invitations_email" ON "public"."organization_invitations" USING "btree" ("email");



CREATE INDEX "idx_organization_invitations_org" ON "public"."organization_invitations" USING "btree" ("organization_id");



CREATE INDEX "idx_organization_members_org" ON "public"."organization_members" USING "btree" ("organization_id");



CREATE INDEX "idx_organization_members_user" ON "public"."organization_members" USING "btree" ("user_id");



CREATE INDEX "idx_projects_org" ON "public"."projects" USING "btree" ("organization_id");



CREATE INDEX "idx_report_log_org" ON "public"."report_log" USING "btree" ("organization_id");



CREATE INDEX "idx_report_log_report" ON "public"."report_log" USING "btree" ("delivery_report_id");



CREATE INDEX "idx_signatures_report" ON "public"."signatures" USING "btree" ("delivery_report_id");



CREATE UNIQUE INDEX "idx_signatures_unique_per_report" ON "public"."signatures" USING "btree" ("delivery_report_id", "signer_type");



CREATE INDEX "idx_teams_org" ON "public"."teams" USING "btree" ("organization_id");



CREATE UNIQUE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_org" ON "public"."users" USING "btree" ("organization_id");



CREATE OR REPLACE TRIGGER "set_apartments_updated_at" BEFORE UPDATE ON "public"."apartments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_buildings_updated_at" BEFORE UPDATE ON "public"."buildings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_checklist_results_updated_at" BEFORE UPDATE ON "public"."checklist_results" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_checklist_templates_updated_at" BEFORE UPDATE ON "public"."checklist_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_clients_updated_at" BEFORE UPDATE ON "public"."clients" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_defect_library_updated_at" BEFORE UPDATE ON "public"."defect_library" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_defects_updated_at" BEFORE UPDATE ON "public"."defects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_delivery_reports_updated_at" BEFORE UPDATE ON "public"."delivery_reports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_organization_invitations_updated_at" BEFORE UPDATE ON "public"."organization_invitations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_organization_members_updated_at" BEFORE UPDATE ON "public"."organization_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_organizations_updated_at" BEFORE UPDATE ON "public"."organizations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_teams_updated_at" BEFORE UPDATE ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "trg_set_report_number" BEFORE INSERT ON "public"."delivery_reports" FOR EACH ROW EXECUTE FUNCTION "public"."set_report_number"();



ALTER TABLE ONLY "public"."apartments"
    ADD CONSTRAINT "apartments_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."apartments"
    ADD CONSTRAINT "apartments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."buildings"
    ADD CONSTRAINT "buildings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."buildings"
    ADD CONSTRAINT "buildings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."checklist_templates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."checklist_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_results"
    ADD CONSTRAINT "checklist_results_checklist_item_id_fkey" FOREIGN KEY ("checklist_item_id") REFERENCES "public"."checklist_items"("id");



ALTER TABLE ONLY "public"."checklist_results"
    ADD CONSTRAINT "checklist_results_delivery_report_id_fkey" FOREIGN KEY ("delivery_report_id") REFERENCES "public"."delivery_reports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_results"
    ADD CONSTRAINT "checklist_results_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."checklist_templates"
    ADD CONSTRAINT "checklist_templates_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."defect_library"
    ADD CONSTRAINT "defect_library_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."defect_library"
    ADD CONSTRAINT "defect_library_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."defect_photos"
    ADD CONSTRAINT "defect_photos_defect_id_fkey" FOREIGN KEY ("defect_id") REFERENCES "public"."defects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."defect_photos"
    ADD CONSTRAINT "defect_photos_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."defects"
    ADD CONSTRAINT "defects_checklist_result_id_fkey" FOREIGN KEY ("checklist_result_id") REFERENCES "public"."checklist_results"("id");



ALTER TABLE ONLY "public"."defects"
    ADD CONSTRAINT "defects_delivery_report_id_fkey" FOREIGN KEY ("delivery_report_id") REFERENCES "public"."delivery_reports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."defects"
    ADD CONSTRAINT "defects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."defects"
    ADD CONSTRAINT "defects_source_defect_id_fkey" FOREIGN KEY ("source_defect_id") REFERENCES "public"."defects"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."delivery_reports"
    ADD CONSTRAINT "delivery_reports_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartments"("id");



ALTER TABLE ONLY "public"."delivery_reports"
    ADD CONSTRAINT "delivery_reports_checklist_template_id_fkey" FOREIGN KEY ("checklist_template_id") REFERENCES "public"."checklist_templates"("id");



ALTER TABLE ONLY "public"."delivery_reports"
    ADD CONSTRAINT "delivery_reports_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."delivery_reports"
    ADD CONSTRAINT "delivery_reports_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."delivery_reports"
    ADD CONSTRAINT "delivery_reports_previous_round_id_fkey" FOREIGN KEY ("previous_round_id") REFERENCES "public"."delivery_reports"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."organization_invitations"
    ADD CONSTRAINT "organization_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."organization_invitations"
    ADD CONSTRAINT "organization_invitations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."organization_members"
    ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_default_checklist_template_id_fkey" FOREIGN KEY ("default_checklist_template_id") REFERENCES "public"."checklist_templates"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."report_log"
    ADD CONSTRAINT "report_log_delivery_report_id_fkey" FOREIGN KEY ("delivery_report_id") REFERENCES "public"."delivery_reports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."report_log"
    ADD CONSTRAINT "report_log_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."report_log"
    ADD CONSTRAINT "report_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."signatures"
    ADD CONSTRAINT "signatures_delivery_report_id_fkey" FOREIGN KEY ("delivery_report_id") REFERENCES "public"."delivery_reports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."signatures"
    ADD CONSTRAINT "signatures_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");



ALTER TABLE "public"."apartments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "apartments_delete" ON "public"."apartments" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "apartments_insert" ON "public"."apartments" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "apartments_select" ON "public"."apartments" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "apartments_update" ON "public"."apartments" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



ALTER TABLE "public"."buildings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "buildings_delete" ON "public"."buildings" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "buildings_insert" ON "public"."buildings" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "buildings_select" ON "public"."buildings" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "buildings_update" ON "public"."buildings" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



ALTER TABLE "public"."checklist_categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checklist_categories_delete" ON "public"."checklist_categories" FOR DELETE USING ((("template_id" IN ( SELECT "checklist_templates"."id"
   FROM "public"."checklist_templates"
  WHERE ("checklist_templates"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"()))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_categories_insert" ON "public"."checklist_categories" FOR INSERT WITH CHECK ((("template_id" IN ( SELECT "checklist_templates"."id"
   FROM "public"."checklist_templates"
  WHERE ("checklist_templates"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"()))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_categories_select" ON "public"."checklist_categories" FOR SELECT USING (("template_id" IN ( SELECT "checklist_templates"."id"
   FROM "public"."checklist_templates"
  WHERE (("checklist_templates"."is_global" = true) OR ("checklist_templates"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"())))))));



CREATE POLICY "checklist_categories_update" ON "public"."checklist_categories" FOR UPDATE USING ((("template_id" IN ( SELECT "checklist_templates"."id"
   FROM "public"."checklist_templates"
  WHERE ("checklist_templates"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"()))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."checklist_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checklist_items_delete" ON "public"."checklist_items" FOR DELETE USING ((("category_id" IN ( SELECT "cc"."id"
   FROM ("public"."checklist_categories" "cc"
     JOIN "public"."checklist_templates" "ct" ON (("cc"."template_id" = "ct"."id")))
  WHERE ("ct"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"()))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_items_insert" ON "public"."checklist_items" FOR INSERT WITH CHECK ((("category_id" IN ( SELECT "cc"."id"
   FROM ("public"."checklist_categories" "cc"
     JOIN "public"."checklist_templates" "ct" ON (("cc"."template_id" = "ct"."id")))
  WHERE ("ct"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"()))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_items_select" ON "public"."checklist_items" FOR SELECT USING (("category_id" IN ( SELECT "cc"."id"
   FROM ("public"."checklist_categories" "cc"
     JOIN "public"."checklist_templates" "ct" ON (("cc"."template_id" = "ct"."id")))
  WHERE (("ct"."is_global" = true) OR ("ct"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"())))))));



CREATE POLICY "checklist_items_update" ON "public"."checklist_items" FOR UPDATE USING ((("category_id" IN ( SELECT "cc"."id"
   FROM ("public"."checklist_categories" "cc"
     JOIN "public"."checklist_templates" "ct" ON (("cc"."template_id" = "ct"."id")))
  WHERE ("ct"."organization_id" = ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."id" = "auth"."uid"()))))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."checklist_results" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checklist_results_delete" ON "public"."checklist_results" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_results_insert" ON "public"."checklist_results" FOR INSERT WITH CHECK (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "checklist_results_select" ON "public"."checklist_results" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "checklist_results_update" ON "public"."checklist_results" FOR UPDATE USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



ALTER TABLE "public"."checklist_templates" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checklist_templates_delete" ON "public"."checklist_templates" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_templates_insert" ON "public"."checklist_templates" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "checklist_templates_select" ON "public"."checklist_templates" FOR SELECT USING ((("is_global" = true) OR ("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())))));



CREATE POLICY "checklist_templates_update" ON "public"."checklist_templates" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "clients_delete" ON "public"."clients" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "clients_insert" ON "public"."clients" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "clients_select" ON "public"."clients" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "clients_update" ON "public"."clients" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



ALTER TABLE "public"."defect_library" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "defect_library_delete" ON "public"."defect_library" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "defect_library_insert" ON "public"."defect_library" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "defect_library_select" ON "public"."defect_library" FOR SELECT USING ((("is_global" = true) OR ("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())))));



CREATE POLICY "defect_library_update" ON "public"."defect_library" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."defect_photos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "defect_photos_delete" ON "public"."defect_photos" FOR DELETE USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "defect_photos_insert" ON "public"."defect_photos" FOR INSERT WITH CHECK (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "defect_photos_select" ON "public"."defect_photos" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



ALTER TABLE "public"."defects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "defects_delete" ON "public"."defects" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "defects_insert" ON "public"."defects" FOR INSERT WITH CHECK (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "defects_select" ON "public"."defects" FOR SELECT USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"]))))) OR ("delivery_report_id" IN ( SELECT "delivery_reports"."id"
   FROM "public"."delivery_reports"
  WHERE ("delivery_reports"."inspector_id" = "auth"."uid"()))))));



CREATE POLICY "defects_update" ON "public"."defects" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"]))))) OR ("delivery_report_id" IN ( SELECT "delivery_reports"."id"
   FROM "public"."delivery_reports"
  WHERE ("delivery_reports"."inspector_id" = "auth"."uid"()))))));



ALTER TABLE "public"."delivery_reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "delivery_reports_delete" ON "public"."delivery_reports" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "delivery_reports_insert" ON "public"."delivery_reports" FOR INSERT WITH CHECK (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "delivery_reports_select" ON "public"."delivery_reports" FOR SELECT USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"]))))) OR ("inspector_id" = "auth"."uid"()))));



CREATE POLICY "delivery_reports_update" ON "public"."delivery_reports" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"]))))) OR ("inspector_id" = "auth"."uid"()))));



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notifications_delete" ON "public"."notifications" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "notifications_insert" ON "public"."notifications" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "notifications_select" ON "public"."notifications" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "notifications_update" ON "public"."notifications" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "org_invitations_delete" ON "public"."organization_invitations" FOR DELETE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "org_invitations_insert" ON "public"."organization_invitations" FOR INSERT WITH CHECK ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "org_invitations_select" ON "public"."organization_invitations" FOR SELECT USING (("organization_id" = "public"."get_user_org_id"()));



CREATE POLICY "org_invitations_update" ON "public"."organization_invitations" FOR UPDATE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "org_members_delete" ON "public"."organization_members" FOR DELETE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "org_members_insert" ON "public"."organization_members" FOR INSERT WITH CHECK ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "org_members_select" ON "public"."organization_members" FOR SELECT USING (("organization_id" = "public"."get_user_org_id"()));



CREATE POLICY "org_members_update" ON "public"."organization_members" FOR UPDATE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."organization_invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organization_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "organizations_insert" ON "public"."organizations" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "organizations_select" ON "public"."organizations" FOR SELECT USING (("id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "organizations_update" ON "public"."organizations" FOR UPDATE USING ((("id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "projects_delete" ON "public"."projects" FOR DELETE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = 'admin'::"text"))))));



CREATE POLICY "projects_insert" ON "public"."projects" FOR INSERT WITH CHECK ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



CREATE POLICY "projects_select" ON "public"."projects" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "projects_update" ON "public"."projects" FOR UPDATE USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND (EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"])))))));



ALTER TABLE "public"."report_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "report_log_insert" ON "public"."report_log" FOR INSERT WITH CHECK (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "report_log_select" ON "public"."report_log" FOR SELECT USING ((("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))) AND ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"text", 'project_manager'::"text"]))))) OR ("delivery_report_id" IN ( SELECT "delivery_reports"."id"
   FROM "public"."delivery_reports"
  WHERE ("delivery_reports"."inspector_id" = "auth"."uid"()))))));



ALTER TABLE "public"."signatures" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "signatures_insert" ON "public"."signatures" FOR INSERT WITH CHECK (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "signatures_select" ON "public"."signatures" FOR SELECT USING (("organization_id" = ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "teams_delete" ON "public"."teams" FOR DELETE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "teams_insert" ON "public"."teams" FOR INSERT WITH CHECK ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "teams_select" ON "public"."teams" FOR SELECT USING (("organization_id" = "public"."get_user_org_id"()));



CREATE POLICY "teams_update" ON "public"."teams" FOR UPDATE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_delete" ON "public"."users" FOR DELETE USING ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "users_insert" ON "public"."users" FOR INSERT WITH CHECK ((("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "users_insert_own" ON "public"."users" FOR INSERT WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "users_select_org" ON "public"."users" FOR SELECT USING (("organization_id" = "public"."get_user_org_id"()));



CREATE POLICY "users_select_own" ON "public"."users" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "users_update" ON "public"."users" FOR UPDATE USING ((("id" = "auth"."uid"()) OR (("organization_id" = "public"."get_user_org_id"()) AND (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text")))))));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_report_number"("p_org_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_report_number"("p_org_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_report_number"("p_org_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_org_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_org_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_org_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_report_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_report_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_report_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."apartments" TO "anon";
GRANT ALL ON TABLE "public"."apartments" TO "authenticated";
GRANT ALL ON TABLE "public"."apartments" TO "service_role";



GRANT ALL ON TABLE "public"."buildings" TO "anon";
GRANT ALL ON TABLE "public"."buildings" TO "authenticated";
GRANT ALL ON TABLE "public"."buildings" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_categories" TO "anon";
GRANT ALL ON TABLE "public"."checklist_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_categories" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_items" TO "anon";
GRANT ALL ON TABLE "public"."checklist_items" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_items" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_results" TO "anon";
GRANT ALL ON TABLE "public"."checklist_results" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_results" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_templates" TO "anon";
GRANT ALL ON TABLE "public"."checklist_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_templates" TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON TABLE "public"."defect_library" TO "anon";
GRANT ALL ON TABLE "public"."defect_library" TO "authenticated";
GRANT ALL ON TABLE "public"."defect_library" TO "service_role";



GRANT ALL ON TABLE "public"."defect_photos" TO "anon";
GRANT ALL ON TABLE "public"."defect_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."defect_photos" TO "service_role";



GRANT ALL ON TABLE "public"."defects" TO "anon";
GRANT ALL ON TABLE "public"."defects" TO "authenticated";
GRANT ALL ON TABLE "public"."defects" TO "service_role";



GRANT ALL ON TABLE "public"."delivery_reports" TO "anon";
GRANT ALL ON TABLE "public"."delivery_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."delivery_reports" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."organization_invitations" TO "anon";
GRANT ALL ON TABLE "public"."organization_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_invitations" TO "service_role";



GRANT ALL ON TABLE "public"."organization_members" TO "anon";
GRANT ALL ON TABLE "public"."organization_members" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_members" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."report_log" TO "anon";
GRANT ALL ON TABLE "public"."report_log" TO "authenticated";
GRANT ALL ON TABLE "public"."report_log" TO "service_role";



GRANT ALL ON TABLE "public"."signatures" TO "anon";
GRANT ALL ON TABLE "public"."signatures" TO "authenticated";
GRANT ALL ON TABLE "public"."signatures" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







