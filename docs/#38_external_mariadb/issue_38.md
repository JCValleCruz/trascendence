# Documentación Migración a MariaDB (Issue #38)

## 🎯 Objetivo
Migrar el sistema de persistencia de datos de **SQLite** (archivo local) a **MariaDB** (base de datos externa/servidor), permitiendo una arquitectura más escalable y similar a producción.

---

## 🔄 Diferencias Clave (SQLite vs MariaDB)

### 1. SQLite (Lo que teníamos)
- **¿Qué es?**: Una base de datos guardada en un solo archivo (`pong.sqlite`).
- **Ventaja**: Cero configuración, muy fácil para empezar.
- **Desventaja**: No soporta mucha concurrencia (muchos usuarios a la vez), difícil de escalar.
- **En Node**: Usábamos `better-sqlite3` que es **síncrono** (detiene el código hasta que responde).

### 2. MariaDB (Lo que tenemos ahora)
- **¿Qué es?**: Un servidor de base de datos completo (fork de MySQL).
- **Ventaja**: Soporta múltiples conexiones simultáneas, gestión de usuarios, seguridad robusta.
- **En Node**: Usamos `mysql2/promise` que es **asíncrono** (no bloquea el servidor mientras espera respuesta).

---

## 🛠 Cambios Técnicos Explicados

### 1. El Pool de Conexiones (`database.ts`)

En lugar de abrir una conexión, usarla y cerrarla cada vez (que es lento), creamos un **Pool**:

```typescript
pool = mysql.createPool(dbConfig);
```

**Analogía**: Imagina un "pool" de taxis esperando.
- Cuando una petición llega (ej: Login), pide un taxi (conexión).
- Lo usa para ir a la BD y volver.
- Al terminar, **no destruye el taxi**, lo devuelve a la fila para el siguiente pasajero.
- Esto hace que el servidor responda mucho más rápido.

### 2. Async/Await en consultas

Antes (SQLite):
```typescript
// El servidor se congela aquí hasta que termina
const user = db.prepare('SELECT ...').get(id); 
return user;
```

Ahora (MariaDB):
```typescript
// El servidor sigue atendiendo otras peticiones mientra espera
const [rows] = await pool.execute('SELECT ...', [id]);
return rows[0];
```
Esto es crucial para que si 100 usuarios juegan a la vez, el servidor no se "cuelgue".

### 3. Docker y Variables de Entorno

Añadimos `env_file: .env` en `docker-compose.yml`.

**¿Por qué?**
El contenedor de Docker es una caja aislada. No ve las variables de tu ordenador ni los archivos de fuera (a menos que los montes).
Al poner `env_file`, le "inyectamos" las credenciales (`DB_USER`, `DB_PASSWORD`, etc.) dentro de la caja para que el código pueda leerlas con `process.env`.

---

## 📊 Estructura de Datos (Tabla `users`)

Se ha definido la tabla con estos campos clave:

- **`id`**: `INT AUTO_INCREMENT` (Identificador único numérico).
- **`username` y `email`**: `UNIQUE` (No puede haber dos iguales, la BD nos avisa con error si intentamos duplicar).
- **`password`**: Se guarda **Hasheada**. Nunca guardamos texto plano. Ver sección de seguridad abajo.
- **`is_online` y `last_login`**: Campos extra para saber quién está conectado.

---

## 🔐 Seguridad: Hashing de Contraseñas con Bcrypt

### ¿Por qué no guardamos la contraseña directamente?

Si guardáramos `password = "miContraseña123"` en texto plano y un atacante accede a la base de datos, **tendría acceso inmediato a todas las cuentas**. 

Por eso usamos **hashing**: un proceso matemático **unidireccional** que transforma la contraseña en un texto ilegible.

### ¿Qué es un Hash?

Un **hash** es como una licuadora de datos:
- Metes cualquier texto → sale una cadena de longitud fija
- **Siempre** produce el mismo resultado para la misma entrada
- **Imposible** revertir (no puedes "deslicuar")

