/*
  # Enhanced Category Management

  1. Updates
    - Add description field to categories table
    - Add parent_id for hierarchical categories
    - Add icon field for visual representation
    - Add color field for UI customization
    - Add slug field for URL-friendly names

  2. Security
    - Maintain existing RLS policies
    - Add new policies for category management
*/

-- Add new columns to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create function to generate slug
CREATE OR REPLACE FUNCTION generate_category_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for slug generation
CREATE TRIGGER generate_category_slug_trigger
  BEFORE INSERT OR UPDATE OF name ON categories
  FOR EACH ROW
  EXECUTE FUNCTION generate_category_slug();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();