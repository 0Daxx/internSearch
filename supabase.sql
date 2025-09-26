CREATE TABLE public.internships (
id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
title text NOT NULL,
company text NOT NULL,
location text,
remote boolean DEFAULT false,
stipend text,
description text,
apply_url text,
tags text[],
posted_at timestamptz DEFAULT now()
);


-- Optional: enable uuid generator (run once if not enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Example insert (remove after testing)
INSERT INTO public.internships (title, company, location, remote, stipend, description, apply_url, tags)
VALUES
('Frontend Intern', 'Acme Labs', 'Bengaluru, India', true, '₹10,000/month', 'Work with React & design systems', 'https://example.com/apply/1', ARRAY['frontend','react','design']);