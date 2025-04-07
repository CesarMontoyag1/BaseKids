-- Seleccionamos la base de datos
USE basedatosfundacion;

-- 1. Insertamos dos usuarios (coordinador y profesora)
INSERT INTO basedatosfundacion.usuario (
  numDoc, tipoDoc, username, email, password, rol, nombre, apellido
) VALUES 
  ('123456789', 'CC', 'jlopez', 'jlopez@email.com', 'clave123', 'administrativo', 'Juan', 'López'),
  ('987654321', 'CC', 'lauraprof', 'laura@email.com', 'prof456', 'profesor', 'Laura', 'Gómez');

-- 2. Insertamos un estudiante
INSERT INTO basedatosfundacion.estudiantes (
  numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido, genero,
  fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad, paisNacimiento,
  municipioNacimiento, municipioResidencia, direccionResidencia, zonaEstudiante,
  mundo, modalidad, dias, horarioInicio, horarioFin, codigoDaneIE, subregionIE,
  municipioIE, InstitucionEducativa, codigoDaneSede, sede, grado, jornada, nit, proveedor
) VALUES (
  '1122334455', 'TI', 'Carlos', 'Eduardo', 'Ramírez', 'Pérez', 'M',
  '2010-05-12 00:00:00', 'Soltero', 'Indígena', 'Desplazado', 'Colombia',
  'Medellín', 'Bello', 'Calle 10 # 20-30', 'Rural',
  'Primario', 'Presencial', 'Lunes a Viernes', '07:00', '12:00', '105678',
  'Valle de Aburrá', 'Medellín', 'IE La Esperanza', '110245', 'Sede Principal', '5', 'M', '900123456', 'Comfama'
);

-- 3. Insertamos una asistencia registrada por el coordinador
INSERT INTO basedatosfundacion.asistencia (
  institucionEducativa, fechaAsistencia, Usuario_numDoc, Usuario_tipoDoc
) VALUES (
  'IE La Esperanza', '2025-04-06 08:00:00', '123456789', 'CC'
);

-- 4. Obtenemos el ID de la asistencia insertada (suponiendo que fue la última)
-- (Si lo haces manualmente, revisa con: SELECT LAST_INSERT_ID();)
-- Suponemos que el ID es 1

-- 5. Relacionamos al estudiante con esa asistencia
INSERT INTO basedatosfundacion.asistencia_has_estudiantes (
  Asistencia_idAsistencia, Estudiantes_numDoc, Estudiantes_tipoDoc, asistio
) VALUES (
  1, '1122334455', 'TI', 1
);
