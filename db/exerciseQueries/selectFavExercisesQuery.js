const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const selectFavExercisesQuery = async (idUser) => {
    let connection;

    try {
        connection = await getConnection();

        let [exercises] = await connection.query(
            `
                SELECT E.id,
                    E.idUser, 
                    E.name,
                    E.type,
                    E.muscle_group,
                    E.description,                      
                    E.image,
                    SUM(IFNULL(L.value = true, 0)) AS likes,
                    E.idUser = ? AS owner, 
                    BIT_OR(L.idUser = ? AND L.value = 1) AS likedByMe,  
                    E.modifiedAt,
                    E.createdAt                    
                FROM exercises E 
                LEFT JOIN likes L ON E.id = L.idExercise
                LEFT JOIN favs F ON E.id = F.idExercise
                LEFT JOIN users U ON E.idUser = U.id                               
                WHERE F.idUser = ? AND F.value = 1
                GROUP BY E.id
                ORDER BY likes DESC
            `,
            [idUser, idUser, idUser]
        );

        if (exercises.length < 1) {
            throw generateError('No se ha encontrado ningún ejercicio', 404);
        }

        return exercises;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectFavExercisesQuery;
