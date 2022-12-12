const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const selectAllExercisesQuery = async (
    idUser,
    type = '',
    muscle_group = ''
) => {
    // If it is undefined it is now an empty array.
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
                    BIT_OR(F.idUser = ? AND F.value = 1) AS favedByMe,
                    E.modifiedAt,
                    E.createdAt                    
                FROM exercises E 
                LEFT JOIN likes L ON E.id = L.idExercise
                LEFT JOIN favs F ON E.id = F.idExercise
                LEFT JOIN users U ON E.idUser = U.id
                WHERE E.type LIKE ? AND E.muscle_group LIKE ?               
                GROUP BY E.id
                ORDER BY E.createdAt DESC
            `,
            [idUser, idUser, idUser, `%${type}%`, `%${muscle_group}%`]
        );

        if (exercises.length < 1) {
            throw generateError('No se ha encontrado ningún ejercicio', 404);
        }

        return exercises;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectAllExercisesQuery;
