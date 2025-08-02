-- Actualizar tabla de usuarios para incluir rol cocina
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'monitor', 'attendee', 'cocina'));

-- Actualizar tabla de tickets para incluir tipo 'once'
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_ticket_type_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_ticket_type_check CHECK (ticket_type IN ('lunch', 'once', 'snack'));

-- Insertar usuario de cocina por defecto
INSERT INTO users (email, full_name, role, rut) 
VALUES ('cocina@evento.com', 'Personal de Cocina', 'cocina', '88.888.888-8')
ON CONFLICT (email) DO NOTHING;

-- Crear función para generar tickets automáticamente cuando se crea un usuario attendee
CREATE OR REPLACE FUNCTION create_user_tickets()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear tickets para usuarios con rol 'attendee'
  IF NEW.role = 'attendee' THEN
    -- Crear ticket de almuerzo
    INSERT INTO tickets (user_id, ticket_type, qr_code)
    VALUES (NEW.id, 'lunch', 'LUNCH-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)));
    
    -- Crear ticket de once
    INSERT INTO tickets (user_id, ticket_type, qr_code)
    VALUES (NEW.id, 'once', 'ONCE-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(_code)
    VALUES (NEW.id, 'once', 'ONCE-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para ejecutar la función automáticamente
DROP TRIGGER IF EXISTS trigger_create_user_tickets ON users;
CREATE TRIGGER trigger_create_user_tickets
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_tickets();

-- Índices adicionales para mejor rendimiento en consultas de cocina
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_type ON tickets(ticket_type);
CREATE INDEX IF NOT EXISTS idx_tickets_is_used ON tickets(is_used);
CREATE INDEX IF NOT EXISTS idx_tickets_used_at ON tickets(used_at);
