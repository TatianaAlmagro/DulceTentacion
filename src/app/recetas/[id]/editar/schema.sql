-- Habilitar RLS en la tabla de recetas
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;

-- Policy 1: Permitir lectura pública de las recetas
CREATE POLICY "Lectura pública de recetas" 
ON recetas FOR SELECT 
USING (true);

-- Policy 2: Permitir la creación de recetas a cualquier usuario autenticado
CREATE POLICY "Usuarios autenticados pueden crear recetas" 
ON recetas FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Permitir actualizar solo si el usuario es dueño de la receta
CREATE POLICY "Usuarios pueden editar solo sus propias recetas" 
ON recetas FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy 4: Permitir eliminar solo si el usuario es dueño de la receta
CREATE POLICY "Usuarios pueden eliminar solo sus propias recetas" 
ON recetas FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);