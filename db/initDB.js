require('dotenv').config();

const getConnection = require('./getConnection');

const bcrypt = require('bcrypt');

async function main() {
    // Variable that will store a free connection to the database.
    let connection;

    try {
        connection = await getConnection();

        await connection.query('DROP TABLE IF EXISTS favs');
        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('DROP TABLE IF EXISTS exercises');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL, 
                role ENUM('admin', 'normal') NOT NULL DEFAULT 'normal',
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS exercises (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED DEFAULT 1,                
                name VARCHAR(50) NOT NULL,
                type ENUM('aerobico', 'flexibilidad', 'fuerza') NOT NULL,
                muscle_group ENUM('piernas', 'hombros', 'brazos', 'pecho', 'espalda', 'abdomen') NOT NULL,
                description TEXT NOT NULL,
                image VARCHAR(100),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value BOOLEAN DEFAULT true,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users (id) ON DELETE CASCADE,
                idExercise INT UNSIGNED NOT NULL,
                FOREIGN KEY (idExercise) REFERENCES exercises (id) ON DELETE CASCADE,
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS favs (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value BOOLEAN DEFAULT true,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users (id) ON DELETE CASCADE,
                idExercise INT UNSIGNED NOT NULL,
                FOREIGN KEY (idExercise) REFERENCES exercises (id) ON DELETE CASCADE,
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

        console.log('¡Tablas creadas!');

        // We encrypt the password of the administrator user.
        const hashedPassword = await bcrypt.hash('123456', 10);

        await connection.query(
            `
            INSERT INTO users (username, email, password, role, createdAt)
            VALUES ('admin', 'admin@admin.com', ?, 'admin', ?)         
            `,
            [hashedPassword, new Date()]
        );
        console.log('¡Usuario administrador creado!');

        // We encrypt the trainer's password.
        const hashedPassword1 = await bcrypt.hash('123', 10);

        await connection.query(
            `
            INSERT INTO users (username, email, password, role, createdAt)
            VALUES ('Paco', 'paco@admin.com', ?, 'normal', ?),
                   ('Sergio', 'sergio@sergio.com', ?, 'normal', ?),
                   ('Pepelu', 'pepelu@pepelu.com', ?, 'normal', ?),
                   ('Luis', 'luis@luis.com', ?, 'normal', ?),
                   ('Rafa', 'rafa@rafa.com', ?, 'normal', ?),
                   ('Borja', 'borja@borja.com', ?, 'normal', ?),
                   ('Ana', 'ana@ana.com', ?, 'normal', ?)
            
            `,
            [
                hashedPassword1,
                new Date(),
                hashedPassword1,
                new Date(),
                hashedPassword1,
                new Date(),
                hashedPassword1,
                new Date(),
                hashedPassword1,
                new Date(),
                hashedPassword1,
                new Date(),
                hashedPassword1,
                new Date(),
            ]
        );
        console.log('¡Usuarios de prueba creados!');

        // We create test exercises.

        await connection.query(
            `
            INSERT INTO exercises (name, type, muscle_group, description, image, createdAt)
            VALUES ('EjercicioPrueba01', 'aerobico', 'piernas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'bf4d4da3-9e53-4429-a538-8a8858747f99.jpg', ?),
                   ('EjercicioPrueba02', 'aerobico', 'hombros', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02738.jpg', ?),
                   ('EjercicioPrueba03', 'aerobico', 'brazos', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2b.jpg', ?),
                   ('EjercicioPrueba04', 'aerobico', 'pecho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'bec0df76-0d6d-4c33-a539-1773b15682c6.jpg', ?),
                   ('EjercicioPrueba05', 'aerobico', 'espalda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'bf4d4da3-9e53-4429-a538-8a8858747f98.jpg', ?),
                   ('EjercicioPrueba06', 'aerobico', 'abdomen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '17d973b9-bfb7-4e68-aa6f-8e4b6f595a70.jpg', ?),
                   ('EjercicioPrueba07', 'flexibilidad', 'piernas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02739.jpg', ?),
                   ('EjercicioPrueba08', 'flexibilidad', 'hombros', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2a.jpg', ?),
                   ('EjercicioPrueba09', 'flexibilidad', 'brazos', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2c.jpg', ?),
                   ('EjercicioPrueba10', 'flexibilidad', 'pecho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2e.jpg', ?),
                   ('EjercicioPrueba11', 'flexibilidad', 'espalda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2f.jpg', ?),
                   ('EjercicioPrueba12', 'flexibilidad', 'abdomen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2g.jpg', ?),
                   ('EjercicioPrueba13', 'fuerza', 'piernas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2h.jpg', ?),
                   ('EjercicioPrueba14', 'fuerza', 'hombros', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2i.jpg', ?),
                   ('EjercicioPrueba15', 'fuerza', 'brazos', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2j.jpg', ?),
                   ('EjercicioPrueba16', 'fuerza', 'pecho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2k.jpg', ?),
                   ('EjercicioPrueba17', 'fuerza', 'espalda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2l.jpg', ?),
                   ('EjercicioPrueba18', 'fuerza', 'abdomen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2m.jpg', ?),
                   ('EjercicioPrueba19', 'aerobico', 'piernas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2n.jpg', ?),
                   ('EjercicioPrueba20', 'aerobico', 'hombros', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2o.jpg', ?),
                   ('EjercicioPrueba21', 'aerobico', 'brazos', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2p.jpg', ?),
                   ('EjercicioPrueba22', 'aerobico', 'pecho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2q.jpg', ?),
                   ('EjercicioPrueba23', 'aerobico', 'espalda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2r.jpg', ?),
                   ('EjercicioPrueba24', 'aerobico', 'abdomen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2s.jpg', ?),
                   ('EjercicioPrueba25', 'flexibilidad', 'piernas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2t.jpg', ?),
                   ('EjercicioPrueba26', 'flexibilidad', 'hombros', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2u.jpg', ?),
                   ('EjercicioPrueba27', 'flexibilidad', 'brazos', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2v.jpg', ?),
                   ('EjercicioPrueba28', 'flexibilidad', 'pecho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2w.jpg', ?),
                   ('EjercicioPrueba29', 'flexibilidad', 'espalda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2x.jpg', ?),
                   ('EjercicioPrueba30', 'flexibilidad', 'abdomen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2y.jpg', ?),
                   ('EjercicioPrueba31', 'fuerza', 'piernas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'ab402dd7-9ee7-4193-9d69-241fd48aca2z.jpg', ?),
                   ('EjercicioPrueba32', 'fuerza', 'hombros', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02740.jpg', ?),
                   ('EjercicioPrueba33', 'fuerza', 'brazos', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02741.jpg', ?),
                   ('EjercicioPrueba34', 'fuerza', 'pecho', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02742.jpg', ?),
                   ('EjercicioPrueba35', 'fuerza', 'espalda', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02743.jpg', ?),
                   ('EjercicioPrueba36', 'fuerza', 'abdomen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'a4a54e9a-d0fd-474e-a63e-c2e5d0d02744.jpg', ?)
            `,
            [
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
                new Date(),
            ]
        );
        console.log('¡Ejercicios de prueba creados!');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();
