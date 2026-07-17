-- ============================================================
-- HungerMap PK — Database Schema (PostgreSQL / Neon DB)
-- Food insecurity reporting & resource connector
-- ============================================================

-- ------------------------------------------------------------
-- ENUM TYPES (must be created before the tables that use them)
-- ------------------------------------------------------------

-- AI-assigned urgency level for a case
CREATE TYPE urgency AS ENUM ('CRITICAL', 'MODERATE', 'LOW');

-- Lifecycle status of a case
CREATE TYPE status AS ENUM ('Reported', 'Matched', 'Referred', 'Under_Review', 'Resolved');


-- ------------------------------------------------------------
-- Table: cases
-- Food insecurity case reports submitted by volunteers.
-- Urgency + AI fields are populated after submission.
-- ------------------------------------------------------------
CREATE TABLE cases (
    id              SERIAL PRIMARY KEY,
    case_id         UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    reporter_name   VARCHAR(255),
    phone           VARCHAR(20),
    email           VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    district        VARCHAR(100) NOT NULL,
    family_size     INTEGER NOT NULL,
    children_count  INTEGER NOT NULL,              -- children under 5
    income_range    VARCHAR(50),
    description     TEXT NOT NULL,                  -- 50 to 500 words (enforced in app layer)
    urgency         urgency,                        -- set by AI after submission
    urgency_reason  TEXT,                           -- AI-generated explanation
    risk_factors    TEXT[],                         -- AI-returned list
    timeline_hours  INTEGER,                        -- AI-suggested aid timeline
    status          status NOT NULL DEFAULT 'Reported',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at     TIMESTAMPTZ,
    is_duplicate    BOOLEAN NOT NULL DEFAULT false
);


-- ------------------------------------------------------------
-- Table: ngos
-- Seeded directory of food banks, NGOs and government programs
-- across Pakistani cities.
-- ------------------------------------------------------------
CREATE TABLE ngos (
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(255) NOT NULL,
    city                  VARCHAR(100) NOT NULL,
    district              VARCHAR(100),
    address               TEXT,
    phone                 VARCHAR(20),
    email                 VARCHAR(255),
    programs              TEXT[],                   -- list of services offered
    urgency_levels_served TEXT[],                   -- urgency levels this NGO can handle
    operating_hours       VARCHAR(100),             -- shown in match results (workflow step 4)
    capacity_flag         BOOLEAN,                  -- true if currently has capacity
    verified              BOOLEAN NOT NULL DEFAULT false,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- Table: case_ngo_matches
-- Links cases to matched NGOs; tracks referral letter and SMS.
-- ------------------------------------------------------------
CREATE TABLE case_ngo_matches (
    id               SERIAL PRIMARY KEY,
    case_id          INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    ngo_id           INTEGER NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    matched_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    letter_url       VARCHAR(500),                  -- Cloudinary/Supabase PDF URL
    notified_via_sms BOOLEAN NOT NULL DEFAULT false
);


-- ------------------------------------------------------------
-- Table: volunteers
-- Tracks volunteers (by phone or email) for leaderboard and
-- impact card features.
-- ------------------------------------------------------------
CREATE TABLE volunteers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255),
    phone       VARCHAR(20) UNIQUE,
    email       VARCHAR(255) UNIQUE,
    city        VARCHAR(100),
    total_cases INTEGER NOT NULL DEFAULT 0,
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- Table: status_history
-- Audit log — records every status change on a case.
-- ------------------------------------------------------------
CREATE TABLE status_history (
    id         SERIAL PRIMARY KEY,
    case_id    INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    updated_by VARCHAR(255),                        -- volunteer, NGO user, or admin
    notes      TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- Table: weekly_reports
-- AI-generated weekly city-level impact reports sent to NGOs
-- every Monday.
-- ------------------------------------------------------------
CREATE TABLE weekly_reports (
    id          SERIAL PRIMARY KEY,
    city        VARCHAR(100) NOT NULL,
    report_text TEXT NOT NULL,                      -- Claude-generated
    week_start  DATE NOT NULL,
    sent_at     TIMESTAMPTZ,
    recipients  TEXT[]                              -- NGO emails it was sent to
);


-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
CREATE INDEX idx_cases_city             ON cases (city);
CREATE INDEX idx_cases_urgency          ON cases (urgency);
CREATE INDEX idx_cases_status           ON cases (status);
CREATE INDEX idx_cases_case_id          ON cases (case_id);
CREATE INDEX idx_ngos_city              ON ngos (city);
CREATE INDEX idx_matches_case_id        ON case_ngo_matches (case_id);
CREATE INDEX idx_matches_ngo_id         ON case_ngo_matches (ngo_id);
CREATE INDEX idx_status_history_case_id ON status_history (case_id);