```
"hola"     → $2b$10$N9qo8uLOickgx2ZMRZoMye...
"hola1"    → $2b$10$Kj8S.xPqzOqxb2N3s9xmJe...  (totalmente diferente)
```

### ¿Por qué Bcrypt y no SHA256?

Bcrypt tiene dos superpoderes:

#### 1. **Salt (Sal) automático**
Añade datos aleatorios antes de hashear. Así dos usuarios con la misma contraseña tienen hashes **diferentes**:

```
Usuario A: "password123" + salt_A → $2b$10$abc...xyz
Usuario B: "password123" + salt_B → $2b$10$def...uvw  (¡diferente!)
```

Esto anula los ataques de **"rainbow tables"** (tablas precalculadas de hashes).

#### 2. **Cost Factor (Factor de coste)**
El `10` en `bcrypt.genSalt(10)` significa que hace **2^10 = 1024 iteraciones** internas. Esto hace el proceso **intencionalmente lento**:

| Método | Tiempo por hash | Intentos/segundo que puede hacer un atacante |
|--------|-----------------|---------------------------------------------|
| SHA256 | ~0.000001 seg  | ~1,000,000,000 |
| Bcrypt (cost 10) | ~0.1 seg | ~10 |

Un atacante que intente probar millones de contraseñas tardaría **años** en lugar de segundos.

### El Proceso Completo

#### 📝 Registro (cuando el usuario crea cuenta)

```typescript
// 1. Usuario envía: { password: "MiClave123" }

// 2. Generamos salt aleatorio (10 rondas de coste)
const salt = await bcrypt.genSalt(10);
// salt = "$2b$10$N9qo8uLOickgx2ZMRZoMye"

// 3. Hasheamos password + salt
const hashedPassword = await bcrypt.hash("MiClave123", salt);
// hashedPassword = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIH.6vE8vYvM6pqG0tPZKNxqQ/RrZ0hq"

// 4. Guardamos SOLO el hash en la BD (nunca la contraseña original)
await pool.execute('INSERT INTO users (..., password) VALUES (..., ?)', [hashedPassword]);
```

> **💡 Nota**: El salt queda **incluido dentro del hash**. No necesitamos guardarlo aparte.

#### 🔑 Login (cuando el usuario inicia sesión)

```typescript
// 1. Usuario envía: { email: "...", password: "MiClave123" }

// 2. Buscamos el hash guardado en la BD
const [rows] = await pool.execute('SELECT password FROM users WHERE email = ?', [email]);
const hashGuardado = rows[0].password;
// hashGuardado = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIH.6vE8vYvM6pqG0tPZKNxqQ/RrZ0hq"

// 3. Bcrypt extrae el salt del hash, rehashea la contraseña enviada, y compara
const esValida = await bcrypt.compare("MiClave123", hashGuardado);
// esValida = true ✅ (o false si no coinciden)

// 4. Si esValida → Login exitoso. Si no → "Credenciales inválidas"
```

### Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                        REGISTRO                                 │
├─────────────────────────────────────────────────────────────────┤
│  "MiClave123"  ──►  bcrypt.hash()  ──►  "$2b$10$N9qo..."       │
│                         ▲                      │                │
│                    (+ salt)                    ▼                │
│                                          Base de Datos          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN                                   │
├─────────────────────────────────────────────────────────────────┤
│  "MiClave123"  ──►  bcrypt.compare()  ◄──  "$2b$10$N9qo..."    │
│                           │                     ▲               │
│                           ▼                (desde BD)           │
│                    ¿Coinciden?                                  │
│                     ╱      ╲                                    │
│                   Sí        No                                  │
│                   ▼          ▼                                  │
│              ✅ Login    ❌ Error                               │
└─────────────────────────────────────────────────────────────────┘
```

---




